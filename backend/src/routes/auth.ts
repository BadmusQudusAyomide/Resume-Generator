import { Router } from 'express'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Verify token endpoint
router.post('/verify-token', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user 
  })
})

export default router
