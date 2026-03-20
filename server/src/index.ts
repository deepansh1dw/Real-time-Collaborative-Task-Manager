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

// Init Socket.io
initSocket(httpServer)

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/tasks', taskRoutes)
app.use('/webhooks', webhookRoutes)

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }))

// Error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})