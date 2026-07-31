'use client'

import { Inbox, Sparkles, ShieldCheck } from 'lucide-react'
import IntegrationCard from '../IntegrationCard'
import type { Provider, ConnectionCounts } from '../types'
import { PROVIDER_ICON_META } from '@/components/icons/ProviderIcon'

const WHY_MESSENGER = [
  {
    Icon: Inbox,
    text: '여러 메신저의 메시지를 CoChat 한곳에서 모아 볼 수 있어요.',
  },
  {
    Icon: Sparkles,
    text: 'AI가 메시지 중요도를 긴급/중요/보통/낮음으로 자동 분류해요.',
  },
  {
    Icon: ShieldCheck,
    text: '집중모드에서는 긴급 알림만 실시간으로 받아볼 수 있어요.',
  },
]

const MESSENGER_PROVIDERS: {
  id: Provider | 'kakaowork' | 'naverworks' | 'telegram'
  name: string
  description: string
  iconBg: string
  Icon: React.ComponentType<{ size?: number; color?: string }>
  iconColor: string
  comingSoon?: boolean
}[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: '연결할 계정을 입력해주세요.',
    iconBg: PROVIDER_ICON_META.slack.bg,
    Icon: PROVIDER_ICON_META.slack.Icon,
    iconColor: PROVIDER_ICON_META.slack.color,
  },
  {
    id: 'discord',
    name: 'Discord',
    description: '연결할 계정을 입력해주세요.',
    iconBg: PROVIDER_ICON_META.discord.bg,
    Icon: PROVIDER_ICON_META.discord.Icon,
    iconColor: PROVIDER_ICON_META.discord.color,
  },
  {
    id: 'jira',
    name: 'Jira',
    description: '추후 지원 예정입니다.',
    iconBg: PROVIDER_ICON_META.jira.bg,
    Icon: PROVIDER_ICON_META.jira.Icon,
    iconColor: PROVIDER_ICON_META.jira.color,
    comingSoon: true,
  },
  {
    id: 'kakaowork',
    name: PROVIDER_ICON_META.kakaowork.name,
    description: '추후 지원 예정입니다.',
    iconBg: PROVIDER_ICON_META.kakaowork.bg,
    Icon: PROVIDER_ICON_META.kakaowork.Icon,
    iconColor: PROVIDER_ICON_META.kakaowork.color,
    comingSoon: true,
  },
  {
    id: 'naverworks',
    name: PROVIDER_ICON_META.naverworks.name,
    description: '추후 지원 예정입니다.',
    iconBg: PROVIDER_ICON_META.naverworks.bg,
    Icon: PROVIDER_ICON_META.naverworks.Icon,
    iconColor: PROVIDER_ICON_META.naverworks.color,
    comingSoon: true,
  },
  {
    id: 'telegram',
    name: PROVIDER_ICON_META.telegram.name,
    description: '추후 지원 예정입니다.',
    iconBg: PROVIDER_ICON_META.telegram.bg,
    Icon: PROVIDER_ICON_META.telegram.Icon,
    iconColor: PROVIDER_ICON_META.telegram.color,
    comingSoon: true,
  },
]

interface MessengerStepProps {
  connectionCounts: ConnectionCounts
  loading: Provider | null
  error: string | null
  onConnect: (provider: Provider) => void
  onBack: () => void
  onNext: () => void
}

export default function MessengerStep({ connectionCounts, loading, error, onConnect, onBack, onNext }: MessengerStepProps) {
  return (
    <div className="flex w-full max-w-[1000px] flex-col items-center gap-4 sm:gap-5">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2
          className="font-bold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-xl)', lineHeight: 'var(--line-height-2xl)' }}
        >
          메신저를 연동해주세요
        </h2>
        <p
          className="text-[var(--color-gray-700)]"
          style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
        >
          업무에서 사용하는 메신저를 연동하면 모든 알림을 CoChat 한곳에서 확인할 수 있어요.
        </p>
      </div>

      {/* 왜 필요한지 / 어떤 기능을 쓸 수 있는지 간략 설명 */}
      <div className="flex w-full max-w-[560px] flex-col gap-2 rounded-[14px] border border-[var(--color-gray-80)] p-4">
        {WHY_MESSENGER.map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: 'var(--color-brand-20)' }}
            >
              <Icon size={14} className="text-[var(--color-brand-500)]" />
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

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {MESSENGER_PROVIDERS.map(({ id, name, description, iconBg, Icon, iconColor, comingSoon }) => {
          const connectionCount = connectionCounts[id as Provider] ?? 0
          return (
            <IntegrationCard
              key={id}
              name={name}
              description={description}
              iconBg={iconBg}
              Icon={Icon}
              iconColor={iconColor}
              isConnected={connectionCount > 0}
              connectionCount={connectionCount}
              isLoading={loading === id}
              comingSoon={comingSoon}
              onConnect={() => onConnect(id as Provider)}
            />
          )
        })}
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
          onClick={onNext}
          className="flex h-12 w-[130px] items-center justify-center rounded-[12px] font-medium text-white transition-opacity hover:opacity-80"
          style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-brand-500)' }}
        >
          다음
        </button>
      </div>
    </div>
  )
}
