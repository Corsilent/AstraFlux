import React, { useEffect, useState } from 'react'
import Templates from './components/Templates.jsx'
import Showcase from './components/Showcase.jsx'
import Workspace from './components/Workspace.jsx'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import HomeContent from './pages/HomeContent.jsx'
import TaskPage from './pages/TaskPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import WorkspaceAI from './pages/WorkspaceAI.jsx'
import PublicGallery from './pages/PublicGallery.jsx'

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

function useLang() {
  const [lang, setLang] = useState('zh')
  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored) setLang(stored)
  }, [])
  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])
  return { lang, toggle: () => setLang(lang === 'zh' ? 'en' : 'zh') }
}

export default function App() {
  const { theme, toggle } = useTheme()
  const { lang, toggle: toggleLang } = useLang()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const initial = user && user.email ? user.email.charAt(0).toUpperCase() : ''
  useEffect(() => {
    try {
      const u = localStorage.getItem('auth_user')
      setUser(u ? JSON.parse(u) : null)
    } catch {
      setUser(null)
    }
  }, [location.pathname])
  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
    navigate('/')
  }
  const nav = lang === 'zh' ? [
    { href: '#product', text: '产品' },
    { href: '#templates', text: '模板库' },
    { href: '#workspace', text: '协作' },
    { href: '#outputs', text: '输出' },
    { href: '#faq', text: '常见问题' }
  ] : [
    { href: '#product', text: 'Product' },
    { href: '#templates', text: 'Templates' },
    { href: '#workspace', text: 'Workspace' },
    { href: '#outputs', text: 'Outputs' },
    { href: '#faq', text: 'FAQ' }
  ]
  const onNav = e => {
    const id = e.currentTarget.getAttribute('href')
    const el = document.querySelector(id)
    e.preventDefault()
    if (location.pathname === '/' && el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
      return
    }
    navigate('/' + id)
    setOpen(false)
  }
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location.pathname, location.hash])
  return (
    <div>
      <div className="orbital-bg" aria-hidden="true">
        <svg className="orbital-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role="none">
          <g className="orbit orbit-a"><circle cx="50" cy="50" r="28" /></g>
          <g className="orbit orbit-b"><circle cx="50" cy="50" r="40" /></g>
          <g className="orbit orbit-c"><circle cx="50" cy="50" r="52" /></g>
          <g className="starfield">
            <circle cx="15" cy="20" r="0.6" />
            <circle cx="85" cy="30" r="0.8" />
            <circle cx="20" cy="80" r="0.7" />
            <circle cx="70" cy="75" r="0.6" />
            <circle cx="45" cy="10" r="0.5" />
          </g>
          <g className="sat">
            <circle cx="50" cy="18" r="0.9" />
            <circle cx="50" cy="82" r="0.9" />
          </g>
        </svg>
      </div>
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
            <Link className="btn btn-primary" to="/workspace">{lang==='zh'?'开始构建':'Get Started'}</Link>
            <button className="btn btn-soft" onClick={toggleLang}>{lang==='zh'?'EN':'中'}</button>
            {user && (
              <div className="user-greet">
                <div className="avatar">{initial}</div>
                <span>{lang==='zh'?'欢迎':'Welcome'}, {user.email}</span>
              </div>
            )}
            {!user && (<Link className="btn btn-soft" to="/login">{lang==='zh'?'登录':'Login'}</Link>)}
            {!user && (<Link className="btn btn-soft" to="/register">{lang==='zh'?'注册':'Sign Up'}</Link>)}
            {user && (<button className="btn btn-soft" onClick={logout}>{lang==='zh'?'退出登录':'Logout'}</button>)}
            <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="打开菜单">☰</button>
          </div>
        </div>
        {open && (
          <div className="mobile-menu">
            {user && (
              <div className="mobile-user">
                <div className="avatar xl">{initial}</div>
                <div className="mobile-user-text">
                  <div className="welcome">{lang==='zh'?'欢迎':'Welcome'}</div>
                  <div className="email">{user.email}</div>
                </div>
              </div>
            )}
            {nav.map(n => (
              <a key={n.href} href={n.href} onClick={onNav}>{n.text}</a>
            ))}
            <Link className="btn btn-primary" to="/workspace">{lang==='zh'?'开始构建':'Get Started'}</Link>
            {!user && (<Link className="btn btn-soft" to="/login">{lang==='zh'?'登录':'Login'}</Link>)}
            {!user && (<Link className="btn btn-soft" to="/register">{lang==='zh'?'注册':'Sign Up'}</Link>)}
            {user && (<button className="btn btn-soft" onClick={logout}>{lang==='zh'?'退出登录':'Logout'}</button>)}
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomeContent lang={lang} />} />
          <Route path="/task/:id" element={<TaskPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workspace" element={<WorkspaceAI />} />
          <Route path="/gallery" element={<PublicGallery />} />
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
