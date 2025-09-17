import { Router } from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { getDb } from '../config/firebase'

const router = Router()

// Get resume by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const resumeDoc = await getDb().collection('resumes').doc(id).get()

    if (!resumeDoc.exists) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    const resumeData = resumeDoc.data()
    
    // Check if user owns the resume or if it's public
    if (resumeData?.ownerId !== req.user?.uid && !resumeData?.isPublic) {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json({
      id: resumeDoc.id,
      ...resumeData,
      createdAt: resumeData?.createdAt?.toDate(),
      updatedAt: resumeData?.updatedAt?.toDate()
    })
  } catch (error) {
    console.error('Error fetching resume:', error)
    res.status(500).json({ error: 'Failed to fetch resume' })
  }
})

// Create new resume
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const resumeData = {
      ...req.body,
      ownerId: req.user?.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await getDb().collection('resumes').add(resumeData)
    
    res.status(201).json({
      id: docRef.id,
      ...resumeData
    })
  } catch (error) {
    console.error('Error creating resume:', error)
    res.status(500).json({ error: 'Failed to create resume' })
  }
})

// Update resume
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const resumeDoc = await getDb().collection('resumes').doc(id).get()

    if (!resumeDoc.exists) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    const resumeData = resumeDoc.data()
    
    // Check if user owns the resume
    if (resumeData?.ownerId !== req.user?.uid) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    }

    await getDb().collection('resumes').doc(id).update(updateData)
    
    res.json({
      id,
      ...resumeData,
      ...updateData
    })
  } catch (error) {
    console.error('Error updating resume:', error)
    res.status(500).json({ error: 'Failed to update resume' })
  }
})

// Delete resume
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const resumeDoc = await getDb().collection('resumes').doc(id).get()

    if (!resumeDoc.exists) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    const resumeData = resumeDoc.data()
    
    // Check if user owns the resume
    if (resumeData?.ownerId !== req.user?.uid) {
      return res.status(403).json({ error: 'Access denied' })
    }

    await getDb().collection('resumes').doc(id).delete()
    
    res.json({ message: 'Resume deleted successfully' })
  } catch (error) {
    console.error('Error deleting resume:', error)
    res.status(500).json({ error: 'Failed to delete resume' })
  }
})

// Get user's resumes
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const resumesSnapshot = await getDb()
      .collection('resumes')
      .where('ownerId', '==', req.user?.uid)
      .orderBy('updatedAt', 'desc')
      .get()

    const resumes = resumesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }))

    res.json(resumes)
  } catch (error) {
    console.error('Error fetching user resumes:', error)
    res.status(500).json({ error: 'Failed to fetch resumes' })
  }
})

export default router
