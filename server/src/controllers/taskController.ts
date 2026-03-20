import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { getIO } from '../lib/socket'

// GET /tasks — all tasks where user is owner or assignee
export async function getTasks(req: AuthRequest, res: Response) {
  const clerkId = req.userId!

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new AppError(404, 'User not found')

  const tasks = await prisma.task.findMany({
    where: {
      OR: [{ ownerId: user.id }, { assigneeId: user.id }],
    },
    include: {
      owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
      assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json(tasks)
}

// POST /tasks — create a task
export async function createTask(req: AuthRequest, res: Response) {
  const clerkId = req.userId!
  const { title, description, dueDate, assigneeEmail } = req.body

  if (!title) throw new AppError(400, 'Title is required')

  const owner = await prisma.user.findUnique({ where: { clerkId } })
  if (!owner) throw new AppError(404, 'User not found')

  let assigneeId: string | undefined
  let pendingAssigneeEmail: string | undefined

  if (assigneeEmail) {
    const assignee = await prisma.user.findUnique({
      where: { email: assigneeEmail },
    })

    if (assignee) {
      assigneeId = assignee.id
    } else {
      // Store email for when they eventually sign up
      pendingAssigneeEmail = assigneeEmail
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      ownerId: owner.id,
      assigneeId,
      pendingAssigneeEmail,
    },
    include: {
      owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
      assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
  })

  // Real-time: notify assignee if they exist
  if (assigneeId) {
    getIO().to(assigneeId).emit('task:assigned', task)
  }

  res.status(201).json({
    ...task,
    assigneeStatus: assigneeId
      ? 'assigned'
      : pendingAssigneeEmail
      ? 'pending'
      : 'none',
  })
}

// PATCH /tasks/:id — update a task
export async function updateTask(req: AuthRequest, res: Response) {
  const clerkId = req.userId!
  const id = req.params.id as string
  const { title, description, status, dueDate } = req.body

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new AppError(404, 'User not found')

  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) throw new AppError(404, 'Task not found')

  // Owner can edit everything
  // Assignee can only update status
  const isOwner = task.ownerId === user.id
  const isAssignee = task.assigneeId === user.id

  if (!isOwner && !isAssignee) {
    throw new AppError(403, 'Not authorized to update this task')
  }

  // Assignee can only change status — not title, description, dueDate
  if (!isOwner && isAssignee) {
    if (!status) throw new AppError(400, 'Assignees can only update task status')

    const updated = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    })

    // Notify both owner and assignee in real-time
    getIO().to(task.ownerId).emit('task:updated', updated)
    getIO().to(user.id).emit('task:updated', updated)

    res.json(updated)
    return
  }

  // Owner can update everything
  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    },
    include: {
      owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
      assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
  })

  // Notify both in real-time
  getIO().to(user.id).emit('task:updated', updated)
  if (updated.assigneeId) {
    getIO().to(updated.assigneeId).emit('task:updated', updated)
  }

  res.json(updated)
}

// DELETE /tasks/:id — delete a task
export async function deleteTask(req: AuthRequest, res: Response) {
  const clerkId = req.userId!
  const id = req.params.id as string

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new AppError(404, 'User not found')

  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) throw new AppError(404, 'Task not found')
  if (task.ownerId !== user.id) throw new AppError(403, 'Not authorized')

  await prisma.task.delete({ where: { id } })

  getIO().to(user.id).emit('task:deleted', { id })
  if (task.assigneeId) {
    getIO().to(task.assigneeId).emit('task:deleted', { id })
  }

  res.json({ message: 'Task deleted successfully' })
}