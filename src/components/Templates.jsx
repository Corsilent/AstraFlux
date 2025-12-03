import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

async function getTemplates(){
  const r = await fetch('/api/templates')
  if(!r.ok) throw new Error('模板加载失败')
  return r.json()
}

export default function Templates(){
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
          <h2>模板库与数据访问</h2>
          <p>无需下载与集成，使用可复用的构件快速起步，覆盖监测、变化检测与特征分类等场景。</p>
        </div>
        {loading && <div style={{textAlign:'center'}}>正在加载模板…</div>}
        {error && <div style={{textAlign:'center', color:'tomato'}}>{error}</div>}
        {!loading && !error && (
          <div className="grid cards">
            {items.map(it => (
              <div key={it.id} className="card">
                <div className="card-top">{it.title}</div>
                <div className="card-body">{it.description}</div>
                <div>
                  <Link className="btn btn-soft" to={`/task/${it.id}`}>查看流程 →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
