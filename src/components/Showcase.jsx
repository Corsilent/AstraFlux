import React from 'react'
import { Link } from 'react-router-dom'

const imgInfra = new URL('../img/infrastructure.jpg', import.meta.url).href
const imgVessel = new URL('../img/harbor.jpg', import.meta.url).href
const imgGHG = new URL('../img/GHG_Emission_Monitoring.jpg', import.meta.url).href
const imgDis = new URL('../img/flood.jpg', import.meta.url).href

const items = [
  {
    id: 'infra-change',
    title: '基础设施变化检测',
    tags: ['建筑', '公共', '城市'],
    desc: '对比多时相影像，高亮施工与异常，辅助维护与巡检。',
    detail: '自动对比多个时间片，识别道路、桥梁与厂区的结构变化。结合阈值与区域筛选，输出巡检清单与合规报告。',
    img: imgInfra
  },
  {
    id: 'port-monitor',
    title: '港口活动监测',
    tags: ['能源', '海事', '港口'],
    desc: '识别船只与泊位变化，生成告警与周期报告。',
    detail: '融合光学与雷达数据，检测进出港船只与泊位占用，对异常停靠与拥堵情况触发告警并推送日报。',
    img: imgVessel
  },
  {
    id: 'emission',
    title: '碳足迹检测',
    tags: ['温室气体排放', '碳排监测', '企业碳盘查', 'MRV', '双碳'],
    desc: '秒级锁定排放源，自动核算碳排数据，一键生成符合国际MRV标准的排放清单。',
    detail: '覆盖工厂、电厂、园区等多场景，实时量化CO₂、CH₄、N₂O等温室气体排放量，支持排放因子库动态更新、数据质量分级与溯源，满足碳盘查、碳交易及ESG披露需求。',
    img: imgGHG
  },
  {
    id: 'disaster',
    title: '灾害评估',
    tags: ['应急', '洪涝', '火灾'],
    desc: '快速提取灾害范围与影响指标，支援应急决策。',
    detail: '结合多源影像快速定位受灾范围，生成受影响资产清单与恢复计划建议。',
    img: imgDis
  }
]

function fallback(id){
  return `https://picsum.photos/seed/${id}/900/500`
}

export default function Showcase(){
  return (
    <section className="section showcase" aria-label="模板库广告">
      <div className="container">
        <div className="showcase-grid">
          <div className="showcase-right">
            <div className="showcase-title">
              <span>模板库</span>
              <span className="accent"> + 数据访问</span>
            </div>
            <div className="showcase-sub">为什么重要</div>
            <p className="showcase-text">从第一天就能开始构建——无需下载、集成或采购周期。在同一工作空间内直接获取公共与商业数据集、第三方模型以及社区模板。无论是监测基础设施、检测变化还是分类地物，可复用的构件帮助你快速前进而不用重复造轮子。</p>
            <a className="showcase-link" href="#templates">浏览模板 →</a>
          </div>
          <div className="showcase-left">
            <div className="showcase-cards grid">
              {items.map(it => (
                <div key={it.id} className="show-card">
                  <div className="show-card-media">
                    <img src={it.img} alt={it.title} onError={(e)=>{e.currentTarget.src=fallback(it.id)}} />
                  </div>
                  <div className="show-card-content">
                    <div className="show-card-title">{it.title}</div>
                    <div className="show-card-tags">
                      {it.tags.map(t => (<span key={t} className="show-tag">{t}</span>))}
                    </div>
                    <div className="show-card-desc">{it.desc}</div>
                    <div className="show-card-long">{it.detail}</div>
                    <Link className="btn btn-soft" to={`/task/${it.id}`}>查看流程 →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="showcase-bg"/>
    </section>
  )
}
