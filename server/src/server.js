import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import performanceRoutes from './routes/performances.js'
import ticketRoutes from './routes/tickets.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: FRONTEND_URL || '*',
  }),
)
app.use(express.json({ limit: '10mb' }))

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/performances', performanceRoutes)
app.use('/api/v1/tickets', ticketRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: { message: err.message || 'Internal server error' }
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
