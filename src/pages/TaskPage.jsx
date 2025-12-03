import React, { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Map from '../components/map/Map.jsx'

const TASKS = {
  'port-monitor': {
    title: '港口活动监测',
    hero: 'https://images.unsplash.com/photo-1546548322-805350c8b735?auto=format&fit=crop&w=1200&q=60',
    bullets: ['识别船只与泊位变化', '自动生成告警与报表', '支持图层联动与时序对比']
  },
  'infra-change': {
    title: '基础设施变化检测',
    hero: 'https://images.unsplash.com/photo-1581091012184-5c1d7b06365e?auto=format&fit=crop&w=1200&q=60',
    bullets: ['多时相对比高亮变化', '辅助检修与巡检', '输出合规报告']
  },
  'landcover': {
    title: '地物分类',
    hero: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60',
    bullets: ['道路/植被/水体分割', '支持标注与训练', '与地图交互联动']
  },
  'disaster': {
    title: '灾害评估',
    hero: 'https://images.unsplash.com/photo-1544735716-7f3066b52f00?auto=format&fit=crop&w=1200&q=60',
    bullets: ['洪涝/火灾范围提取', '快速态势图与统计', '支援应急决策']
  }
}

const STEPS = [
  { key: 'aoi', label: '定义区域', desc: '在地图上绘制关注区域，支持矩形与多边形。' },
  { key: 'search', label: '搜索数据', desc: '查询 Sentinel、Landsat 等数据，并按时间过滤。' },
  { key: 'code', label: '生成分析代码', desc: 'Notebook 代理生成分析代码并可复用。' },
  { key: 'deploy', label: '构建与部署', desc: '生成仪表盘与交互地图，打包应用交付。' }
]

export default function TaskPage(){
  const { id } = useParams()
  const task = useMemo(() => TASKS[id] || TASKS['infra-change'], [id])
  const [active, setActive] = useState('aoi')
  return (
    <div className="task-page">
      <div className="task-hero" style={{ backgroundImage: `url(${task.hero})` }}>
        <div className="container">
          <h1 className="task-title">{task.title}</h1>
          <div className="task-bullets">
            {task.bullets.map(b => (<span key={b} className="task-bullet">{b}</span>))}
          </div>
          <div className="hero-ctas">
            <Link className="btn btn-primary" to="#">开始试用</Link>
            <Link className="btn btn-outline" to="/">返回首页</Link>
          </div>
        </div>
        <div className="task-hero-overlay"></div>
      </div>

      <section className="section" id="flow">
        <div className="container">
          <div className="section-head"><h2>流程演示</h2><p>从定义区域到部署输出的端到端步骤。</p></div>
          <div className="flow">
            <div className="flow-steps">
              {STEPS.map(s => (
                <button key={s.key} className={`flow-step ${active===s.key?'active':''}`} onClick={() => setActive(s.key)}>{s.label}</button>
              ))}
            </div>
            <div className="flow-panel">
              {active==='aoi' && (
                <div className="panel">
                  <div className="panel-left"><Map/></div>
                  <div className="panel-right">
                    <h3>定义区域</h3>
                    <p>在地图左上角控件中选择绘制工具，框选港口或基础设施范围，系统自动计算面积并保存到工作空间。</p>
                  </div>
                </div>
              )}
              {active==='search' && (
                <div className="panel">
                  <div className="panel-left">
                    <div className="mock block">数据源选择</div>
                    <div className="mock block">时间范围过滤</div>
                    <div className="mock block">预览缩略图</div>
                  </div>
                  <div className="panel-right">
                    <h3>搜索数据</h3>
                    <p>统一数据访问层查询 Sentinel、Landsat 等影像，支持按时间与云量过滤，并预览缩略图以确认覆盖范围。</p>
                  </div>
                </div>
              )}
              {active==='code' && (
                <div className="panel">
                  <div className="panel-left">
                    <pre className="code-block">{`# Notebook 代理示例
import rasterio
import numpy as np
# 读取影像并计算变化指数
`}</pre>
                  </div>
                  <div className="panel-right">
                    <h3>生成分析代码</h3>
                    <p>代理根据目标自动生成分析代码，包含读取、预处理、指标提取与可视化等步骤，并保持可审计与可复用。</p>
                  </div>
                </div>
              )}
              {active==='deploy' && (
                <div className="panel">
                  <div className="panel-left">
                    <div className="mock block">仪表盘组件</div>
                    <div className="mock block">交互地图</div>
                    <div className="mock block">报告导出</div>
                  </div>
                  <div className="panel-right">
                    <h3>构建与部署</h3>
                    <p>输出仪表盘与交互地图，导出报告并一键部署到边缘或云端，默认内置访问控制与审计日志。</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
