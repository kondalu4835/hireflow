'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']
const STATUS_COLORS: Record<string, string> = { PENDING: 'badge-yellow', REVIEWED: 'badge-blue', SHORTLISTED: 'badge-green', REJECTED: 'badge-red', HIRED: 'badge-purple' }
const TYPE_COLORS: Record<string, string> = { FULL_TIME: 'badge-green', PART_TIME: 'badge-blue', CONTRACT: 'badge-yellow', INTERNSHIP: 'badge-purple', REMOTE: 'badge-red' }

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [tab, setTab] = useState('overview')
  const [showJobForm, setShowJobForm] = useState(false)
  const [editJob, setEditJob] = useState<any>(null)
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', type: 'FULL_TIME', salary: '', description: '', requirements: '' })
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/login'); return }
      setUser(d.user)
      fetchData()
    })
  }, [])

  const fetchData = async () => {
    const [jobsRes, appsRes] = await Promise.all([fetch('/api/jobs'), fetch('/api/applications')])
    const jobsData = await jobsRes.json(); const appsData = await appsRes.json()
    setJobs(Array.isArray(jobsData) ? jobsData : [])
    setApplications(Array.isArray(appsData) ? appsData : [])
  }

  const myJobs = jobs.filter(j => j.employerId === user?.userId || j.employer)

  const submitJob = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editJob ? `/api/jobs/${editJob.id}` : '/api/jobs'
    const method = editJob ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jobForm) })
    if (res.ok) {
      setMsg(editJob ? '✅ Job updated!' : '✅ Job posted!')
      setShowJobForm(false); setEditJob(null)
      setJobForm({ title: '', company: '', location: '', type: 'FULL_TIME', salary: '', description: '', requirements: '' })
      fetchData()
    } else {
      const d = await res.json(); setMsg('❌ ' + (d.error || 'Failed'))
    }
  }

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
    setMsg('✅ Job deleted'); fetchData()
  }

  const updateStatus = async (appId: string, status: string) => {
    await fetch(`/api/applications/${appId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetchData()
  }

  const startEdit = (job: any) => {
    setEditJob(job)
    setJobForm({ title: job.title, company: job.company, location: job.location, type: job.type, salary: job.salary || '', description: job.description, requirements: job.requirements })
    setShowJobForm(true)
    setTab('jobs')
  }

  if (!user) return <><Navbar /><div style={{ textAlign: 'center', padding: '6rem', color: 'var(--muted)' }}>Loading...</div></>

  const isEmployer = user.role === 'EMPLOYER'

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {user.name} 👋</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>{isEmployer ? 'Employer Dashboard' : 'Candidate Dashboard'}</p>
        </div>

        {msg && <div style={{ padding: '0.75rem 1rem', borderRadius: 8, background: 'var(--surface2)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>{msg}</div>}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {isEmployer ? (
            <>
              <div className="card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{jobs.filter(j => j.employerId === user.userId).length}</div><div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Jobs Posted</div></div>
              <div className="card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent2)' }}>{applications.length}</div><div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Total Applications</div></div>
              <div className="card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent3)' }}>{applications.filter(a => a.status === 'SHORTLISTED').length}</div><div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Shortlisted</div></div>
            </>
          ) : (
            <>
              <div className="card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{applications.length}</div><div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Applied</div></div>
              <div className="card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent3)' }}>{applications.filter(a => a.status === 'SHORTLISTED').length}</div><div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Shortlisted</div></div>
              <div className="card" style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent2)' }}>{applications.filter(a => a.status === 'PENDING').length}</div><div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Pending</div></div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
          {(isEmployer ? ['overview', 'jobs', 'applications'] : ['applications']).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '0.6rem 1.2rem', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent', color: tab === t ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 600, fontSize: '0.95rem', textTransform: 'capitalize', marginBottom: '-1px' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Employer: Jobs Tab */}
        {tab === 'jobs' && isEmployer && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>My Job Posts</h2>
              <button className="btn-primary" onClick={() => { setEditJob(null); setJobForm({ title: '', company: '', location: '', type: 'FULL_TIME', salary: '', description: '', requirements: '' }); setShowJobForm(!showJobForm) }}>
                {showJobForm ? 'Cancel' : '+ Post New Job'}
              </button>
            </div>

            {showJobForm && (
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>{editJob ? 'Edit Job' : 'Post a New Job'}</h3>
                <form onSubmit={submitJob} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Job Title *</label><input placeholder="e.g. Senior React Developer" value={jobForm.title} onChange={e => setJobForm(p => ({ ...p, title: e.target.value }))} required /></div>
                  <div><label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Company *</label><input placeholder="Company name" value={jobForm.company} onChange={e => setJobForm(p => ({ ...p, company: e.target.value }))} required /></div>
                  <div><label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Location *</label><input placeholder="e.g. Hyderabad / Remote" value={jobForm.location} onChange={e => setJobForm(p => ({ ...p, location: e.target.value }))} required /></div>
                  <div><label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Job Type *</label><select value={jobForm.type} onChange={e => setJobForm(p => ({ ...p, type: e.target.value }))}>{JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}</select></div>
                  <div><label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Salary (optional)</label><input placeholder="e.g. ₹8-12 LPA" value={jobForm.salary} onChange={e => setJobForm(p => ({ ...p, salary: e.target.value }))} /></div>
                  <div style={{ gridColumn: '1/-1' }}><label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Description *</label><textarea rows={4} placeholder="Describe the role..." value={jobForm.description} onChange={e => setJobForm(p => ({ ...p, description: e.target.value }))} required style={{ resize: 'vertical' }} /></div>
                  <div style={{ gridColumn: '1/-1' }}><label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Requirements *</label><textarea rows={4} placeholder="List required skills and experience..." value={jobForm.requirements} onChange={e => setJobForm(p => ({ ...p, requirements: e.target.value }))} required style={{ resize: 'vertical' }} /></div>
                  <div style={{ gridColumn: '1/-1' }}><button className="btn-primary" type="submit" style={{ padding: '0.75rem 2rem' }}>{editJob ? 'Update Job' : 'Post Job'}</button></div>
                </form>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {jobs.filter(j => j.employerId === user.userId).map((job: any) => (
                <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' as any }}>
                  <div>
                    <h3 style={{ fontWeight: 700 }}>{job.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{job.company} · {job.location} · {job._count?.applications || 0} applicants</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className={`badge ${TYPE_COLORS[job.type] || 'badge-purple'}`}>{job.type.replace('_', ' ')}</span>
                    <button onClick={() => startEdit(job)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.35rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' }}>Edit</button>
                    <button onClick={() => deleteJob(job.id)} style={{ background: 'none', border: '1px solid var(--accent2)', color: 'var(--accent2)', padding: '0.35rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                  </div>
                </div>
              ))}
              {jobs.filter(j => j.employerId === user.userId).length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>No jobs posted yet. Post your first job above!</p>}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {tab === 'applications' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>{isEmployer ? 'All Applications' : 'My Applications'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.map((app: any) => (
                <div key={app.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as any, gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{isEmployer ? app.candidate?.name : app.job?.title}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{isEmployer ? app.candidate?.email + ' · ' + app.job?.title : app.job?.company?.name || ''}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                      {isEmployer && (
                        <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}>
                          {['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{app.coverLetter}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Applied: {new Date(app.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
              {applications.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem' }}>No applications yet.</p>}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem', marginTop: '4rem' }}>
        <p>Built with ❤️ by <strong style={{ color: 'var(--text)' }}>Mogili Yedukondalu</strong> &nbsp;|&nbsp;
          <a href="https://github.com/kondalu4835" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>GitHub</a> &nbsp;|&nbsp;
          <a href="https://linkedin.com/in/yedukondalu-mogili" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>LinkedIn</a>
        </p>
      </footer>
    </>
  )
}
