import { } from 'react'
import { ResumeData, ResumeStyles } from '../contexts/ResumeContext'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

interface ModernTemplateProps {
  data: ResumeData
  styles: ResumeStyles
}

export default function ModernTemplate({ data, styles }: ModernTemplateProps) {
  const getFontClass = () => {
    switch (styles.font) {
      case 'georgia': return 'font-serif'
      case 'jetbrains': return 'font-mono'
      default: return 'font-sans'
    }
  }

  const getSpacingClass = () => {
    switch (styles.spacing) {
      case 'compact': return 'space-y-2'
      case 'spacious': return 'space-y-6'
      default: return 'space-y-4'
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

  return (
    <div className={`${getFontClass()} text-gray-900 p-8 max-w-4xl mx-auto`}>
      {/* Header */}
      <header className="text-center mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: styles.primaryColor }}
        >
          {data.personal.firstName} {data.personal.lastName}
        </h1>
        
        {data.personal.summary && (
          <p className="text-lg mb-4 text-gray-600 max-w-2xl mx-auto">
            {data.personal.summary}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {data.personal.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" style={{ color: styles.primaryColor }} />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" style={{ color: styles.primaryColor }} />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" style={{ color: styles.primaryColor }} />
              <span>{data.personal.location}</span>
            </div>
          )}
          {data.personal.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" style={{ color: styles.primaryColor }} />
              <a href={data.personal.website} className="hover:underline">
                {data.personal.website}
              </a>
            </div>
          )}
        </div>
      </header>

      <div className={`${getSpacingClass()}`}>
        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 
              className="text-xl font-semibold mb-4 pb-2 border-b-2"
              style={{ 
                color: styles.primaryColor,
                borderColor: styles.primaryColor 
              }}
            >
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="font-medium" style={{ color: styles.secondaryColor }}>
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-2">{exp.description}</p>
                  )}
                  
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 
              className="text-xl font-semibold mb-4 pb-2 border-b-2"
              style={{ 
                color: styles.primaryColor,
                borderColor: styles.primaryColor 
              }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="font-medium" style={{ color: styles.secondaryColor }}>
                        {edu.institution}
                        {edu.location && ` • ${edu.location}`}
                      </p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </div>
                  </div>
                  
                  {edu.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {edu.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 
              className="text-xl font-semibold mb-4 pb-2 border-b-2"
              style={{ 
                color: styles.primaryColor,
                borderColor: styles.primaryColor 
              }}
            >
              Skills
            </h2>
            <div className="space-y-4">
              {Object.entries(
                data.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) {
                    acc[skill.category] = []
                  }
                  acc[skill.category].push(skill)
                  return acc
                }, {} as Record<string, typeof data.skills>)
              ).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="font-medium mb-2" style={{ color: styles.secondaryColor }}>
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: styles.primaryColor + '20',
                          color: styles.primaryColor
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <h2 
              className="text-xl font-semibold mb-4 pb-2 border-b-2"
              style={{ 
                color: styles.primaryColor,
                borderColor: styles.primaryColor 
              }}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      {project.url && (
                        <a 
                          href={project.url} 
                          className="text-sm hover:underline"
                          style={{ color: styles.primaryColor }}
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {formatDateRange(project.startDate, project.endDate, project.current)}
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-700 mb-2">{project.description}</p>
                  )}
                  
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
