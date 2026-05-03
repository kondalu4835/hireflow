'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const JOB_TYPES = ['', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']
const typeColors: Record<string, string> = { FULL_TIME: 'badge-green', PART_TIME: 'badge-blue', CONTRACT: 'badge-yellow', INTERNSHIP: 'badge-purple', REMOTE: 'badge-red' }

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const fetchJobs = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (type) params.set('type', type)
    const res = await fetch('/api/jobs?' + params)
    const data = await res.json()
    setJobs(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [type])

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Browse Jobs</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Find your next opportunity from {jobs.length} listings</p>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 250, display: 'flex', gap: '0.5rem' }}>
            <input placeholder="Search by title or company..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchJobs()} />
            <button className="btn-primary" onClick={fetchJobs} style={{ whiteSpace: 'nowrap', padding: '0.65rem 1.2rem' }}>Search</button>
          </div>
          <select value={type} onChange={e => setType(e.target.value)} style={{ minWidth: 160 }}>
            <option value="">All Types</option>
            {JOB_TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <p>No jobs found. Try different search terms.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {jobs.map((job: any) => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>{job.title}</h3>
                    <span className={`badge ${typeColors[job.type] || 'badge-purple'}`}>{job.type.replace('_', ' ')}</span>
                  </div>
                  <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{job.company}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>📍 {job.location}</p>
                  {job.salary && <p style={{ color: 'var(--accent3)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>💰 {job.salary}</p>}
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>{job.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <span>👤 {job._count?.applications || 0} applicants</span>
                    <span>{new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
