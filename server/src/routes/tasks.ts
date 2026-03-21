import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController'
import { prisma } from '../lib/prisma'
import type { AuthRequest } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

// /me MUST be before /:id
router.get('/me', async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { clerkId: req.userId! },
    select: { id: true },
  })
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  res.json(user)
})

router.get('/', getTasks)
router.post('/', createTask)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router