import { useState } from 'react'
import { useResume } from '../../contexts/ResumeContext'
import { Plus, Trash2, Edit3, ExternalLink } from 'lucide-react'

export default function ProjectsSection() {
  const { currentResume, updateResumeData } = useResume()
  const [editingId, setEditingId] = useState<string | null>(null)

  const addProject = () => {
    if (!currentResume) return

    const newProject = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: '',
      current: false
    }

    updateResumeData({
      projects: [...currentResume.data.projects, newProject]
    })
    setEditingId(newProject.id)
  }

  const updateProject = (id: string, updates: any) => {
    if (!currentResume) return

    const updated = currentResume.data.projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    )

    updateResumeData({ projects: updated })
  }

  const removeProject = (id: string) => {
    if (!currentResume) return

    const updated = currentResume.data.projects.filter(project => project.id !== id)
    updateResumeData({ projects: updated })
  }

  const addTechnology = (projectId: string) => {
    if (!currentResume) return

    const project = currentResume.data.projects.find(p => p.id === projectId)
    if (!project) return

    const updated = currentResume.data.projects.map(p =>
      p.id === projectId 
        ? { ...p, technologies: [...p.technologies, ''] }
        : p
    )

    updateResumeData({ projects: updated })
  }

  const updateTechnology = (projectId: string, index: number, value: string) => {
    if (!currentResume) return

    const updated = currentResume.data.projects.map(p =>
      p.id === projectId 
        ? { 
            ...p, 
            technologies: p.technologies.map((tech, i) => i === index ? value : tech)
          }
        : p
    )

    updateResumeData({ projects: updated })
  }

  const removeTechnology = (projectId: string, index: number) => {
    if (!currentResume) return

    const updated = currentResume.data.projects.map(p =>
      p.id === projectId 
        ? { 
            ...p, 
            technologies: p.technologies.filter((_, i) => i !== index)
          }
        : p
    )

    updateResumeData({ projects: updated })
  }

  return (
    <div className="space-y-4">
      {currentResume?.data.projects.map((project) => (
        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">
                {project.name || 'New Project'}
              </h3>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingId(editingId === project.id ? null : project.id)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeProject(project.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {editingId === project.id && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, { name: e.target.value })}
                  className="input"
                  placeholder="E-commerce Website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  rows={3}
                  className="input"
                  placeholder="Brief description of the project, its purpose, and your role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project URL (Optional)
                </label>
                <input
                  value={project.url || ''}
                  onChange={(e) => updateProject(project.id, { url: e.target.value })}
                  className="input"
                  placeholder="https://github.com/username/project"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={project.endDate}
                    onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                    className="input"
                    disabled={project.current}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`current-project-${project.id}`}
                  checked={project.current}
                  onChange={(e) => updateProject(project.id, { 
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : project.endDate
                  })}
                  className="mr-2"
                />
                <label htmlFor={`current-project-${project.id}`} className="text-sm text-gray-700">
                  Currently working on this project
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Technologies Used
                  </label>
                  <button
                    onClick={() => addTechnology(project.id)}
                    className="btn btn-secondary text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Technology</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {project.technologies.map((tech, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        value={tech}
                        onChange={(e) => updateTechnology(project.id, index, e.target.value)}
                        className="input flex-1"
                        placeholder="React, Node.js, MongoDB..."
                      />
                      <button
                        onClick={() => removeTechnology(project.id, index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addProject}
        className="btn btn-secondary w-full flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Project</span>
      </button>
    </div>
  )
}
