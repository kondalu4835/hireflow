import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'EMPLOYER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  const app = await prisma.application.findUnique({ where: { id }, include: { job: true } })
  if (!app || app.job.employerId !== session.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const updated = await prisma.application.update({ where: { id }, data: { status } })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const app = await prisma.application.findUnique({ where: { id } })
  if (!app || app.candidateId !== session.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.application.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
