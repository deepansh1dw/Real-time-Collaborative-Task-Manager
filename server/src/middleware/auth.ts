import { Request, Response, NextFunction } from 'express'
import { clerkClient, verifyToken } from '@clerk/express'

export interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized — no token provided' })
      return
    }

    const token = authHeader.split(' ')[1]

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    })

    req.userId = payload.sub
    next()
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized — invalid token' })
  }
}