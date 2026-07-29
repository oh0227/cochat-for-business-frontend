'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, Check } from 'lucide-react'

type PermissionState = NotificationPermission | 'unsupported'

export default function NotificationPermissionButton() {
  const [permission, setPermission] = useState<PermissionState>('default')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPermission('Notification' in window ? Notification.permission : 'unsupported')
  }, [])

  async function handleRequest() {
    // 사용자 클릭(제스처) 안에서 호출해야 브라우저가 권한 프롬프트를 실제로 띄운다.
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  if (permission === 'unsupported') {
    return (
      <p className="text-[var(--color-gray-700)]" style={{ fontSize: 'var(--font-size-3xs)' }}>
        이 브라우저는 데스크톱 알림을 지원하지 않습니다.
      </p>
    )
  }

  if (permission === 'granted') {
    return (
      <div className="flex flex-col gap-[var(--spacing-3xs)]">
        <div className="flex items-center gap-[var(--spacing-3xs)] text-[var(--color-brand-600)]">
          <Check size={16} />
          <span className="font-medium" style={{ fontSize: 'var(--font-size-3xs)' }}>
            데스크톱 알림이 허용되어 있습니다.
          </span>
        </div>
        <p className="text-[var(--color-gray-400)]" style={{ fontSize: 'var(--font-size-5xs)' }}>
          그래도 알림이 안 뜬다면, OS 시스템 설정의 알림 항목에서도 브라우저 알림이 켜져 있는지 확인해주세요.
        </p>
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-[var(--spacing-3xs)] text-[var(--color-gray-700)]">
        <BellOff size={16} />
        <span style={{ fontSize: 'var(--font-size-3xs)' }}>
          알림이 차단되어 있습니다. 브라우저 주소창 옆 사이트 설정에서 직접 허용해주세요.
        </span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleRequest}
      className="flex h-9 w-fit items-center justify-center gap-2 rounded-[12px] px-3 font-medium text-white transition-opacity hover:opacity-80"
      style={{ fontSize: 'var(--font-size-3xs)', background: 'var(--color-gray-inverse)' }}
    >
      <Bell size={16} />
      데스크톱 알림 허용하기
    </button>
  )
}
