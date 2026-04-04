'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotificationStream() {
  const router = useRouter()

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!backendUrl) return

    const es = new EventSource(`${backendUrl}/api/v1/notifications/stream`)

    es.onmessage = () => {
      router.refresh()
    }

    es.onerror = () => {
      // 연결 오류 시 EventSource가 자동으로 재연결을 시도합니다
    }

    return () => {
      es.close()
    }
  }, [router])

  return null
}
