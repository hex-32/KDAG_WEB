import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { scale } from 'framer-motion'

export default function ThemeToggle({ val }) {
  const getInitial = () => {
    if (typeof window === 'undefined') return 'light'
    return (
      localStorage.getItem('theme') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    )
  }
  
  const [theme, setTheme] = useState(getInitial)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      val(true);
    }
    else {
      document.documentElement.classList.remove('dark');
      val(false);
    }
    localStorage.setItem('theme', theme)
    
  }, [theme])

  const changeTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    location.reload();
  }
  
  return (
    <button
      aria-label="Toggle theme"
      onClick={changeTheme}
      className={`p-2 rounded-2xl hover:scale-110 transition-transform duration-200 ${theme === 'dark' ? 'bg-gray-700 text-white-300' : 'bg-gray-200 text-gray-800'}`}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
