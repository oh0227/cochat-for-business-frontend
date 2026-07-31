'use client'

import { Check, Loader2 } from 'lucide-react'

interface IntegrationCardProps {
  name: string
  description: string
  iconBg: string
  Icon: React.ComponentType<{ size?: number; color?: string }>
  iconColor: string
  isConnected: boolean
  connectionCount: number
  isLoading: boolean
  comingSoon?: boolean
  onConnect: () => void
}

/** 셋업 온보딩(메신저/캘린더 단계)에서 공용으로 쓰는 연동 카드. */
export default function IntegrationCard({
  name,
  description,
  iconBg,
  Icon,
  iconColor,
  isConnected,
  connectionCount,
  isLoading,
  comingSoon = false,
  onConnect,
}: IntegrationCardProps) {
  return (
    <div
      className="relative flex min-h-[220px] flex-col justify-between gap-5 rounded-[20px] p-6"
      style={{
        border: `${isConnected ? '1.5px' : '1px'} solid ${isConnected ? 'var(--color-brand-400)' : 'var(--color-gray-80)'}`,
        opacity: comingSoon ? 0.6 : 1,
      }}
    >
      {/* 연결 완료 배지 (우상단) */}
      {isConnected && (
        <div
          className="absolute right-[14px] top-[14px] flex size-6 items-center justify-center rounded-full"
          style={{ background: 'var(--color-brand-500)' }}
        >
          <Check size={14} color="white" strokeWidth={2.5} />
        </div>
      )}

      {/* 상단: 아이콘 + 텍스트 */}
      <div className="flex flex-col gap-4">
        <span
          className="flex items-center justify-center rounded-[10px]"
          style={{ width: 48, height: 48, background: iconBg }}
        >
          <Icon size={24} color={iconColor} />
        </span>

        <div className="flex flex-col gap-[2px]">
          <span
            className="font-semibold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-md)', lineHeight: 'var(--line-height-sm)' }}
          >
            {name}
          </span>
          <p
            className="text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            {description}
          </p>
          {isConnected && (
            <p
              className="font-medium"
              style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)', color: 'var(--color-brand-600)' }}
            >
              연동 {connectionCount}개
            </p>
          )}
        </div>
      </div>

      {/* 하단: 연결하기 버튼 / 추후지원 배지 */}
      {comingSoon ? (
        <span
          className="flex h-10 w-full items-center justify-center rounded-[12px] font-medium"
          style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-gray-50)', color: 'var(--color-gray-500)' }}
        >
          추후지원 예정
        </span>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          disabled={isLoading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
          style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-gray-inverse)' }}
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          연결하기
        </button>
      )}
    </div>
  )
}
