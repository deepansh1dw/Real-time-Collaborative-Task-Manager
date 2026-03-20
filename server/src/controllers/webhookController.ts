import { Request, Response } from 'express'
import { Webhook } from 'svix'
import { prisma } from '../lib/prisma'

export async function handleClerkWebhook(req: Request, res: Response) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    res.status(500).json({ error: 'Webhook secret not configured' })
    return
  }

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: any

  try {
    evt = wh.verify(req.body, {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    res.status(400).json({ error: 'Invalid webhook signature' })
    return
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    // Safety check — skip if no email
    const email = email_addresses?.[0]?.email_address
    if (!email) {
      console.log('No email found in webhook data — skipping')
      res.json({ received: true })
      return
    }

    const name = `${first_name || ''} ${last_name || ''}`.trim() || email

    console.log(`New user signing up: ${email}`)

    try {
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email,
          name,
          avatarUrl: image_url || null,
        },
      })

      console.log(`User saved to DB: ${user.id}`)

      // Resolve pending assignments
      const pending = await prisma.task.updateMany({
        where: { pendingAssigneeEmail: email },
        data: {
          assigneeId: user.id,
          pendingAssigneeEmail: null,
        },
      })

      if (pending.count > 0) {
        console.log(`Resolved ${pending.count} pending assignments for ${email}`)
      }

    } catch (err: any) {
      if (err.code === 'P2002') {
        console.log(`User ${email} already exists in DB`)
      } else {
        console.error('Error saving user:', err)
      }
    }
  }

  res.json({ received: true })
}
