import { ResumeData, ResumeStyles } from '../types/resume'

interface PDFOptions {
  resumeData: ResumeData
  templateId: string
  styles: ResumeStyles
  watermark?: boolean
}

export async function generatePDF(options: PDFOptions): Promise<Buffer> {
  // For now, return HTML as a simple response
  // In production, you can add Puppeteer or other PDF generation libraries
  const html = generateHTML(options)
  
  // Return HTML content that can be printed to PDF by the browser
  return Buffer.from(html, 'utf-8')
}

function generateHTML(options: PDFOptions): string {
  const { resumeData, styles, watermark } = options
  
  const getFontFamily = () => {
    switch (styles.font) {
      case 'georgia': return 'Georgia, serif'
      case 'jetbrains': return 'JetBrains Mono, monospace'
      default: return 'Inter, system-ui, sans-serif'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatDateRange = (start: string, end: string, current: boolean) => {
    const startFormatted = formatDate(start)
    const endFormatted = current ? 'Present' : formatDate(end)
    return `${startFormatted} - ${endFormatted}`
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Resume - ${resumeData.personal.firstName} ${resumeData.personal.lastName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: ${getFontFamily()};
            line-height: 1.6;
            color: #333;
            background: white;
          }
          
          .container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid ${styles.primaryColor};
          }
          
          .name {
            font-size: 28px;
            font-weight: bold;
            color: ${styles.primaryColor};
            margin-bottom: 10px;
          }
          
          .contact {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 14px;
            color: ${styles.secondaryColor};
          }
          
          .section {
            margin-bottom: 25px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: ${styles.primaryColor};
            border-bottom: 2px solid ${styles.primaryColor};
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          
          .experience-item, .education-item, .project-item {
            margin-bottom: 20px;
          }
          
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          
          .item-title {
            font-weight: bold;
            font-size: 16px;
          }
          
          .item-company {
            color: ${styles.secondaryColor};
            font-weight: 500;
          }
          
          .item-date {
            font-size: 14px;
            color: #666;
            white-space: nowrap;
          }
          
          .item-description {
            margin-bottom: 8px;
            color: #555;
          }
          
          .achievements {
            list-style: none;
            padding-left: 0;
          }
          
          .achievements li {
            position: relative;
            padding-left: 15px;
            margin-bottom: 4px;
          }
          
          .achievements li:before {
            content: "•";
            color: ${styles.primaryColor};
            position: absolute;
            left: 0;
          }
          
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .skill-category {
            margin-bottom: 15px;
          }
          
          .skill-category h4 {
            font-size: 14px;
            font-weight: bold;
            color: ${styles.secondaryColor};
            margin-bottom: 8px;
          }
          
          .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
          }
          
          .skill-tag {
            background: ${styles.primaryColor}20;
            color: ${styles.primaryColor};
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 48px;
            color: rgba(0, 0, 0, 0.1);
            z-index: 1000;
            pointer-events: none;
            user-select: none;
          }
          
          @media print {
            .watermark {
              display: ${watermark ? 'block' : 'none'};
            }
          }
        </style>
      </head>
      <body>
        ${watermark ? '<div class="watermark">Resume Builder</div>' : ''}
        
        <div class="container">
          <!-- Header -->
          <header class="header">
            <h1 class="name">${resumeData.personal.firstName} ${resumeData.personal.lastName}</h1>
            ${resumeData.personal.summary ? `<p style="font-size: 16px; color: #666; margin-bottom: 15px;">${resumeData.personal.summary}</p>` : ''}
            <div class="contact">
              ${resumeData.personal.email ? `<span>📧 ${resumeData.personal.email}</span>` : ''}
              ${resumeData.personal.phone ? `<span>📞 ${resumeData.personal.phone}</span>` : ''}
              ${resumeData.personal.location ? `<span>📍 ${resumeData.personal.location}</span>` : ''}
              ${resumeData.personal.website ? `<span>🌐 ${resumeData.personal.website}</span>` : ''}
            </div>
          </header>

          <!-- Experience -->
          ${resumeData.experience.length > 0 ? `
            <section class="section">
              <h2 class="section-title">Professional Experience</h2>
              ${resumeData.experience.map(exp => `
                <div class="experience-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${exp.position}</div>
                      <div class="item-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                    </div>
                    <div class="item-date">${formatDateRange(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                  ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                  ${exp.achievements.length > 0 ? `
                    <ul class="achievements">
                      ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}

          <!-- Education -->
          ${resumeData.education.length > 0 ? `
            <section class="section">
              <h2 class="section-title">Education</h2>
              ${resumeData.education.map(edu => `
                <div class="education-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${edu.degree} in ${edu.field}</div>
                      <div class="item-company">${edu.institution}${edu.location ? ` • ${edu.location}` : ''}</div>
                      ${edu.gpa ? `<div style="font-size: 14px; color: #666;">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                    <div class="item-date">${formatDateRange(edu.startDate, edu.endDate, edu.current)}</div>
                  </div>
                  ${edu.achievements.length > 0 ? `
                    <ul class="achievements">
                      ${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}

          <!-- Skills -->
          ${resumeData.skills.length > 0 ? `
            <section class="section">
              <h2 class="section-title">Skills</h2>
              <div class="skills-grid">
                ${Object.entries(
                  resumeData.skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, typeof resumeData.skills>)
                ).map(([category, skills]) => `
                  <div class="skill-category">
                    <h4>${category}</h4>
                    <div class="skill-tags">
                      ${skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Projects -->
          ${resumeData.projects.length > 0 ? `
            <section class="section">
              <h2 class="section-title">Projects</h2>
              ${resumeData.projects.map(project => `
                <div class="project-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${project.name}</div>
                      ${project.url ? `<div style="font-size: 14px; color: ${styles.primaryColor};">${project.url}</div>` : ''}
                    </div>
                    <div class="item-date">${formatDateRange(project.startDate, project.endDate, project.current)}</div>
                  </div>
                  ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                  ${project.technologies.length > 0 ? `
                    <div class="skill-tags">
                      ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}
        </div>
      </body>
    </html>
  `
}
