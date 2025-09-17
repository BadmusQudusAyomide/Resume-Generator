import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { ResumeData, ResumeStyles } from '../types/resume'

interface DOCXOptions {
  resumeData: ResumeData
  templateId: string
  styles: ResumeStyles
}

export async function generateDOCX(options: DOCXOptions): Promise<Buffer> {
  const { resumeData, styles } = options

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header
        new Paragraph({
          children: [
            new TextRun({
              text: `${resumeData.personal.firstName} ${resumeData.personal.lastName}`,
              bold: true,
              size: 32,
              color: styles.primaryColor
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),

        // Contact Info
        new Paragraph({
          children: [
            ...(resumeData.personal.email ? [new TextRun({ text: resumeData.personal.email, size: 20 })] : []),
            ...(resumeData.personal.phone ? [new TextRun({ text: ` • ${resumeData.personal.phone}`, size: 20 })] : []),
            ...(resumeData.personal.location ? [new TextRun({ text: ` • ${resumeData.personal.location}`, size: 20 })] : []),
            ...(resumeData.personal.website ? [new TextRun({ text: ` • ${resumeData.personal.website}`, size: 20 })] : [])
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        }),

        // Summary
        ...(resumeData.personal.summary ? [
          new Paragraph({
            children: [new TextRun({ text: resumeData.personal.summary, size: 22 })],
            spacing: { after: 300 }
          })
        ] : []),

        // Experience
        ...(resumeData.experience.length > 0 ? [
          new Paragraph({
            children: [new TextRun({ text: 'Professional Experience', bold: true, size: 24, color: styles.primaryColor })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          ...resumeData.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true, size: 20 }),
                new TextRun({ text: ` at ${exp.company}`, size: 20, color: styles.secondaryColor })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `${formatDateRange(exp.startDate, exp.endDate, exp.current)}${exp.location ? ` • ${exp.location}` : ''}`, size: 18, color: '#666666' })],
              spacing: { after: 100 }
            }),
            ...(exp.description ? [
              new Paragraph({
                children: [new TextRun({ text: exp.description, size: 20 })],
                spacing: { after: 100 }
              })
            ] : []),
            ...exp.achievements.map(achievement => 
              new Paragraph({
                children: [
                  new TextRun({ text: '• ', size: 20 }),
                  new TextRun({ text: achievement, size: 20 })
                ],
                spacing: { after: 50 }
              })
            ),
            new Paragraph({ children: [new TextRun({ text: '' })] })
          ])
        ] : []),

        // Education
        ...(resumeData.education.length > 0 ? [
          new Paragraph({
            children: [new TextRun({ text: 'Education', bold: true, size: 24, color: styles.primaryColor })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          ...resumeData.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 20 }),
                new TextRun({ text: ` at ${edu.institution}`, size: 20, color: styles.secondaryColor })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `${formatDateRange(edu.startDate, edu.endDate, edu.current)}${edu.location ? ` • ${edu.location}` : ''}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}`, size: 18, color: '#666666' })],
              spacing: { after: 100 }
            }),
            ...edu.achievements.map(achievement => 
              new Paragraph({
                children: [
                  new TextRun({ text: '• ', size: 20 }),
                  new TextRun({ text: achievement, size: 20 })
                ],
                spacing: { after: 50 }
              })
            ),
            new Paragraph({ children: [new TextRun({ text: '' })] })
          ])
        ] : []),

        // Skills
        ...(resumeData.skills.length > 0 ? [
          new Paragraph({
            children: [new TextRun({ text: 'Skills', bold: true, size: 24, color: styles.primaryColor })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          ...Object.entries(
            resumeData.skills.reduce((acc, skill) => {
              if (!acc[skill.category]) acc[skill.category] = []
              acc[skill.category].push(skill)
              return acc
            }, {} as Record<string, typeof resumeData.skills>)
          ).flatMap(([category, skills]) => [
            new Paragraph({
              children: [new TextRun({ text: category, bold: true, size: 20, color: styles.secondaryColor })],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: skills.map(skill => skill.name).join(' • '), size: 20 })],
              spacing: { after: 200 }
            })
          ])
        ] : []),

        // Projects
        ...(resumeData.projects.length > 0 ? [
          new Paragraph({
            children: [new TextRun({ text: 'Projects', bold: true, size: 24, color: styles.primaryColor })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          ...resumeData.projects.flatMap(project => [
            new Paragraph({
              children: [
                new TextRun({ text: project.name, bold: true, size: 20 }),
                ...(project.url ? [new TextRun({ text: ` • ${project.url}`, size: 20, color: styles.primaryColor })] : [])
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: formatDateRange(project.startDate, project.endDate, project.current), size: 18, color: '#666666' })],
              spacing: { after: 100 }
            }),
            ...(project.description ? [
              new Paragraph({
                children: [new TextRun({ text: project.description, size: 20 })],
                spacing: { after: 100 }
              })
            ] : []),
            ...(project.technologies.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: `Technologies: ${project.technologies.join(', ')}`, size: 18, color: '#666666' })],
                spacing: { after: 200 }
              })
            ] : [])
          ])
        ] : [])
      ]
    }]
  })

  return await Packer.toBuffer(doc)
}

function formatDateRange(start: string, end: string, current: boolean): string {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const startFormatted = formatDate(start)
  const endFormatted = current ? 'Present' : formatDate(end)
  return `${startFormatted} - ${endFormatted}`
}
