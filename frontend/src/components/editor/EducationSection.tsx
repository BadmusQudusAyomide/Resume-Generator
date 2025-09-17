import { useState } from 'react'
import { useResume } from '../../contexts/ResumeContext'
import { Plus, Trash2, Edit3 } from 'lucide-react'

export default function EducationSection() {
  const { currentResume, updateResumeData } = useResume()
  const [editingId, setEditingId] = useState<string | null>(null)

  const addEducation = () => {
    if (!currentResume) return

    const newEducation = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      achievements: []
    }

    updateResumeData({
      education: [...currentResume.data.education, newEducation]
    })
    setEditingId(newEducation.id)
  }

  const updateEducation = (id: string, updates: any) => {
    if (!currentResume) return

    const updated = currentResume.data.education.map(edu =>
      edu.id === id ? { ...edu, ...updates } : edu
    )

    updateResumeData({ education: updated })
  }

  const removeEducation = (id: string) => {
    if (!currentResume) return

    const updated = currentResume.data.education.filter(edu => edu.id !== id)
    updateResumeData({ education: updated })
  }

  const addAchievement = (educationId: string) => {
    if (!currentResume) return

    const education = currentResume.data.education.find(edu => edu.id === educationId)
    if (!education) return

    const updated = currentResume.data.education.map(edu =>
      edu.id === educationId 
        ? { ...edu, achievements: [...edu.achievements, ''] }
        : edu
    )

    updateResumeData({ education: updated })
  }

  const updateAchievement = (educationId: string, index: number, value: string) => {
    if (!currentResume) return

    const updated = currentResume.data.education.map(edu =>
      edu.id === educationId 
        ? { 
            ...edu, 
            achievements: edu.achievements.map((ach, i) => i === index ? value : ach)
          }
        : edu
    )

    updateResumeData({ education: updated })
  }

  const removeAchievement = (educationId: string, index: number) => {
    if (!currentResume) return

    const updated = currentResume.data.education.map(edu =>
      edu.id === educationId 
        ? { 
            ...edu, 
            achievements: edu.achievements.filter((_, i) => i !== index)
          }
        : edu
    )

    updateResumeData({ education: updated })
  }

  return (
    <div className="space-y-4">
      {currentResume?.data.education.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">
              {edu.degree || 'Degree'} in {edu.field || 'Field'} at {edu.institution || 'Institution'}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingId(editingId === edu.id ? null : edu.id)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeEducation(edu.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {editingId === edu.id && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    className="input"
                    placeholder="University of California"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                    className="input"
                    placeholder="Berkeley, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    className="input"
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study
                  </label>
                  <input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                    className="input"
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    className="input"
                    disabled={edu.current}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA (Optional)
                  </label>
                  <input
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                    className="input"
                    placeholder="3.8"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`current-edu-${edu.id}`}
                  checked={edu.current}
                  onChange={(e) => updateEducation(edu.id, { 
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : edu.endDate
                  })}
                  className="mr-2"
                />
                <label htmlFor={`current-edu-${edu.id}`} className="text-sm text-gray-700">
                  Currently studying
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Achievements & Activities
                  </label>
                  <button
                    onClick={() => addAchievement(edu.id)}
                    className="btn btn-secondary text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Achievement</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {edu.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        value={achievement}
                        onChange={(e) => updateAchievement(edu.id, index, e.target.value)}
                        className="input flex-1"
                        placeholder="Achievement or activity..."
                      />
                      <button
                        onClick={() => removeAchievement(edu.id, index)}
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
        onClick={addEducation}
        className="btn btn-secondary w-full flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Education</span>
      </button>
    </div>
  )
}
