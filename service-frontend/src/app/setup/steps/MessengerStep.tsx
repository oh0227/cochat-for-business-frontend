'use client'

import IntegrationCard from '../IntegrationCard'
import type { Provider, ConnectionCounts } from '../types'
import { PROVIDER_ICON_META } from '@/components/icons/ProviderIcon'

const MESSENGER_PROVIDERS: {
  id: Provider
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
    <div className="flex w-full max-w-[1000px] flex-col items-center gap-8 sm:gap-10">
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

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {MESSENGER_PROVIDERS.map(({ id, name, description, iconBg, Icon, iconColor, comingSoon }) => {
          const connectionCount = connectionCounts[id] ?? 0
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
              onConnect={() => onConnect(id)}
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
