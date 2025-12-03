import React, { useEffect, useState } from 'react'
import Templates from './components/Templates.jsx'
import Showcase from './components/Showcase.jsx'
import Workspace from './components/Workspace.jsx'
import { Routes, Route, Link } from 'react-router-dom'
import HomeContent from './pages/HomeContent.jsx'
import TaskPage from './pages/TaskPage.jsx'

function useTheme() {
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) setTheme(stored)
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}

export default function App() {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const nav = [
    { href: '#product', text: '产品' },
    { href: '#templates', text: '模板库' },
    { href: '#workspace', text: '协作' },
    { href: '#outputs', text: '输出' },
    { href: '#faq', text: '常见问题' }
  ]
  const onNav = e => {
    const id = e.currentTarget.getAttribute('href')
    const el = document.querySelector(id)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }
  return (
    <div>
      <header className="navbar">
        <div className="container">
          <Link className="brand" to="/"><img className="brand-icon" src="/brand.svg" alt="AstraFlux" width="22" height="22"/>AstraFlux</Link>
          <nav className="nav">
            {nav.map(n => (
              <a key={n.href} href={n.href} onClick={onNav}>{n.text}</a>
            ))}
          </nav>
          <div className="actions">
            <button className="icon-btn" onClick={toggle} aria-label="切换主题">{theme === 'dark' ? '🌗' : '🔆'}</button>
            <a className="btn btn-primary" href="#cta" onClick={onNav}>开始构建</a>
            <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="打开菜单">☰</button>
          </div>
        </div>
        {open && (
          <div className="mobile-menu">
            {nav.map(n => (
              <a key={n.href} href={n.href} onClick={onNav}>{n.text}</a>
            ))}
            <a className="btn btn-primary" href="#cta" onClick={onNav}>开始构建</a>
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/task/:id" element={<TaskPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="brand"><img className="brand-icon" src="/brand.svg" alt="AstraFlux" width="20" height="20"/>AstraFlux</div>
            <div className="links">
              {nav.map(n => (
                <a key={n.href} href={n.href} onClick={onNav}>{n.text}</a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <div className="copy">© 2025 AstraFlux</div>
            <div className="social">
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
