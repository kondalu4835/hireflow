export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { prisma } from '@/lib/prisma'

const typeColors: Record<string, string> = { FULL_TIME: 'badge-green', PART_TIME: 'badge-blue', CONTRACT: 'badge-yellow', INTERNSHIP: 'badge-purple', REMOTE: 'badge-red' }

export default async function Home() {
  const jobCount = prisma ? await prisma.job.count({ where: { isActive: true } }).catch(() => 0) : 0
  const userCount = prisma ? await prisma.user.count().catch(() => 0) : 0
  const recentJobs = prisma ? await prisma.job.findMany({
    where: { isActive: true },
    include: { employer: { select: { name: true } }, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
    take: 6,
  }).catch(() => []) : []

  return (
    <>
      <Navbar />
      <main>
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, background: 'rgba(108,99,255,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '30%', right: '10%', width: 200, height: 200, background: 'rgba(255,101,132,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <span className="badge badge-purple" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>🚀 India's Smartest Job Board</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: 800 }}>
            Find Jobs That <span style={{ background: 'linear-gradient(135deg, #6c63ff, #ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Actually Match</span> Your Potential
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--muted)', maxWidth: 560, marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Connect with top employers across India. Post jobs, apply with confidence, track everything in one place.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/jobs"><button className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>Browse {jobCount} Jobs →</button></Link>
            <Link href="/register"><button className="btn-outline" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>Post a Job</button></Link>
          </div>
          <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['🏢', jobCount + '+', 'Active Jobs'], ['👥', userCount + '+', 'Users'], ['🎯', '95%', 'Match Rate']].map(([icon, num, label]) => (
              <div key={String(label)} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Latest Opportunities</h2>
            <Link href="/jobs" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {(recentJobs as any[]).map((job: any) => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>{job.title}</h3>
                    <span className={`badge ${typeColors[job.type] || 'badge-purple'}`}>{job.type.replace('_', ' ')}</span>
                  </div>
                  <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{job.company}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>📍 {job.location}</p>
                  {job.salary && <p style={{ color: 'var(--accent3)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>💰 {job.salary}</p>}
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>{job.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <span>👤 {job._count.applications} applicants</span>
                    <span>{new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {recentJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</p>
              <p>No jobs yet. <Link href="/register" style={{ color: 'var(--accent)' }}>Be the first to post!</Link></p>
            </div>
          )}
        </section>

        <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
          <p>Built with ❤️ by <strong style={{ color: 'var(--text)' }}>Mogili Yedukondalu</strong> &nbsp;|&nbsp;
            <a href="https://github.com/kondalu4835" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>GitHub</a> &nbsp;|&nbsp;
            <a href="https://linkedin.com/in/yedukondalu-mogili" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>LinkedIn</a>
          </p>
        </footer>
      </main>
    </>
  )
}
