import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Configure CORS to allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://fepme.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean)

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
app.use(express.json({ limit: '10mb' }))

// Import Firebase and routes after middleware setup
let firebaseInitialized = false
try {
  await import('./config/firebase.js')
  firebaseInitialized = true
} catch (error) {
  console.error('Firebase initialization failed:', error.message)
}

// Import routes
const performanceRoutes = (await import('./routes/performances.js')).default
const ticketRoutes = (await import('./routes/tickets.js')).default
const authRoutes = (await import('./routes/auth.js')).default

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/performances', performanceRoutes)
app.use('/api/v1/tickets', ticketRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    firebase: firebaseInitialized ? 'connected' : 'failed',
    timestamp: new Date().toISOString()
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: { message: err.message || 'Internal server error' }
  })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

// Export for Vercel serverless
export default app
