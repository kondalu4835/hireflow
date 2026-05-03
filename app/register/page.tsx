'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
    router.push('/dashboard'); router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.1) 0%, transparent 70%)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>HireFlow</Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>Create Account</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Join thousands of users on HireFlow</p>
        </div>
        <div className="glass" style={{ borderRadius: 16, padding: '2rem' }}>
          {/* Role Toggle */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
            {['CANDIDATE', 'EMPLOYER'].map(r => (
              <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))} style={{ flex: 1, padding: '0.6rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', background: form.role === r ? 'linear-gradient(135deg, #6c63ff, #8b5cf6)' : 'transparent', color: form.role === r ? 'white' : 'var(--muted)' }}>
                {r === 'CANDIDATE' ? '👤 Candidate' : '🏢 Employer'}
              </button>
            ))}
          </div>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--muted)' }}>Full Name</label>
              <input placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--muted)' }}>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--muted)' }}>Password</label>
              <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            {error && <p style={{ color: 'var(--accent2)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem', fontSize: '1rem', padding: '0.75rem' }}>{loading ? 'Creating...' : `Join as ${form.role === 'CANDIDATE' ? 'Candidate' : 'Employer'}`}</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            Have an account? <Link href="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
