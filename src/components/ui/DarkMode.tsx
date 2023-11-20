"use client"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { FaMoon, FaSun } from 'react-icons/fa'
import useColorMode from '@/hooks/useColorMode'

const DarkModeButton = () => {
  const [mounted, setMounted] = useState(false);
  const [tailwindColorMode, setTailwindColorMode] = useColorMode();
  
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center'>
        <input
          type='checkbox'
          checked={tailwindColorMode === 'dark'}
          onChange={e => {
            if (typeof setTailwindColorMode === 'function') {
              setTailwindColorMode(tailwindColorMode === 'light' ? 'dark' : 'light');
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }
            }}
          className='sr-only'
        />
        <span className='label flex items-center text-sm text-black dark:text-white'>
          <FaSun />
        </span>
        <span
          className={`slider mx-2 flex h-4 w-[35px] items-center rounded-full p-1 duration-200 ${
            tailwindColorMode === 'dark' ? 'bg-[#212b36]' : 'bg-[#CCCCCE]'
          }`}
        >
          <span
            className={`dot h-3 w-3 rounded-full bg-white duration-200 ${
              tailwindColorMode === 'dark' ? 'translate-x-[14px]' : ''
            }`}
          ></span>
        </span>
        <span className='label flex items-center text-sm text-black dark:text-white'>
          <FaMoon />
        </span>
      </label>
    </>
    
  )
}

export default DarkModeButton