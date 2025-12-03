import React from 'react'
import Map from './map/Map.jsx'

export default function Workspace(){
  return (
    <section className="section alt" id="workspace">
      <div className="container">
        <div className="section-head">
          <h2>协作工作空间与 Notebook 代理</h2>
          <p>实时协作、评论与分配任务。代理理解上下文与代码，协助完成从数据到交付的全过程。</p>
        </div>
        <div className="workspace">
          <div className="workspace-preview">
            <div className="toolbar">
              <span>analysis.ipynb</span>
              <div className="dots"><span></span><span></span><span></span></div>
            </div>
            <div className="preview">
              <div className="preview-col">
                <div className="preview-block">代码单元</div>
                <div className="preview-block">图层列表</div>
                <div className="preview-block">任务与评论</div>
              </div>
              <Map />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
