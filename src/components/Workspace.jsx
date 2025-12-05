import React from 'react'
import Map from './map/Map.jsx'

export default function Workspace({ lang='zh' }){
  return (
    <section className="section alt" id="workspace">
      <div className="container">
        <div className="section-head">
          <h2>{lang==='zh'?'协作工作空间与 Notebook 代理':'Collaborative Workspace & Notebook Agent'}</h2>
          <p>{lang==='zh'?'实时协作、评论与分配任务。代理理解上下文与代码，协助完成从数据到交付的全过程。':'Real-time collaboration, comments, and task assignment. The agent understands context and code, helping from data to delivery.'}</p>
        </div>
        <div className="workspace">
          <div className="workspace-preview">
            <div className="toolbar">
              <span>analysis.ipynb</span>
              <div className="dots"><span></span><span></span><span></span></div>
            </div>
            <div className="preview">
              <div className="preview-col">
                <div className="preview-block">{lang==='zh'?'代码单元':'Code cells'}</div>
                <div className="preview-block">{lang==='zh'?'图层列表':'Layer list'}</div>
                <div className="preview-block">{lang==='zh'?'任务与评论':'Tasks & comments'}</div>
              </div>
              <Map />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
