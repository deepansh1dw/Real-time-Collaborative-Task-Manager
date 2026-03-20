import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import dotenv from 'dotenv'
import { initSocket } from './lib/socket'
import taskRoutes from './routes/tasks'
import webhookRoutes from './routes/webhooks'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const httpServer = createServer(app)

initSocket(httpServer)

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// ⚠️ Webhook route needs raw body — must be BEFORE express.json()
app.use('/webhooks', express.raw({ type: 'application/json' }), webhookRoutes)

// All other routes use JSON
app.use(express.json())
app.use('/tasks', taskRoutes)

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})