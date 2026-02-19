import { toggleTheme } from '@/store/themeSlice'
import { Moon, Sun } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'

const ThemeToggleBtn = () => {
    const dispatch = useDispatch()
    const { mode } = useSelector(state => state.theme)
  return (
    <Button className={"cursor-pointer"} variant='ghost' onClick={() => dispatch(toggleTheme())}>{mode === "dark" ? <Sun /> : <Moon />}</Button>
  )
}

export default ThemeToggleBtn
