import React from 'react'
import Templates from '../components/Templates.jsx'
import Workspace from '../components/Workspace.jsx'
import Showcase from '../components/Showcase.jsx'
import FeaturesCarousel from '../components/FeaturesCarousel.jsx'

export default function HomeContent({ lang='zh' }){
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
            <div className="chips"><span className="chip">🛰️ Agentic AI</span><span className="chip">{lang==='zh'?'地理空间智能':'Geospatial Intelligence'}</span><span className="chip">{lang==='zh'?'端到端平台':'End-to-End Platform'}</span></div>
            <h1 className="hero-title">{lang==='zh'?'Agentic AI for Satellite Intelligence':'Agentic AI for Satellite Intelligence'}</h1>
            <p className="hero-sub">{lang==='zh'?'构建卫星驱动的应用，不再耗时数月。拉取数据、搭建分析并部署到地面或在轨环境，全部在一个安全工作空间中完成。':'Build satellite-powered apps in weeks, not months. Fetch data, design analyses, and deploy to ground or on-orbit environments — all in one secure workspace.'}</p>
            <div className="hero-ctas"><a className="btn btn-primary" href="#cta" onClick={onNav}>{lang==='zh'?'开始构建':'Get Started'}</a><a className="btn btn-outline" href="#templates" onClick={onNav}>{lang==='zh'?'浏览模板':'Browse Templates'}</a></div>
            <div className="trust"><span>{lang==='zh'?'受到能源、矿业与通信领域创新者的信任':'Trusted by innovators in energy, mining, and telecom'}</span><div className="logos"><span className="logo">ENERGY</span><span className="logo">MINING</span><span className="logo">TELECOM</span><span className="logo">GOV</span></div></div>
          </div>
        </div>
        <div className="hero-bg"></div>
      </section>

      <section className="section" id="product">
        <div className="container">
          <div className="section-head"><h2>{lang==='zh'?'一个工作空间完成全流程':'One workspace for the full flow'}</h2><p>{lang==='zh'?'从卫星数据到生产输出，拉取数据、协作构建分析并部署应用，无需交接与等待。':'From satellite data to production outputs, fetch, collaborate, build, and deploy without handoffs.'}</p></div>
          <div className="grid steps">
            <div className="card step"><div className="step-icon">🗺️</div><h3>{lang==='zh'?'定义区域':'Define AOI'}</h3><p>{lang==='zh'?'绘制港口、基建或感兴趣区域的边界。':'Draw boundaries for ports, infrastructure, or areas of interest.'}</p></div>
            <div className="card step"><div className="step-icon">🔎</div><h3>{lang==='zh'?'搜索数据':'Search data'}</h3><p>{lang==='zh'?'查询 Sentinel、Landsat 等公共与商业数据源。':'Query public and commercial sources like Sentinel and Landsat.'}</p></div>
            <div className="card step"><div className="step-icon">🧪</div><h3>{lang==='zh'?'生成分析代码':'Generate analysis'}</h3><p>{lang==='zh'?'Notebook 代理理解数据与目标并生成可复用分析。':'Notebook agent understands context and generates reusable analyses.'}</p></div>
            <div className="card step"><div className="step-icon">📊</div><h3>{lang==='zh'?'构建与部署':'Build & deploy'}</h3><p>{lang==='zh'?'生成仪表盘、发布交互地图，或封装完整应用。':'Publish dashboards, interactive maps, or full applications.'}</p></div>
          </div>
        </div>
      </section>

      <Showcase lang={lang} />
      <Templates lang={lang} />
      <Workspace lang={lang} />

      <FeaturesCarousel />

      <section className="section" id="outputs">
        <div className="container">
          <div className="section-head"><h2>{lang==='zh'?'生产级输出默认就绪':'Production-grade outputs by default'}</h2><p>{lang==='zh'?'生成仪表盘、发布地图、导出报告与打包应用，内置审计日志、访问控制与合规模块。':'Dashboards, maps, reports, and apps — with audit logs, access control, and compliance built in.'}</p></div>
          <div className="grid features">
            <div className="feature"><div className="feature-icon">📈</div><div className="feature-text">{lang==='zh'?'生成仪表盘':'Publish dashboards'}</div></div>
            <div className="feature"><div className="feature-icon">🗺️</div><div className="feature-text">{lang==='zh'?'发布交互地图':'Interactive maps'}</div></div>
            <div className="feature"><div className="feature-icon">📄</div><div className="feature-text">{lang==='zh'?'导出报告':'Export reports'}</div></div>
            <div className="feature"><div className="feature-icon">🧩</div><div className="feature-text">{lang==='zh'?'封装完整应用':'Package applications'}</div></div>
            <div className="feature"><div className="feature-icon">🔐</div><div className="feature-text">{lang==='zh'?'内置安全与合规':'Security & compliance'}</div></div>
          </div>
        </div>
      </section>

      <section className="section alt" id="faq">
        <div className="container">
          <div className="section-head"><h2>{lang==='zh'?'常见问题':'FAQ'}</h2><p>{lang==='zh'?'从数据接入到部署交付，AstraFlux 为你简化每一步。':'From data access to deployment, AstraFlux simplifies every step.'}</p></div>
          <div className="faq">
            <details>
              <summary>{lang==='zh'?'在这里能接入并处理个人数据吗？':'Can I connect and process personal data here?'}</summary>
              <p>{lang==='zh'?'可以。AstraFlux 兼容开放与商业卫星影像，也支持无人机和物联网数据。只要你能通过 API 或文件上传获取，我们就能直接接入。':'Yes. AstraFlux is compatible with open and commercial satellite imagery, and supports UAV and IoT data. If you can access data via API or file upload, we can connect it directly.'}</p>
            </details>
            <details>
              <summary>{lang==='zh'?'使用者需要 GIS 专家才能上手吗？':'Do users need GIS experts to get started?'}</summary>
              <p>{lang==='zh'?'不需要。普通数据处理师可直接上手，无需任何 GIS 交接。你的 Notebook 一键生成地图，团队成员即使不懂 GIS 也能无缝协作。':'No. Analysts can start directly without any GIS handoffs. Your notebook generates maps with one click, and teammates can collaborate even without GIS expertise.'}</p>
            </details>
            <details>
              <summary>{lang==='zh'?'能使用平台跟使用者现有的工具对接吗？':'Can the platform integrate with our existing tools?'}</summary>
              <p>{lang==='zh'?'可以。直接导入你的 Jupyter Notebook 和 Python 流程，秒级接入 IoT 传感器、无人机影像、卫星数据等现有源。我们还在持续扩充更多工具集成。':'Yes. Import your Jupyter notebooks and Python pipelines, and connect IoT sensors, UAV imagery, and satellite data in seconds. We are continuously adding more integrations.'}</p>
            </details>
            <details>
              <summary>{lang==='zh'?'部署需要多久？':'How long does deployment take?'}</summary>
              <p>{lang==='zh'?'几分钟，而非数周。接入数据源 → 转换 Notebook → 一键上线，无需搭建后端，也无需排队等 IT 审批。':'Minutes, not weeks. Connect sources → convert notebooks → one-click deploy, with no backend setup or IT approval queues.'}</p>
            </details>
            <details>
              <summary>{lang==='zh'?'现在就能用，还是仍在测试？':'Is it ready now, or still in testing?'}</summary>
              <p>{lang==='zh'?'目前处于公开测试阶段，会持续滚动接收新团队。申请抢先体验即可加入下一批用户。':'We are in public beta, onboarding new teams continuously. Apply for early access to join the next cohort.'}</p>
            </details>
            <details>
              <summary>{lang==='zh'?'个人数据会被如何处理？':'How is personal data handled?'}</summary>
              <p>{lang==='zh'?'数据始终归你所有。我们不会用它训练模型，也不会对外共享。若对数据主权有要求，很快你还能把整套系统直接部署到自己的 AWS/Azure 环境里。':'Your data is always yours. We do not use it to train models or share externally. For data sovereignty, you will soon be able to deploy the entire system to your own AWS/Azure environment.'}</p>
            </details>
            <details>
              <summary>{lang==='zh'?'对于受监管行业，安全性够吗？':'Is security sufficient for regulated industries?'}</summary>
              <p>{lang==='zh'?'除了角色权限与完整审计日志，我们正陆续推出更多增强安全功能，以满足合规要求。':'Beyond roles and full audit logs, we are rolling out enhanced security features to meet compliance requirements.'}</p>
            </details>
            <details>
              <summary>{lang==='zh'?'数据接入怎么操作？':'How do we connect data sources?'}</summary>
              <p>{lang==='zh'?'我们正持续对接更多数据提供商与聚合平台。企业可：':'We are integrating more providers and aggregators. You can:'}</p>
              <ul>
                <li>{lang==='zh'?'沿用已有的商业影像合约；':'Use existing commercial imagery contracts'}</li>
                <li>{lang==='zh'?'直连现有数据供应商；':'Connect to current data vendors'}</li>
                <li>{lang==='zh'?'或直接选用我们的数据源。':'Or select our provided sources'}</li>
              </ul>
              <p>{lang==='zh'?'使用商业影像需通过一次快速 KYC 验证即可开通权限。':'Commercial imagery requires a quick KYC verification to enable access.'}</p>
            </details>
            <details>
              <summary>{lang==='zh'?'可以给客户输出白标版本吗？':'Can we offer a white-label version to clients?'}</summary>
              <p>{lang==='zh'?'可以。企业版支持自定义品牌模式，可在仪表盘上替换为贵司的 Logo 与配色，客户看到的只有你们的品牌，毫无我们的标识。':'Yes. The enterprise edition supports custom branding, allowing dashboards to reflect your logo and colors so customers only see your brand.'}</p>
            </details>
          </div>
        </div>
      </section>

      <section className="section cta" id="cta">
        <div className="container">
          <h2>{lang==='zh'?'立即开始构建':'Start building today'}</h2>
          <p>{lang==='zh'?'在一个安全的工作空间中，快速从卫星数据到生产输出。':'Quickly go from satellite data to production in a secure workspace.'}</p>
          <div className="hero-ctas"><a className="btn btn-primary" href="#">{lang==='zh'?'注册试用':'Sign up'}</a><a className="btn btn-outline" href="#templates" onClick={onNav}>{lang==='zh'?'浏览模板':'Browse templates'}</a></div>
        </div>
      </section>
    </>
  )
}
