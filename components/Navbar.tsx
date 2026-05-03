'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User { name: string; email: string; role: string }

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) setUser(d.user)
    }).catch(() => {})
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HireFlow
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/jobs" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Browse Jobs</Link>

          {user ? (
            <>
              <Link href="/dashboard" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Dashboard</Link>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontFamily: 'Syne', fontWeight: 600 }}>
                  {user.name.split(' ')[0]} ▾
                </button>
                {menuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, minWidth: 160, zIndex: 200 }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--muted)' }}>{user.role}</div>
                    <button onClick={logout} style={{ width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans', fontSize: '0.95rem' }}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login"><button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Login</button></Link>
              <Link href="/register"><button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Sign Up</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
