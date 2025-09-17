import { Router } from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import type { Response } from 'express'

const router = Router()

// Verify token endpoint
router.post('/verify-token', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({ 
    valid: true, 
    user: req.user 
  })
})

export default router
