import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true) // Default to dark mode

  useEffect(() => {
    // Check if user has a preference stored, default to dark
    const stored = localStorage.getItem('darkMode')
    const shouldBeDark = stored !== null ? stored === 'true' : true // Default to true (dark)
    setIsDark(shouldBeDark)
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="btn btn-icon btn-glass relative overflow-hidden group"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative z-10">
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>
      
      {/* Animated background */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20' 
          : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
      }`} />
    </button>
  )
}
