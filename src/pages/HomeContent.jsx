import React from 'react'
import Templates from '../components/Templates.jsx'
import Workspace from '../components/Workspace.jsx'
import Showcase from '../components/Showcase.jsx'
import FeaturesCarousel from '../components/FeaturesCarousel.jsx'

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

      <FeaturesCarousel />

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
          <div className="section-head"><h2>常见问题</h2><p>从数据接入到部署交付，AstraFlux 为你简化每一步。</p></div>
          <div className="faq">
            <details>
              <summary>在这里能接入并处理个人数据吗？</summary>
              <p>可以。AstraFlux 兼容开放与商业卫星影像，也支持无人机和物联网数据。只要你能通过 API 或文件上传获取，我们就能直接接入。</p>
            </details>
            <details>
              <summary>使用者需要 GIS 专家才能上手吗？</summary>
              <p>不需要。普通数据处理师可直接上手，无需任何 GIS 交接。你的 Notebook 一键生成地图，团队成员即使不懂 GIS 也能无缝协作。</p>
            </details>
            <details>
              <summary>能使用平台跟使用者现有的工具对接吗？</summary>
              <p>可以。直接导入你的 Jupyter Notebook 和 Python 流程，秒级接入 IoT 传感器、无人机影像、卫星数据等现有源。我们还在持续扩充更多工具集成。</p>
            </details>
            <details>
              <summary>部署需要多久？</summary>
              <p>几分钟，而非数周。接入数据源 → 转换 Notebook → 一键上线，无需搭建后端，也无需排队等 IT 审批。</p>
            </details>
            <details>
              <summary>现在就能用，还是仍在测试？</summary>
              <p>目前处于公开测试阶段，会持续滚动接收新团队。申请抢先体验即可加入下一批用户。</p>
            </details>
            <details>
              <summary>个人数据会被如何处理？</summary>
              <p>数据始终归你所有。我们不会用它训练模型，也不会对外共享。若对数据主权有要求，很快你还能把整套系统直接部署到自己的 AWS/Azure 环境里。</p>
            </details>
            <details>
              <summary>对于受监管行业，安全性够吗？</summary>
              <p>除了角色权限与完整审计日志，我们正陆续推出更多增强安全功能，以满足合规要求。</p>
            </details>
            <details>
              <summary>数据接入怎么操作？</summary>
              <p>我们正持续对接更多数据提供商与聚合平台。企业可：</p>
              <ul>
                <li>沿用已有的商业影像合约；</li>
                <li>直连现有数据供应商；</li>
                <li>或直接选用我们的数据源。</li>
              </ul>
              <p>使用商业影像需通过一次快速 KYC 验证即可开通权限。</p>
            </details>
            <details>
              <summary>可以给客户输出白标版本吗？</summary>
              <p>可以。企业版支持自定义品牌模式，可在仪表盘上替换为贵司的 Logo 与配色，客户看到的只有你们的品牌，毫无我们的标识。</p>
            </details>
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
