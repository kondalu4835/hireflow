import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const applySchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().min(50),
  resume: z.string().optional(),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.role === 'CANDIDATE') {
    const apps = await prisma.application.findMany({
      where: { candidateId: session.userId },
      include: { job: { include: { employer: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(apps)
  } else {
    const apps = await prisma.application.findMany({
      where: { job: { employerId: session.userId } },
      include: { candidate: { select: { name: true, email: true } }, job: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(apps)
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'CANDIDATE') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = applySchema.parse(body)

    const existing = await prisma.application.findUnique({
      where: { jobId_candidateId: { jobId: data.jobId, candidateId: session.userId } },
    })
    if (existing) return NextResponse.json({ error: 'Already applied' }, { status: 400 })

    const app = await prisma.application.create({
      data: { ...data, candidateId: session.userId },
    })
    return NextResponse.json(app, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
