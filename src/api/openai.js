export async function getAICode(prompt, agent = 'gemini') {
  const path = agent === 'deepseek' ? '/api/ai/deepseek' : '/api/ai/gemini'
  const token = (() => { try { return localStorage.getItem('auth_token') || '' } catch { return '' } })()
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    body: JSON.stringify({ prompt })
  })
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) {
    const tx = await res.text()
    throw new Error(`Received non-JSON response: ${tx.substring(0, 100)}...`)
  }
  if (!res.ok) {
    const err = await res.json().catch(()=>({}))
    const msg = err.error || `API Error: ${res.status}`
    throw new Error(msg)
  }
  const data = await res.json()
  const text = data?.text
  if (!text) throw new Error('Empty response from AI service.')
  return text
}
