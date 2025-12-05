import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
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
      const res = await fetch('http://localhost:3000/api/register', {
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
        setError(data && data.error ? data.error : '注册失败')
      }
    } catch (err) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="section" id="register">
      <div className="container">
        <div className="auth">
          <div className="auth-card">
                    <h2>{lang==='zh'?'注册':'Sign Up'}</h2>
                    <p className="auth-sub">{lang==='zh'?'创建 AstraFlux 账号，开始协作与部署。':'Create an AstraFlux account to collaborate and deploy.'}</p>
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
                      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? (lang==='zh'?'注册中…':'Signing up…') : (lang==='zh'?'注册':'Sign Up')}</button>
                    </form>
                    <div><span className="auth-sub">{lang==='zh'?'已有账号？':'Already have an account?'}</span> <Link to="/login" className="showcase-link">{lang==='zh'?'去登录':'Go to login'}</Link></div>
          </div>
        </div>
      </div>
    </section>
  )
}
