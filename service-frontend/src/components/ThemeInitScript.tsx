'use client'

import { useRef } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

// 하이드레이션 전에 동기 실행되어 다크모드 깜빡임(FOUC)을 막는다. 정적 문자열만
// 다루므로 사용자 입력이 섞이지 않아 dangerouslySetInnerHTML을 써도 안전하다.
const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem('theme');
    var isDark = stored === 'dark' || (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();`

/**
 * useServerInsertedHTML로 SSR 스트림에 직접 주입해서 React 트리 밖에 둔다.
 * next/script(beforeInteractive)로 렌더링하면 React 19가 "script tag" 하이드레이션
 * 경고를 띄우는데(기능엔 문제 없지만 콘솔이 시끄러움), 이 방식은 그 경고를 피한다.
 */
export default function ThemeInitScript() {
  const inserted = useRef(false)

  useServerInsertedHTML(() => {
    if (inserted.current) return null
    inserted.current = true
    return <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
  })

  return null
}
