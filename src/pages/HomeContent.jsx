import React from 'react'
import Templates from '../components/Templates.jsx'
import Workspace from '../components/Workspace.jsx'
import Showcase from '../components/Showcase.jsx'

export default function HomeContent(){
  const onNav = e => {
    const id = e.currentTarget.getAttribute('href')
    const el = document.querySelector(id)
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  }
  return (
    <>
      <section className="hero section" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="chips"><span className="chip">🛰️ Agentic AI</span><span className="chip">地理空间智能</span><span className="chip">端到端平台</span></div>
            <h1 className="hero-title">Agentic AI for Satellite Intelligence</h1>
            <p className="hero-sub">构建卫星驱动的应用，不再耗时数月。拉取数据、搭建分析并部署到地面或在轨环境，全部在一个安全工作空间中完成。</p>
            <div className="hero-ctas"><a className="btn btn-primary" href="#cta" onClick={onNav}>开始构建</a><a className="btn btn-outline" href="#templates" onClick={onNav}>浏览模板</a></div>
            <div className="trust"><span>受到能源、矿业与通信领域创新者的信任</span><div className="logos"><span className="logo">ENERGY</span><span className="logo">MINING</span><span className="logo">TELECOM</span><span className="logo">GOV</span></div></div>
          </div>
        </div>
        <div className="hero-bg"></div>
      </section>

      <section className="section" id="product">
        <div className="container">
          <div className="section-head"><h2>一个工作空间完成全流程</h2><p>从卫星数据到生产输出，拉取数据、协作构建分析并部署应用，无需交接与等待。</p></div>
          <div className="grid steps">
            <div className="card step"><div className="step-icon">🗺️</div><h3>定义区域</h3><p>绘制港口、基建或感兴趣区域的边界。</p></div>
            <div className="card step"><div className="step-icon">🔎</div><h3>搜索数据</h3><p>查询 Sentinel、Landsat 等公共与商业数据源。</p></div>
            <div className="card step"><div className="step-icon">🧪</div><h3>生成分析代码</h3><p>Notebook 代理理解数据与目标并生成可复用分析。</p></div>
            <div className="card step"><div className="step-icon">📊</div><h3>构建与部署</h3><p>生成仪表盘、发布交互地图，或封装完整应用。</p></div>
          </div>
        </div>
      </section>

      <Showcase />
      <Templates />
      <Workspace />

      <section className="section" id="outputs">
        <div className="container">
          <div className="section-head"><h2>生产级输出默认就绪</h2><p>生成仪表盘、发布地图、导出报告与打包应用，内置审计日志、访问控制与合规模块。</p></div>
          <div className="grid features">
            <div className="feature"><div className="feature-icon">📈</div><div className="feature-text">生成仪表盘</div></div>
            <div className="feature"><div className="feature-icon">🗺️</div><div className="feature-text">发布交互地图</div></div>
            <div className="feature"><div className="feature-icon">📄</div><div className="feature-text">导出报告</div></div>
            <div className="feature"><div className="feature-icon">🧩</div><div className="feature-text">封装完整应用</div></div>
            <div className="feature"><div className="feature-icon">🔐</div><div className="feature-text">内置安全与合规</div></div>
          </div>
        </div>
      </section>

      <section className="section alt" id="faq">
        <div className="container">
          <div className="section-head"><h2>常见问题</h2><p>从首次查询到生产部署，我们如何降低复杂度并提升可控性。</p></div>
          <div className="faq">
            <details><summary>如何访问公共与商业数据集</summary><p>通过统一数据访问层直接查询 Sentinel、Landsat 等数据源，并可接入自有卫星馈送。</p></details>
            <details><summary>Notebook 代理能做什么</summary><p>代理理解数据与目标，帮助生成分析代码、优化流程并保持可复用与可审计。</p></details>
            <details><summary>输出如何交付</summary><p>默认支持生成仪表盘、交互地图与报告，可一键部署到边缘或云端。</p></details>
          </div>
        </div>
      </section>

      <section className="section cta" id="cta">
        <div className="container">
          <h2>立即开始构建</h2>
          <p>在一个安全的工作空间中，快速从卫星数据到生产输出。</p>
          <div className="hero-ctas"><a className="btn btn-primary" href="#">注册试用</a><a className="btn btn-outline" href="#templates" onClick={onNav}>浏览模板</a></div>
        </div>
      </section>
    </>
  )
}
