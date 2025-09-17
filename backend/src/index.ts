import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import authRoutes from './routes/auth'
import resumeRoutes from './routes/resumes'
import exportRoutes from './routes/export'
import aiRoutes from './routes/ai'
import paymentRoutes from './routes/payments'
import { errorHandler } from './middleware/errorHandler'
import { initializeFirebase } from './config/firebase'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Firebase Admin
initializeFirebase()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression
app.use(compression())

// Logging
app.use(morgan('combined'))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/resumes', resumeRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/payments', paymentRoutes)

// Public resume route
app.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    // TODO: Implement public resume rendering
    res.json({ message: 'Public resume route - coming soon', slug })
  } catch (error) {
    console.error('Error rendering public resume:', error)
    res.status(500).json({ error: 'Failed to render public resume' })
  }
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

export default app
