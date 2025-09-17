import { useState } from 'react'
import { useResume } from '../../contexts/ResumeContext'
import { Plus, Trash2, Edit3 } from 'lucide-react'

export default function ExperienceSection() {
  const { currentResume, updateResumeData } = useResume()
  const [editingId, setEditingId] = useState<string | null>(null)

  const addExperience = () => {
    if (!currentResume) return

    const newExperience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    }

    updateResumeData({
      experience: [...currentResume.data.experience, newExperience]
    })
    setEditingId(newExperience.id)
  }

  const updateExperience = (id: string, updates: any) => {
    if (!currentResume) return

    const updated = currentResume.data.experience.map(exp =>
      exp.id === id ? { ...exp, ...updates } : exp
    )

    updateResumeData({ experience: updated })
  }

  const removeExperience = (id: string) => {
    if (!currentResume) return

    const updated = currentResume.data.experience.filter(exp => exp.id !== id)
    updateResumeData({ experience: updated })
  }

  const addAchievement = (experienceId: string) => {
    if (!currentResume) return

    const experience = currentResume.data.experience.find(exp => exp.id === experienceId)
    if (!experience) return

    const updated = currentResume.data.experience.map(exp =>
      exp.id === experienceId 
        ? { ...exp, achievements: [...exp.achievements, ''] }
        : exp
    )

    updateResumeData({ experience: updated })
  }

  const updateAchievement = (experienceId: string, index: number, value: string) => {
    if (!currentResume) return

    const updated = currentResume.data.experience.map(exp =>
      exp.id === experienceId 
        ? { 
            ...exp, 
            achievements: exp.achievements.map((ach, i) => i === index ? value : ach)
          }
        : exp
    )

    updateResumeData({ experience: updated })
  }

  const removeAchievement = (experienceId: string, index: number) => {
    if (!currentResume) return

    const updated = currentResume.data.experience.map(exp =>
      exp.id === experienceId 
        ? { 
            ...exp, 
            achievements: exp.achievements.filter((_, i) => i !== index)
          }
        : exp
    )

    updateResumeData({ experience: updated })
  }

  return (
    <div className="space-y-4">
      {currentResume?.data.experience.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">
              {exp.position || 'New Position'} at {exp.company || 'Company'}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingId(editingId === exp.id ? null : exp.id)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeExperience(exp.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {editingId === exp.id && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    className="input"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    className="input"
                    placeholder="Tech Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    className="input"
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      className="input"
                      disabled={exp.current}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, { 
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : exp.endDate
                  })}
                  className="mr-2"
                />
                <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700">
                  Currently working here
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  rows={3}
                  className="input"
                  placeholder="Brief description of your role and responsibilities..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Key Achievements
                  </label>
                  <button
                    onClick={() => addAchievement(exp.id)}
                    className="btn btn-secondary text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Achievement</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {exp.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        value={achievement}
                        onChange={(e) => updateAchievement(exp.id, index, e.target.value)}
                        className="input flex-1"
                        placeholder="Achievement description..."
                      />
                      <button
                        onClick={() => removeAchievement(exp.id, index)}
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
        onClick={addExperience}
        className="btn btn-secondary w-full flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Experience</span>
      </button>
    </div>
  )
}
