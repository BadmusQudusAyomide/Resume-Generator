import { Request, Response, NextFunction } from 'express'
import { getAuth } from '../config/firebase'

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string
    email?: string
    displayName?: string
  }
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const decodedToken = await getAuth().verifyIdToken(token)
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name
    }

    next()
  } catch (error) {
    console.error('Token verification failed:', error)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}
