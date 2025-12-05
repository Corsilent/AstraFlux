import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const lang = typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'zh') : 'zh'
  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok && data && data.ok) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        nav('/')
      } else {
        setError(data && data.error ? data.error : '登录失败')
      }
    } catch (err) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="section" id="login">
      <div className="container">
      <div className="auth">
          <div className="auth-card">
            <h2>{lang==='zh'?'登录':'Login'}</h2>
            <p className="auth-sub">{lang==='zh'?'使用你的邮箱登录 AstraFlux 工作空间。':'Sign in with your email to AstraFlux workspace.'}</p>
            <form className="auth-form" onSubmit={submit}>
              <label className="auth-row">
                <span>{lang==='zh'?'邮箱':'Email'}</span>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
              </label>
              <label className="auth-row">
                <span>{lang==='zh'?'密码':'Password'}</span>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="至少 6 位" required />
              </label>
              {error && (<div className="auth-error">{error}</div>)}
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? (lang==='zh'?'登录中…':'Signing in…') : (lang==='zh'?'登录':'Login')}</button>
            </form>
            <div><span className="auth-sub">{lang==='zh'?'没有账号？':'No account yet?'}</span> <Link to="/register" className="showcase-link">{lang==='zh'?'去注册':'Go to sign up'}</Link></div>
          </div>
        </div>
      </div>
    </section>
  )
}
