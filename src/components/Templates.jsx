import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

async function getTemplates(){
  const API = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000' : '')
  if (!API) {
    return [
      { id: 'port-monitor', title: '港口活动监测', description: '识别船只与泊位变化，输出每日报告与告警。' },
      { id: 'infra-change', title: '基础设施变化检测', description: '对比多时相影像，高亮施工与异常。' },
      { id: 'landcover', title: '地物分类', description: '道路、植被与水体分割，支持精细化标注。' },
      { id: 'disaster', title: '灾害评估', description: '洪涝与火灾范围提取，辅助应急响应。' }
    ]
  }
  const r = await fetch(`${API}/api/templates`)
  if(!r.ok) throw new Error('模板加载失败')
  return r.json()
}

export default function Templates({ lang='zh' }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    getTemplates().then(d => { setItems(d); setLoading(false) }).catch(e => { setError(e.message); setLoading(false) })
  }, [])
  return (
    <section className="section" id="templates">
      <div className="container">
        <div className="section-head">
          <h2>{lang==='zh'?'模板库与数据访问':'Templates & Data Access'}</h2>
          <p>{lang==='zh'?'无需下载与集成，使用可复用的构件快速起步，覆盖监测、变化检测与特征分类等场景。':'Start fast with reusable blocks — monitoring, change detection, and feature classification.'}</p>
        </div>
        {loading && <div style={{textAlign:'center'}}>{lang==='zh'?'正在加载模板…':'Loading templates…'}</div>}
        {error && <div style={{textAlign:'center', color:'tomato'}}>{error}</div>}
        {!loading && !error && (
          <div className="grid cards">
            {items.map(it => (
              <div key={it.id} className="card">
                <div className="card-top">{it.title}</div>
                <div className="card-body">{it.description}</div>
                <div>
                  <Link className="btn btn-soft" to={`/task/${it.id}`}>{lang==='zh'?'查看流程 →':'View Flow →'}</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
