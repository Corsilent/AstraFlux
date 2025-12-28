import React, { useEffect, useState, useRef } from 'react'
import { Send, MessageSquare, Play, Share2, Github, Download, ChevronDown, MapPin, Plus, History, PlusCircle, Trash, Home } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getAICode } from '../api/openai'
import { Navigate, useNavigate } from 'react-router-dom'

export default function WorkspaceAI(){
  const navigate = useNavigate()
  const authed = (() => {
    try {
      const u = localStorage.getItem('auth_user')
      const t = localStorage.getItem('auth_token')
      return !!(u && t)
    } catch { return false }
  })()
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState('')
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [code, setCode] = useState('# Generated code will appear here...\n\n# Example:\n# def calculate_ndvi(image):\n#     return image.normalizedDifference([\"B8\", \"B4\"])')
  const [isLoading, setIsLoading] = useState(false)
  const [agent, setAgent] = useState('deepseek')
  const [isRunning, setIsRunning] = useState(false)
  const chatScrollRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  if (!authed) return <Navigate to="/login" replace />
  useEffect(() => {
    try {
      const raw = localStorage.getItem('af_sessions')
      const parsed = raw ? JSON.parse(raw) : null
      if (Array.isArray(parsed) && parsed.length > 0) {
        setSessions(parsed)
        setCurrentSessionId(parsed[0].id)
        setMessages(parsed[0].messages || [])
      } else {
        const sid = `s-${Date.now()}`
        const initial = [{ role: 'assistant', content: 'Hello! I am your AstraFlux AI assistant. Ask me to generate geospatial code for you.' }]
        const s = { id: sid, title: 'New Chat', createdAt: Date.now(), messages: initial }
        setSessions([s])
        setCurrentSessionId(sid)
        setMessages(initial)
      }
    } catch {
      const sid = `s-${Date.now()}`
      const initial = [{ role: 'assistant', content: 'Hello! I am your AstraFlux AI assistant. Ask me to generate geospatial code for you.' }]
      const s = { id: sid, title: 'New Chat', createdAt: Date.now(), messages: initial }
      setSessions([s])
      setCurrentSessionId(sid)
      setMessages(initial)
    }
  }, [])
  useEffect(() => {
    try {
      if (sessions && sessions.length) {
        localStorage.setItem('af_sessions', JSON.stringify(sessions))
      }
    } catch {}
  }, [sessions])
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    const userPrompt = inputValue
    const newUserMessage = { role: 'user', content: userPrompt }
    const nextMessages = [...messages, newUserMessage]
    setMessages(nextMessages)
    setInputValue('')
    setIsLoading(true)
    try {
      const aiResponse = await getAICode(userPrompt, agent)
      let cleanCode = aiResponse
      if (aiResponse.includes('```')) {
        const matches = aiResponse.match(/```(?:python)?\s*([\s\S]*?)```/)
        if (matches && matches[1]) cleanCode = matches[1]
        else cleanCode = aiResponse.replace(/```python|```/g, '')
      }
      const finalMessages = [...nextMessages, { role: 'assistant', content: 'Code generated successfully! Check the editor.' }]
      setMessages(finalMessages)
      setCode(cleanCode)
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: finalMessages, title: s.title === 'New Chat' ? (userPrompt.length > 28 ? userPrompt.slice(0, 28) + '…' : userPrompt) : s.title } : s))
    } catch (error) {
      const errMsg = { role: 'assistant', content: `Error: ${error.message || 'Unknown error occurred.'}` }
      const finalMessages = [...nextMessages, errMsg]
      setMessages(finalMessages)
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: finalMessages } : s))
    } finally {
      setIsLoading(false)
    }
  }
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() }
  }
  const selectLocation = () => {
    setMessages(prev => [...prev, { role: 'assistant', content: 'Select Location feature is coming soon.' }])
    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...messages, { role: 'assistant', content: 'Select Location feature is coming soon.' }] } : s))
  }
  const addBlocks = () => {
    setMessages(prev => [...prev, { role: 'assistant', content: 'Add Blocks feature is coming soon.' }])
    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...messages, { role: 'assistant', content: 'Add Blocks feature is coming soon.' }] } : s))
  }
  const focusChat = () => {
    try {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
      }
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } catch {}
  }
  const runCode = async () => {
    if (isRunning) return
    setIsRunning(true)
    const start = Date.now()
    try {
      const res = await fetch('/api/status')
      const ok = res.ok
      let info = ''
      try {
        const data = await res.json()
        info = data?.db ? `db=${data.db}, invites=${data.invites}` : 'ok'
      } catch {
        info = ok ? 'ok' : 'error'
      }
      const secs = ((Date.now() - start) / 1000).toFixed(2)
      const msg = { role: 'assistant', content: `Run completed in ${secs}s (${info}).` }
      setMessages(prev => [...prev, msg])
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...(s.messages || []), msg] } : s))
    } catch (e) {
      const msg = { role: 'assistant', content: `Run failed: ${String(e.message || e)}` }
      setMessages(prev => [...prev, msg])
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...(s.messages || []), msg] } : s))
    } finally {
      setIsRunning(false)
    }
  }
  const publishCode = () => {
    const msg = { role: 'assistant', content: 'Published to Gallery (placeholder). You can refine this flow later.' }
    setMessages(prev => [...prev, msg])
    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...(s.messages || []), msg] } : s))
    navigate('/gallery')
  }
  const openGitHub = () => {
    window.open('https://github.com/', '_blank', 'noopener,noreferrer')
  }
  const importCode = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }
  const onFileChange = e => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const text = String(reader.result || '')
        let next = text
        try {
          const j = JSON.parse(text)
          if (j && typeof j.code === 'string') next = j.code
        } catch {}
        setCode(next)
        const msg = { role: 'assistant', content: `Imported file: ${f.name}` }
        setMessages(prev => [...prev, msg])
        setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...(s.messages || []), msg] } : s))
      } catch (err) {
        const msg = { role: 'assistant', content: `Import failed: ${String(err.message || err)}` }
        setMessages(prev => [...prev, msg])
        setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...(s.messages || []), msg] } : s))
      } finally {
        e.target.value = ''
      }
    }
    reader.readAsText(f)
  }
  const newSession = () => {
    const sid = `s-${Date.now()}`
    const initial = [{ role: 'assistant', content: 'Hello! I am your AstraFlux AI assistant. Ask me to generate geospatial code for you.' }]
    const s = { id: sid, title: 'New Chat', createdAt: Date.now(), messages: initial }
    setSessions(prev => [s, ...prev])
    setCurrentSessionId(sid)
    setMessages(initial)
    setCode('# Generated code will appear here...\n\n# Example:\n# def calculate_ndvi(image):\n#     return image.normalizedDifference([\"B8\", \"B4\"])')
  }
  const selectSession = id => {
    setCurrentSessionId(id)
    const s = sessions.find(x => x.id === id)
    setMessages(s ? (s.messages || []) : [])
  }
  const exitWorkspace = () => {
    navigate('/')
  }
  const deleteSession = id => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id)
      if (!next.length) {
        const sid = `s-${Date.now()}`
        const initial = [{ role: 'assistant', content: 'Hello! I am your AstraFlux AI assistant. Ask me to generate geospatial code for you.' }]
        const s = { id: sid, title: 'New Chat', createdAt: Date.now(), messages: initial }
        setCurrentSessionId(sid)
        setMessages(initial)
        setCode('# Generated code will appear here...\n\n# Example:\n# def calculate_ndvi(image):\n#     return image.normalizedDifference([\"B8\", \"B4\"])')
        return [s]
      }
      if (id === currentSessionId) {
        const s = next[0]
        setCurrentSessionId(s.id)
        setMessages(s.messages || [])
      }
      return next
    })
  }
  return (
    <div className="min-h-screen bg-dark text-text flex overflow-hidden">
      <div className="w-64 border-r border-border flex flex-col bg-dark shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <button className="flex items-center gap-2 w-full px-3 py-2 bg-card border border-border rounded text-sm text-text hover:bg-surface2" onClick={exitWorkspace}>
            <Home size={14} /> <span>Back</span>
          </button>
        </div>
        <div className="p-3 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm text-text">
            <History size={16} />
            <span>Sessions</span>
          </div>
          <button className="flex items-center gap-1 px-2 py-1 bg-card border border-border rounded text-xs hover:bg-surface2" onClick={newSession}>
            <PlusCircle size={14} /> <span>New</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {(sessions || []).map(s => (
            <div key={s.id} className={`px-4 py-3 border-b border-border hover:bg-card ${s.id===currentSessionId ? 'bg-card' : ''} flex items-center justify-between`}>
              <button onClick={()=>selectSession(s.id)} className="text-left flex-1">
                <div className="text-sm text-text">{s.title || 'Untitled'}</div>
                <div className="text-xs text-muted">{new Date(s.createdAt || Date.now()).toLocaleString()}</div>
              </button>
              <button className="p-1.5 text-muted hover:text-red-500" onClick={e=>{ e.stopPropagation(); deleteSession(s.id) }}>
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 min-w-[380px] border-r border-border flex flex-col bg-dark shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="font-semibold">AI Chat</h2>
        </div>
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`p-4 rounded-lg border ${msg.role === 'user' ? 'bg-card border-border' : 'bg-transparent border-transparent'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{msg.role === 'user' ? 'You' : 'AI Agent'}</span>
                <span className="text-xs text-muted">{new Date().toLocaleTimeString()}</span>
              </div>
              <p className="text-text text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          {isLoading && (<div className="flex items-center gap-2 text-muted text-sm pl-4"><span>ASTRAFLUX Processing...</span></div>)}
          {isRunning && (<div className="flex items-center gap-2 text-muted text-sm pl-4"><span>Running...</span></div>)}
        </div>
        <div className="p-4 border-t border-border shrink-0">
          <div className="flex items-center gap-4 mb-2">
            <select className="bg-card border border-border text-xs text-text rounded px-2 py-1" value={agent} onChange={e=>setAgent(e.target.value)}>
              <option value="gemini">Gemini</option>
              <option value="deepseek">Deepseek</option>
            </select>
            <button className="text-xs text-muted hover:text-text flex items-center gap-1" onClick={selectLocation}>
              <MapPin size={12} /> <span>Select Location</span>
            </button>
            <button className="text-xs text-muted hover:text-text flex items-center gap-1" onClick={addBlocks}>
              <Plus size={12} /> <span>Add Blocks</span>
            </button>
          </div>
          <div className="relative">
            <textarea
              className="w-full bg-card rounded-lg border border-border p-3 text-sm text-text placeholder-muted resize-none outline-none focus:border-accent h-24 pr-10"
              placeholder="Ask me to generate code (e.g., 'Calculate NDVI for Sentinel-2 image')..."
              value={inputValue}
              onChange={e=>setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              ref={inputRef}
            ></textarea>
            <button className="absolute bottom-2 right-2 text-muted hover:text-accent disabled:opacity-50" onClick={handleSendMessage} disabled={isLoading}>
              <Send size={16} />
            </button>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted">Connected</span>
            <span className="text-xs text-muted">Press Enter to send</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-dark overflow-hidden">
        <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>AstraFlux Workspace</span>
            <span>&gt;</span>
            <span>Notebook</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-muted hover:text-text" onClick={focusChat}><MessageSquare size={16} /></button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded text-xs hover:bg-surface2" onClick={runCode} disabled={isRunning}>
              <Play size={12} /> <span>Run</span> <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded text-xs hover:bg-surface2" onClick={publishCode}>
              <Share2 size={12} /> <span>Publish</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded text-xs hover:bg-surface2" onClick={openGitHub}>
              <Github size={12} /> <span>GitHub</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded text-xs hover:bg-surface2" onClick={importCode}>
              <Download size={12} /> <span>Import</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={onFileChange} accept=".py,.txt,.json" className="hidden" />
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-card relative">
          <SyntaxHighlighter
            language="python"
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '1.5rem', height: '100%', fontSize: '14px', lineHeight: '1.5', background: 'transparent' }}
            showLineNumbers
            wrapLines
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}
