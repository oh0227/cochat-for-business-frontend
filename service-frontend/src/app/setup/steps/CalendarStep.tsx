'use client'

import { Sparkles, CalendarPlus, LayoutDashboard } from 'lucide-react'
import IntegrationCard from '../IntegrationCard'
import type { Provider, ConnectionCounts } from '../types'
import { PROVIDER_ICON_META } from '@/components/icons/ProviderIcon'

const WHY_CALENDAR = [
  {
    Icon: Sparkles,
    text: '메시지에 적힌 일정을 AI가 자동으로 찾아내요.',
  },
  {
    Icon: CalendarPlus,
    text: '확인 후 한 번의 클릭으로 캘린더에 바로 등록해요.',
  },
  {
    Icon: LayoutDashboard,
    text: '등록된 일정은 대시보드와 캘린더 페이지에서 한눈에 확인할 수 있어요.',
  },
]

interface CalendarStepProps {
  connectionCounts: ConnectionCounts
  loading: Provider | null
  error: string | null
  canFinish: boolean
  onConnect: (provider: Provider) => void
  onBack: () => void
  onFinish: () => void
}

export default function CalendarStep({ connectionCounts, loading, error, canFinish, onConnect, onBack, onFinish }: CalendarStepProps) {
  const connectionCount = connectionCounts.google_calendar ?? 0

  return (
    <div className="flex w-full max-w-[1000px] flex-col items-center gap-8 sm:gap-10">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2
          className="font-bold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-xl)', lineHeight: 'var(--line-height-2xl)' }}
        >
          캘린더를 연동해주세요
        </h2>
        <p
          className="text-[var(--color-gray-700)]"
          style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
        >
          캘린더를 연동하면 메신저에서 발견된 일정을 놓치지 않고 관리할 수 있어요.
        </p>
      </div>

      {/* 왜 필요한지 / 어떤 기능을 쓸 수 있는지 간략 설명 */}
      <div className="flex w-full max-w-[560px] flex-col gap-3 rounded-[16px] border border-[var(--color-gray-80)] p-5">
        {WHY_CALENDAR.map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: 'var(--color-brand-20)' }}
            >
              <Icon size={16} className="text-[var(--color-brand-500)]" />
            </span>
            <p
              className="text-[var(--color-gray-700)]"
              style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
            >
              {text}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-[340px]">
        <IntegrationCard
          name="Google Calendar"
          description="일정 관련 알림을 캘린더에 등록할 수 있어요."
          iconBg={PROVIDER_ICON_META.google_calendar.bg}
          Icon={PROVIDER_ICON_META.google_calendar.Icon}
          iconColor={PROVIDER_ICON_META.google_calendar.color}
          isConnected={connectionCount > 0}
          connectionCount={connectionCount}
          isLoading={loading === 'google_calendar'}
          onConnect={() => onConnect('google_calendar')}
        />
      </div>

      {error && (
        <p className="text-center" style={{ fontSize: 'var(--font-size-3xs)', color: 'var(--color-urgent-500)' }}>
          {error}
        </p>
      )}

      <div className="flex w-full max-w-[1000px] justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 w-[110px] items-center justify-center rounded-[12px] font-medium text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
          style={{ fontSize: 'var(--font-size-xs)', border: '1px solid var(--color-gray-80)' }}
        >
          이전
        </button>
        <button
          type="button"
          onClick={onFinish}
          disabled={!canFinish}
          className="flex h-12 w-[130px] items-center justify-center rounded-[12px] font-medium transition-colors"
          style={{
            fontSize: 'var(--font-size-xs)',
            background: canFinish ? 'var(--color-brand-500)' : 'var(--color-gray-50)',
            color: canFinish ? 'white' : 'var(--color-gray-400)',
            cursor: canFinish ? 'pointer' : 'default',
          }}
        >
          시작하기
        </button>
      </div>
    </div>
  )
}
