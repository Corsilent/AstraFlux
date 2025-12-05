import React from 'react'

const imgRenew = new URL('../img/Renewable_Energy_Site_Analysis.jpg', import.meta.url).href
const imgVessel = new URL('../img/Vessel_Detection_Classification.jpg', import.meta.url).href
const imgPort = new URL('../img/Port_Activity_Monitoring.jpg', import.meta.url).href
const imgSolar = new URL('../img/Solar_Farm_Performance_Analytics.jpg', import.meta.url).href
const imgUrban = new URL('../img/Urban_Planning_Analysis.jpg', import.meta.url).href
const imgForest = new URL('../img/Forest_Cover_Assessment.jpg', import.meta.url).href
const imgInfra = new URL('../img/Infrastructure_Monitoring_System.jpg', import.meta.url).href
const imgAgri = new URL('../img/Agriculture_Land_Prediction.jpg', import.meta.url).href
const imgBulk = new URL('../img/Dry_Bulk_Commodity_Analysis.jpg', import.meta.url).href
const imgRoute = new URL('../img/Route_Planning_Optimization.jpg', import.meta.url).href
const imgMineral = new URL('../img/General_Mineral_Detection.jpg', import.meta.url).href
const imgEmission = new URL('../img/GHG_Emission_Monitoring.jpg', import.meta.url).href



const items = [
  { id: 'renew', title: '可再生能源场址分析', desc: '评估风光场址的资源与约束', img: imgRenew },
  { id: 'vessel', title: '船舶检测与分类', desc: '识别并分类不同船型', img: imgVessel },
  { id: 'port', title: '港口活动监控', desc: '监控泊位占用与拥堵', img: imgPort },
  { id: 'solar', title: '太阳能发电数据分析', desc: '面板性能与维护预测', img: imgSolar },
  { id: 'urban', title: '城市规划分析', desc: '用地结构与发展评估', img: imgUrban },
  { id: 'forest', title: '森林覆盖评估', desc: '植被范围与变化监测', img: imgForest },
  { id: 'infra', title: '基础设施健康监控', desc: '结构变化与维护需求', img: imgInfra },
  { id: 'agri', title: '农业用地预测', desc: '耕地变化与产量趋势', img: imgAgri },
  { id: 'bulk', title: '干散货商品分析', desc: '货运量与堆场动态', img: imgBulk },
  { id: 'route', title: '路线规划优化', desc: '多约束路径与成本优化', img: imgRoute },
  { id: 'mineral', title: '普适性矿物探测', desc: '适用于多种矿物的检测/探测技术', img: imgMineral },
  { id: 'emission', title: '温室气体排放监测', desc: '跟踪温室气体排放和碳足迹', img: imgEmission }
]

function Panel({ item }){
  return (
    <div className="feat-card">
      <div className="feat-media">
        <img src={item.img} alt={item.title} onError={(e)=>{e.currentTarget.src=`https://picsum.photos/seed/${item.id}/600/300`}} />
      </div>
      <div className="feat-body">
        <div className="feat-title">{item.title}</div>
        <div className="feat-desc">{item.desc}</div>
      </div>
    </div>
  )
}

export default function FeaturesCarousel({ lang='zh' }){
  const enItems = [
    { id: 'renew', title: 'Renewable Energy Site Analysis', desc: 'Assess wind/solar resources and constraints', img: imgRenew },
    { id: 'vessel', title: 'Vessel Detection & Classification', desc: 'Detect and classify vessel types', img: imgVessel },
    { id: 'port', title: 'Port Activity Monitoring', desc: 'Monitor berth occupancy and congestion', img: imgPort },
    { id: 'solar', title: 'Solar Farm Performance Analytics', desc: 'Panel performance and maintenance prediction', img: imgSolar },
    { id: 'urban', title: 'Urban Planning Analysis', desc: 'Land use structure and development assessment', img: imgUrban },
    { id: 'forest', title: 'Forest Cover Assessment', desc: 'Vegetation extent and change monitoring', img: imgForest },
    { id: 'infra', title: 'Infrastructure Health Monitoring', desc: 'Structural changes and maintenance needs', img: imgInfra },
    { id: 'agri', title: 'Agriculture Land Prediction', desc: 'Cropland changes and yield trends', img: imgAgri },
    { id: 'bulk', title: 'Dry Bulk Commodity Analysis', desc: 'Freight volumes and yard dynamics', img: imgBulk },
    { id: 'route', title: 'Route Planning Optimization', desc: 'Multi-constraint routing and cost optimization', img: imgRoute },
    { id: 'mineral', title: 'General Mineral Detection', desc: 'Detection applicable to various minerals', img: imgMineral },
    { id: 'emission', title: 'GHG Emission Monitoring', desc: 'Track greenhouse gases and carbon footprint', img: imgEmission }
  ]
  const track = [...(lang==='zh'?items:enItems), ...(lang==='zh'?items:enItems)]
  return (
    <section className="section features-scroller">
      <div className="container">
        <div className="section-head">
          <h2>{lang==='zh'?'更多功能':'More Features'}</h2>
          <p>{lang==='zh'?'从可再生能源到城市与交通，持续扩展的功能面板。':'From renewables to urban and transport, continuously expanding panels.'}</p>
        </div>
      </div>
      <div className="scroller" aria-label="功能滚动">
        <div className="scroller-track">
          {track.map((it, i) => (<Panel key={`${it.id}-${i}`} item={it} />))}
        </div>
      </div>
    </section>
  )
}
