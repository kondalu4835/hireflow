'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const typeColors: Record<string, string> = { FULL_TIME: 'badge-green', PART_TIME: 'badge-blue', CONTRACT: 'badge-yellow', INTERNSHIP: 'badge-purple', REMOTE: 'badge-red' }

export default function JobDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [applying, setApplying] = useState(false)
  const [form, setForm] = useState({ coverLetter: '', resume: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/jobs/${id}`).then(r => r.json()).then(d => { setJob(d); setLoading(false) })
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user) })
  }, [id])

  const apply = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId: id, ...form }) })
    const data = await res.json()
    if (res.ok) { setMsg('✅ Application submitted successfully!'); setApplying(false) }
    else setMsg('❌ ' + (data.error || 'Failed'))
  }

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '6rem', color: 'var(--muted)' }}>Loading...</div></>
  if (!job || job.error) return <><Navbar /><div style={{ textAlign: 'center', padding: '6rem', color: 'var(--muted)' }}>Job not found.</div></>

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}>← Back to Jobs</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{job.title}</h1>
            <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem' }}>{job.company}</p>
          </div>
          <span className={`badge ${typeColors[job.type] || 'badge-purple'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>{job.type.replace('_', ' ')}</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', color: 'var(--muted)', fontSize: '0.95rem' }}>
          <span>📍 {job.location}</span>
          {job.salary && <span style={{ color: 'var(--accent3)', fontWeight: 600 }}>💰 {job.salary}</span>}
          <span>👤 {job.applications?.length || 0} applicants</span>
          <span>📅 {new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
        </div>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Job Description</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</p>
        </div>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Requirements</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
        </div>
        {msg && <div style={{ padding: '1rem', borderRadius: 8, background: 'var(--surface2)', marginBottom: '1rem', textAlign: 'center' }}>{msg}</div>}
        {user?.role === 'CANDIDATE' && !msg.includes('✅') && (
          !applying ? (
            <button className="btn-primary" onClick={() => setApplying(true)} style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>Apply Now</button>
          ) : (
            <div className="card">
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Submit Application</h2>
              <form onSubmit={apply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--muted)' }}>Cover Letter *</label>
                  <textarea rows={6} placeholder="Tell the employer why you're a great fit..." value={form.coverLetter} onChange={e => setForm(p => ({ ...p, coverLetter: e.target.value }))} required style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'var(--muted)' }}>Resume Link (optional)</label>
                  <input placeholder="https://your-resume-link.com" value={form.resume} onChange={e => setForm(p => ({ ...p, resume: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-primary" type="submit" style={{ flex: 1, padding: '0.75rem' }}>Submit Application</button>
                  <button className="btn-outline" type="button" onClick={() => setApplying(false)} style={{ padding: '0.75rem 1.5rem' }}>Cancel</button>
                </div>
              </form>
            </div>
          )
        )}
        {!user && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
          <Link href="/login" style={{ color: 'var(--accent)' }}>Login</Link> to apply for this job.
        </div>}
      </main>
    </>
  )
}
