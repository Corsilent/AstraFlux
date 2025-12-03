import http from 'http'

const templates = [
  { id: 'port-monitor', title: '港口活动监测', description: '识别船只与泊位变化，输出每日报告与告警。' },
  { id: 'infra-change', title: '基础设施变化检测', description: '对比多时相影像，高亮施工与异常。' },
  { id: 'landcover', title: '地物分类', description: '道路、植被与水体分割，支持精细化标注。' },
  { id: 'disaster', title: '灾害评估', description: '洪涝与火灾范围提取，辅助应急响应。' }
]

let aoiStore = []
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end() }
  if (req.method === 'GET' && req.url === '/api/templates') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return res.end(JSON.stringify(templates))
  }
  if (req.method === 'GET' && req.url === '/api/aoi') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return res.end(JSON.stringify(aoiStore))
  }
  if (req.method === 'POST' && req.url === '/api/aoi') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}')
        if (data && data.id && data.geojson) {
          aoiStore = aoiStore.filter(x => x.id !== data.id)
          aoiStore.push({ id: data.id, name: data.name || data.id, geojson: data.geojson, areaKm2: data.areaKm2 || null })
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ ok: true }))
        } else {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Invalid AOI payload' }))
        }
      } catch (e) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Bad JSON' }))
      }
    })
    return
  }
  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ error: 'Not Found' }))
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  process.stdout.write(`API listening on http://localhost:${port}\n`)
})
