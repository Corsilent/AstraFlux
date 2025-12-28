import dotenv from 'dotenv'
dotenv.config()
dotenv.config({ path: '.env.local' })
if (String(process.env.PGSSLMODE || '').toLowerCase() === 'noverify') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}
import express from 'express'
import { Pool } from 'pg'
import Datastore from 'nedb-promises'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'

const templates = [
  { id: 'port-monitor', title: '港口活动监测', description: '识别船只与泊位变化，输出每日报告与告警。' },
  { id: 'infra-change', title: '基础设施变化检测', description: '对比多时相影像，高亮施工与异常。' },
  { id: 'landcover', title: '地物分类', description: '道路、植被与水体分割，支持精细化标注。' },
  { id: 'disaster', title: '灾害评估', description: '洪涝与火灾范围提取，辅助应急响应。' }
]

const app = express()
app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); if (req.method === 'OPTIONS') { res.status(204).end(); } else { next() } })
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false, require: true }
})
const usersStore = Datastore.create({ filename: 'server/users.db', autoload: true })
const aoiStore = Datastore.create({ filename: 'server/aoi.db', autoload: true })
const invitesStore = Datastore.create({ filename: 'server/invites.db', autoload: true })
let usePg = true
async function init(){
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
      id BIGSERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS aoi(
      id TEXT PRIMARY KEY,
      name TEXT,
      geojson JSONB NOT NULL,
      area_km2 DOUBLE PRECISION,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS invites(
      code TEXT PRIMARY KEY,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      used_at TIMESTAMPTZ
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS secrets(
      k TEXT PRIMARY KEY,
      v TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    const codes = String(process.env.INVITE_CODES || '').split(',').map(s=>s.trim()).filter(Boolean)
    for (const c of codes) {
      await pool.query('INSERT INTO invites(code, used) VALUES($1,false) ON CONFLICT(code) DO NOTHING', [c])
    }
    const dsEnv = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || ''
    const gmEnv = process.env.GEMINI_API_KEY || process.env.VITE_OPENAI_API_KEY || ''
    if (dsEnv) {
      await pool.query('INSERT INTO secrets(k, v, updated_at) VALUES($1,$2,now()) ON CONFLICT(k) DO UPDATE SET v=EXCLUDED.v, updated_at=EXCLUDED.updated_at', ['deepseek_api_key', dsEnv])
    }
    if (gmEnv) {
      await pool.query('INSERT INTO secrets(k, v, updated_at) VALUES($1,$2,now()) ON CONFLICT(k) DO UPDATE SET v=EXCLUDED.v, updated_at=EXCLUDED.updated_at', ['gemini_api_key', gmEnv])
    }
    process.stdout.write('DB: Postgres connected\n')
  } catch (e) {
    usePg = false
    process.stderr.write('DB: Postgres unavailable, fallback to local DB\n')
    process.stderr.write(String(e)+'\n')
  }
}
init().catch(e=>{ usePg = false; process.stderr.write('DB init error\n'); process.stderr.write(String(e)+'\n') })
async function secretGet(key){
  if (usePg) { const r = await pool.query('SELECT v FROM secrets WHERE k=$1', [key]); return r.rowCount ? r.rows[0].v : '' }
  return ''
}
async function secretSet(key, value){
  if (!key) return
  if (usePg) {
    await pool.query('INSERT INTO secrets(k, v, updated_at) VALUES($1, $2, now()) ON CONFLICT(k) DO UPDATE SET v=EXCLUDED.v, updated_at=EXCLUDED.updated_at', [key, value])
    return
  }
}
async function callGemini(apiKey, prompt, version, model){
  const response = await fetch(`https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } })
  })
  const ct = response.headers.get('content-type') || ''
  if (!ct.includes('application/json')) { const tx = await response.text(); throw new Error(`Non-JSON response: ${tx.substring(0,80)}...`) }
  if (!response.ok) { const ed = await response.json(); const em = ed.error?.message || `API Error: ${response.status}`; throw new Error(em) }
  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')
  return text
}
async function callDeepseek(apiKey, prompt){
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.7 })
  })
  const ct = response.headers.get('content-type') || ''
  if (!ct.includes('application/json')) { const tx = await response.text(); throw new Error(`Non-JSON response: ${tx.substring(0,80)}...`) }
  if (!response.ok) { const ed = await response.json(); const em = ed.error?.message || `API Error: ${response.status}`; throw new Error(em) }
  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text
  if (!text) throw new Error('Empty response from Deepseek')
  return text
}

async function usersFindByEmail(email){
  if (usePg) { const r = await pool.query('SELECT id,email,password_hash FROM users WHERE email=$1', [email]); return r.rowCount ? r.rows[0] : null }
  return await usersStore.findOne({ email })
}
async function usersInsert(email, hash){
  if (usePg) { const r = await pool.query('INSERT INTO users(email, password_hash) VALUES($1,$2) RETURNING id,email,created_at', [email, hash]); return r.rows[0] }
  return await usersStore.insert({ email, password_hash: hash, createdAt: Date.now() })
}
async function aoiList(){
  if (usePg) { const r = await pool.query('SELECT id,name,geojson,area_km2,created_at FROM aoi ORDER BY created_at DESC'); return r.rows }
  return await aoiStore.find({}).sort({ createdAt: -1 })
}
async function aoiUpsert(d){
  if (usePg) {
    await pool.query(
      'INSERT INTO aoi(id,name,geojson,area_km2,created_at) VALUES($1,$2,$3::jsonb,$4,now()) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name, geojson=EXCLUDED.geojson, area_km2=EXCLUDED.area_km2, created_at=EXCLUDED.created_at',
      [d.id, d.name || d.id, JSON.stringify(d.geojson), d.areaKm2 || null]
    )
    return
  }
  await aoiStore.update({ id: d.id }, { id: d.id, name: d.name || d.id, geojson: d.geojson, areaKm2: d.areaKm2 || null, createdAt: Date.now() }, { upsert: true })
}

async function inviteCheck(code){
  if (!code) return false
  if (usePg) {
    const r = await pool.query('SELECT code, used FROM invites WHERE code=$1', [code])
    return r.rowCount > 0 && !r.rows[0].used
  }
  const doc = await invitesStore.findOne({ code })
  return !!doc && !doc.used
}

async function inviteConsume(code){
  if (!code) return
  if (usePg) {
    await pool.query('UPDATE invites SET used=true, used_at=now() WHERE code=$1 AND used=false', [code])
    return
  }
  const doc = await invitesStore.findOne({ code })
  if (doc && !doc.used) {
    await invitesStore.update({ code }, { ...doc, used: true, usedAt: Date.now() }, {})
  }
}

app.get('/api/templates', (req, res) => { res.json(templates) })

app.get('/api/status', async (req, res) => {
  try {
    if (usePg) {
      const r = await pool.query('SELECT COUNT(1) AS c FROM invites')
      return res.json({ ok: true, db: 'postgres', invites: Number(r.rows[0].c) })
    } else {
      const c = await invitesStore.count({})
      return res.json({ ok: true, db: 'nedb', invites: c })
    }
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) })
  }
})

app.get('/api/invites/check/:code', async (req, res) => {
  const code = String(req.params.code || '').trim()
  if (!code) return res.status(400).json({ ok: false, error: 'Missing code' })
  const ok = await inviteCheck(code)
  res.json({ ok, code })
})

app.post('/api/register', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  const invite = String(req.body.invite || '').trim()
  if (!email || !password || password.length < 6) return res.status(400).json({ error: 'Invalid payload' })
  const okInvite = await inviteCheck(invite)
  if (!okInvite) return res.status(403).json({ error: 'Invalid or missing invite' })
  const exists = await usersFindByEmail(email)
  if (exists) return res.status(409).json({ error: 'User exists' })
  const hash = bcrypt.hashSync(password, 10)
  const user = await usersInsert(email, hash)
  const uid = usePg ? user.id : user._id
  const token = jwt.sign({ uid, email }, JWT_SECRET, { expiresIn: '7d' })
  await inviteConsume(invite)
  res.json({ ok: true, token, user: { email } })
})

app.post('/api/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  const user = await usersFindByEmail(email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = bcrypt.compareSync(password, user.password_hash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const uid = usePg ? user.id : user._id
  const token = jwt.sign({ uid, email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ ok: true, token, user: { email } })
})

function auth(req, res, next){ const h = req.headers.authorization || ''; const m = h.match(/^Bearer\s+(.*)$/i); if (!m) return res.status(401).json({ error: 'Unauthorized' }); try { req.user = jwt.verify(m[1], JWT_SECRET); next() } catch(e){ return res.status(401).json({ error: 'Unauthorized' }) } }

app.get('/api/me', auth, (req, res) => { res.json({ ok: true, user: { email: req.user.email } }) })

app.get('/api/aoi', async (req, res) => { const list = await aoiList(); res.json(list) })
app.post('/api/aoi', async (req, res) => { const d = req.body || {}; if (!d.id || !d.geojson) return res.status(400).json({ error: 'Invalid AOI payload' }); await aoiUpsert(d); res.json({ ok: true }) })
app.get('/api/admin/secrets-exists', async (req, res) => {
  try {
    if (!usePg) return res.json({ exists: false, db: 'nedb' })
    const r = await pool.query(`SELECT EXISTS (
      SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='secrets'
    ) AS e`)
    return res.json({ exists: !!(r.rows?.[0]?.e), db: 'postgres' })
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) })
  }
})
app.post('/api/admin/secrets-set', async (req, res) => {
  try {
    const adminCode = req.headers['x-admin-code'] || ''
    const required = process.env.ADMIN_SECRET || ''
    if (!required || adminCode !== required) return res.status(403).json({ error: 'Forbidden' })
    const k = String((req.body || {}).k || '').trim()
    const v = String((req.body || {}).v || '').trim()
    if (!k || !v) return res.status(400).json({ error: 'Missing k or v' })
    await secretSet(k, v)
    return res.json({ ok: true })
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) })
  }
})
app.post('/api/ai/gemini', async (req, res) => {
  try {
    const prompt = String((req.body || {}).prompt || '').trim()
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' })
    const keyEnv = process.env.GEMINI_API_KEY || process.env.VITE_OPENAI_API_KEY || ''
    const keyDb = await secretGet('gemini_api_key')
    const apiKey = keyEnv || keyDb
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key missing' })
    const configs = [
      { version: 'v1', model: 'gemini-2.0-flash-lite' },
      { version: 'v1', model: 'gemini-2.0-flash-lite-001' },
      { version: 'v1', model: 'gemini-2.5-flash-lite' },
      { version: 'v1', model: 'gemini-1.5-flash' },
      { version: 'v1', model: 'gemini-1.5-pro' },
      { version: 'v1', model: 'gemini-1.0-pro' },
    ]
    let lastError = null
    for (const c of configs) {
      try { const text = await callGemini(apiKey, prompt, c.version, c.model); if (text) return res.json({ text }) } catch(e){ lastError = e }
    }
    if (lastError) return res.status(500).json({ error: String(lastError.message || lastError) })
    return res.status(500).json({ error: 'All Gemini model calls failed' })
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) })
  }
})
app.post('/api/ai/deepseek', async (req, res) => {
  try {
    const prompt = String((req.body || {}).prompt || '').trim()
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' })
    const keyEnv = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || ''
    const keyDb = await secretGet('deepseek_api_key')
    const apiKey = keyEnv || keyDb
    if (!apiKey) return res.status(500).json({ error: 'Deepseek API key missing' })
    const text = await callDeepseek(apiKey, prompt)
    return res.json({ text })
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => { process.stdout.write(`API listening on http://localhost:${port}\n`) })
