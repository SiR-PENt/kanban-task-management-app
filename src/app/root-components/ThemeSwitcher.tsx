'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
  
    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
      setMounted(true)
    }, [])
  
    if (!mounted) {
      return null
    }

    return (
        <div>
            <p>The current Theme is: { theme }</p>
            <button onClick={() => setTheme('light')}>Light</button>
            <button onClick={() => setTheme('dark')}>Dark</button>
        </div>
    )
}

export default ThemeSwitcher