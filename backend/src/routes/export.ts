import { Router } from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { generatePDF } from '../services/pdfService'
// import { generateDOCX } from '../services/docxService'

const router = Router()

// Export to PDF
router.post('/pdf', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { resumeId, templateId = 'modern' } = req.body

    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' })
    }

    // TODO: Fetch resume data from Firestore
    // TODO: Check if user owns the resume
    // TODO: Apply watermark for free users

    const pdfBuffer = await generatePDF({
      resumeData: req.body.resumeData,
      templateId,
      styles: req.body.styles || {}
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"')
    res.send(pdfBuffer)
  } catch (error) {
    console.error('Error generating PDF:', error)
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
})

// Export to DOCX (temporarily disabled)
router.post('/docx', authenticateToken, async (req: AuthenticatedRequest, res) => {
  res.status(501).json({ error: 'DOCX export temporarily disabled. Use PDF or HTML export instead.' })
})

// Export to HTML
router.post('/html', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { resumeId, templateId = 'modern' } = req.body

    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' })
    }

    // TODO: Generate HTML from template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            h1 { color: #3b82f6; }
            h2 { color: #6b7280; border-bottom: 2px solid #3b82f6; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${req.body.resumeData?.personal?.firstName || ''} ${req.body.resumeData?.personal?.lastName || ''}</h1>
            <p>${req.body.resumeData?.personal?.email || ''}</p>
          </div>
          <div class="section">
            <h2>Professional Summary</h2>
            <p>${req.body.resumeData?.personal?.summary || ''}</p>
          </div>
        </body>
      </html>
    `

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Disposition', 'attachment; filename="resume.html"')
    res.send(html)
  } catch (error) {
    console.error('Error generating HTML:', error)
    res.status(500).json({ error: 'Failed to generate HTML' })
  }
})

export default router
