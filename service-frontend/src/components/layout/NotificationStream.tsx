'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { TEMP_USER_ID, normalizePriority } from '@/lib/api'
import { useCalendarPromptStore } from '@/store/calendarPromptStore'
import { useDeepWorkStore } from '@/store/deepWorkStore'

interface StreamNotificationPayload {
  id: number
  title: string
  sender_name: string | null
  summary: string
  priority?: string
  calendar_status?: string
  occurred_at?: string
}

function isStreamNotificationPayload(value: unknown): value is StreamNotificationPayload {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.id === 'number' && typeof v.title === 'string' && typeof v.summary === 'string'
}

function showDesktopNotification(payload: StreamNotificationPayload, onOpen: () => void) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const notification = new Notification(payload.title, {
    body: payload.sender_name ? `${payload.sender_name}: ${payload.summary}` : payload.summary,
    icon: '/icon.png',
    tag: String(payload.id),
  })
  notification.onclick = () => {
    window.focus()
    notification.close()
    onOpen()
  }
}

export default function NotificationStream() {
  const router = useRouter()

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!backendUrl) return

    const controller = new AbortController()

    fetchEventSource(`${backendUrl}/api/v1/notifications/stream`, {
      headers: { 'X-Cochat-User-Id': String(TEMP_USER_ID) },
      signal: controller.signal,
      // 탭이 백그라운드로 가도 알림 스트림 연결을 유지한다.
      openWhenHidden: true,
      onmessage(ev) {
        // 알림 목록은 각 라우트의 Server Component(getNotifications)가 들고 있어서
        // 전역 클라이언트 상태가 없다 - 새 알림 수신 시 현재 라우트를 다시 가져와
        // unreadCount/목록을 최신화한다.
        router.refresh()

        let payload: unknown
        try {
          payload = JSON.parse(ev.data)
        } catch {
          // keep-alive 등 JSON이 아닌 메시지는 무시
          return
        }

        if (isStreamNotificationPayload(payload)) {
          // 집중모드 중에는 긴급(critical) 알림만 실시간으로 방해한다.
          // 긴급도 낮은 알림은 팝업/데스크톱 알림 없이 조용히 쌓여서 나중에 목록/브리핑으로 확인한다.
          const isCritical = payload.priority ? normalizePriority(payload.priority) === 'critical' : false
          const shouldNotify = !useDeepWorkStore.getState().isRunning || isCritical

          if (shouldNotify) {
            if (payload.calendar_status === 'prompted') {
              useCalendarPromptStore.getState().enqueue({
                notificationId: String(payload.id),
                title: payload.title,
                summary: payload.summary,
                occurredAt: payload.occurred_at ?? new Date().toISOString(),
              })
            }
            try {
              showDesktopNotification(payload, () => router.push('/messages'))
            } catch (error) {
              console.error('[NotificationStream] 데스크톱 알림 표시 실패', error)
            }
          }
        }
      },
      onerror(err) {
        // 여기서 에러를 다시 던지면 재시도가 멈추므로, 로그만 남기고
        // 라이브러리의 기본 지수 백오프 재시도(네트워크 복귀 시 포함)에 맡긴다.
        console.error('알림 스트림 연결 오류:', err)
      },
    }).catch(() => {
      // 언마운트로 인한 AbortError 등은 무시
    })

    return () => {
      controller.abort()
    }
  }, [router])

  return null
}
