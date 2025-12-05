import 'dotenv/config'
import express from 'express'
import { Pool } from 'pg'
import Datastore from 'nedb-promises'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
const usersStore = Datastore.create({ filename: 'server/users.db', autoload: true })
const aoiStore = Datastore.create({ filename: 'server/aoi.db', autoload: true })
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
    process.stdout.write('DB: Postgres connected\n')
  } catch (e) {
    usePg = false
    process.stderr.write('DB: Postgres unavailable, fallback to local DB\n')
    process.stderr.write(String(e)+'\n')
  }
}
init().catch(e=>{ usePg = false; process.stderr.write('DB init error\n'); process.stderr.write(String(e)+'\n') })

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

app.get('/api/templates', (req, res) => { res.json(templates) })

app.post('/api/register', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  if (!email || !password || password.length < 6) return res.status(400).json({ error: 'Invalid payload' })
  const exists = await usersFindByEmail(email)
  if (exists) return res.status(409).json({ error: 'User exists' })
  const hash = bcrypt.hashSync(password, 10)
  const user = await usersInsert(email, hash)
  const uid = usePg ? user.id : user._id
  const token = jwt.sign({ uid, email }, JWT_SECRET, { expiresIn: '7d' })
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

const port = process.env.PORT || 3000
app.listen(port, () => { process.stdout.write(`API listening on http://localhost:${port}\n`) })
