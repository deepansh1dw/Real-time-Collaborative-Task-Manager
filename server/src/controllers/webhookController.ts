import { Request, Response } from 'express'
import { Webhook } from 'svix'
import { prisma } from '../lib/prisma'

export async function handleClerkWebhook(req: Request, res: Response) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: any

  try {
    evt = wh.verify(JSON.stringify(req.body), {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    })
  } catch (err) {
    res.status(400).json({ error: 'Invalid webhook signature' })
    return
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    const email = email_addresses[0]?.email_address
    const name = `${first_name || ''} ${last_name || ''}`.trim()

    // Save user to our DB
    const user = await prisma.user.create({
      data: {
        clerkId: id,
        email,
        name: name || email,
        avatarUrl: image_url,
      },
    })

    // Resolve any pending task assignments for this email
    await prisma.task.updateMany({
      where: { pendingAssigneeEmail: email },
      data: {
        assigneeId: user.id,
        pendingAssigneeEmail: null,
      },
    })
  }

  res.json({ received: true })
}