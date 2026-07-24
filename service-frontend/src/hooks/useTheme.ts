'use client'

import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

function resolveIsDark(theme: Theme): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', resolveIsDark(theme))
}

/** 라이트/다크/시스템 테마 상태를 localStorage와 <html class="dark">에 동기화한다 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    // localStorage는 서버에 없어 SSR 시점엔 읽을 수 없으므로, 초기 상태를 항상
    // 'system'으로 렌더링해 하이드레이션 불일치를 피하고 마운트 후 실제 값으로 동기화한다.
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(stored)
    }
  }, [])

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  return { theme, setTheme }
}
