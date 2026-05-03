import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  company: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']).optional(),
  salary: z.string().optional(),
  description: z.string().min(20).optional(),
  requirements: z.string().min(10).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      employer: { select: { name: true, email: true } },
      applications: { include: { candidate: { select: { name: true, email: true } } } },
    },
  })
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  return NextResponse.json(job)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'EMPLOYER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const job = await prisma.job.findUnique({ where: { id } })
  if (!job || job.employerId !== session.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)
    const updated = await prisma.job.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'EMPLOYER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const job = await prisma.job.findUnique({ where: { id } })
  if (!job || job.employerId !== session.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.job.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
