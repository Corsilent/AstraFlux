import React, { useEffect, useState } from 'react'
import Templates from './components/Templates.jsx'
import Showcase from './components/Showcase.jsx'
import Workspace from './components/Workspace.jsx'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import HomeContent from './pages/HomeContent.jsx'
import TaskPage from './pages/TaskPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

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
            {user && (
              <div className="user-greet">
                <div className="avatar">{initial}</div>
                <span>欢迎，{user.email}</span>
              </div>
            )}
            {!user && (<Link className="btn btn-soft" to="/login">登录</Link>)}
            {!user && (<Link className="btn btn-soft" to="/register">注册</Link>)}
            {user && (<button className="btn btn-soft" onClick={logout}>退出登录</button>)}
            <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="打开菜单">☰</button>
          </div>
        </div>
        {open && (
          <div className="mobile-menu">
            {user && (
              <div className="mobile-user">
                <div className="avatar xl">{initial}</div>
                <div className="mobile-user-text">
                  <div className="welcome">欢迎</div>
                  <div className="email">{user.email}</div>
                </div>
              </div>
            )}
            {nav.map(n => (
              <a key={n.href} href={n.href} onClick={onNav}>{n.text}</a>
            ))}
            <a className="btn btn-primary" href="#cta" onClick={onNav}>开始构建</a>
            {!user && (<Link className="btn btn-soft" to="/login">登录</Link>)}
            {!user && (<Link className="btn btn-soft" to="/register">注册</Link>)}
            {user && (<button className="btn btn-soft" onClick={logout}>退出登录</button>)}
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/task/:id" element={<TaskPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
