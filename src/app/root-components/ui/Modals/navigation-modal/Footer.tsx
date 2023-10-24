'use client'

import Image from "next/image"
import iconLightTheme from '../../../../../../public/icon-light-theme.svg'
import iconDarkTheme from '../../../../../../public/icon-dark-theme.svg'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function NavModalFooter() {

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
        <footer className="px-5 pb-3 w-full">
        <div className="h-[3rem] rounded-md flex justify-center items-center space-x-6 bg-light-grey dark:bg-very-dark-grey w-full">
          <Image src={iconLightTheme} alt='board icon' className="object-contain"/>
           <div 
           onClick={() => (theme === 'light') ? setTheme('dark') : setTheme('light')}
           className="w-9 h-5 rounded-2xl px-px relative bg-main-purple flex items-center cursor-pointer">
           <div className={`w-4 h-4 rounded-full bg-white absolute ${theme === 'light' ? 'left-0' : 'right-0' }`}/>
          </div>
          <Image src={iconDarkTheme} alt='board icon' className="object-contain"/>
       </div>
       </footer>
    )
}