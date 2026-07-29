'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Hash, MessageSquare, Calendar, Check, Loader2 } from 'lucide-react'
import { TEMP_USER_ID } from '@/lib/api'

type Provider = 'slack' | 'discord' | 'jira' | 'google_calendar'
const VALID_PROVIDERS: Provider[] = ['slack', 'discord', 'jira', 'google_calendar']

interface BackendIntegration {
  provider: string
}

/** provider별 연동 계정 개수. 백엔드가 연동 계정마다 별도 레코드를 내려주므로 개수를 센다. */
type ConnectionCounts = Partial<Record<Provider, number>>

async function fetchConnectionCountsFromBackend(): Promise<ConnectionCounts> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!backendUrl) return {}

  try {
    const res = await fetch(`${backendUrl}/api/v1/integrations`, {
      headers: { 'X-Cochat-User-Id': String(TEMP_USER_ID) },
      cache: 'no-store',
    })
    if (!res.ok) return {}
    const data = await res.json() as { integrations?: BackendIntegration[] }
    const counts: ConnectionCounts = {}
    for (const integration of data.integrations ?? []) {
      if (!(VALID_PROVIDERS as string[]).includes(integration.provider)) continue
      const provider = integration.provider as Provider
      counts[provider] = (counts[provider] ?? 0) + 1
    }
    return counts
  } catch {
    return {}
  }
}

const PROVIDERS: {
  id: Provider
  name: string
  description: string
  iconBg: string
  Icon: React.ComponentType<{ size?: number; color?: string }>
  iconColor: string
}[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: '연결할 계정을 입력해주세요.',
    iconBg: 'rgba(236,86,148,0.1)',
    Icon: Hash,
    iconColor: '#ec5694',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: '연결할 계정을 입력해주세요.',
    iconBg: 'rgba(97,95,255,0.1)',
    Icon: MessageSquare,
    iconColor: '#615fff',
  },
  {
    id: 'jira',
    name: 'Jira',
    description: '연결할 계정을 입력해주세요.',
    iconBg: 'rgba(44,79,251,0.1)',
    Icon: Hash,
    iconColor: '#2c4ffb',
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: '일정 관련 알림을 캘린더에 등록할 수 있어요.',
    iconBg: 'rgba(66,133,244,0.1)',
    Icon: Calendar,
    iconColor: '#4285f4',
  },
]

// [백엔드 연결] 이 함수의 fetch URL을 실제 백엔드 엔드포인트로 교체하세요.
// 현재는 목업 route handler(/api/integrations/[provider]/auth)를 호출합니다.
async function getIntegrationAuthUrl(provider: Provider): Promise<string> {
  const res = await fetch(`/api/integrations/${provider}/auth`)
  if (!res.ok) throw new Error(`연동 URL 요청 실패: ${res.status}`)
  const data = await res.json() as { url: string }
  return data.url
}

interface SetupClientProps {
  initialConnected: Provider[]
  initialError?: string | null
}

export default function SetupClient({ initialConnected, initialError = null }: SetupClientProps) {
  const router = useRouter()

  // 방금 돌아온 라운드트립의 provider는 우선 1개로 낙관적 표시하고,
  // 마운트 직후 백엔드 실제 개수로 덮어쓴다.
  const [connectionCounts, setConnectionCounts] = useState<ConnectionCounts>(() =>
    Object.fromEntries(initialConnected.map((provider) => [provider, 1]))
  )
  const [loading, setLoading] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(initialError)

  useEffect(() => {
    let cancelled = false

    fetchConnectionCountsFromBackend().then((counts) => {
      if (!cancelled) setConnectionCounts(counts)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const isAnyConnected = Object.values(connectionCounts).some((count) => (count ?? 0) > 0)

  async function handleConnect(provider: Provider) {
    setError(null)
    setLoading(provider)
    try {
      const url = await getIntegrationAuthUrl(provider)
      // 외부 OAuth URL로 리다이렉트 (Next.js router 대신 window.location 사용)
      window.location.href = url
    } catch (e) {
      setError(e instanceof Error ? e.message : '연결 중 오류가 발생했습니다.')
      setLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-gray-default)]">
      {/* 본문 */}
      <div className="flex flex-1 flex-col items-center px-[var(--spacing-md)] pt-16 sm:px-[var(--spacing-xl)] sm:pt-24 lg:pt-[170px]">
        <div className="flex w-full max-w-[1000px] flex-col items-start gap-10 sm:gap-14">
          {/* 상단: 로고 + 환영 메시지 */}
          <div className="flex w-full flex-col items-center gap-6 sm:gap-10">
            <Image src="/icon.png" alt="CoChat" width={72} height={72} />

            <div className="flex flex-col items-center gap-1 text-center">
              <h1
                className="font-bold text-[var(--color-gray-950)]"
                style={{ fontSize: 'var(--font-size-2xl)', lineHeight: 'var(--line-height-3xl)' }}
              >
                Cochat에 오신 것을 환영합니다.
              </h1>
              <p
                className="text-[var(--color-gray-700)]"
                style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
              >
                CoChat은 여러 워크스페이스의 알림을 한곳에 모아 메시지의 중요도를 분류해 전달하여,
                <br className="hidden sm:inline" />
                사용자가 온전히 집중할 수 있는 업무 환경을 만듭니다.
              </p>
            </div>
          </div>

          {/* 워크스페이스 연결 섹션 */}
          <div className="flex w-full flex-col items-center gap-4">
            <div className="w-full">
              <span
                className="font-semibold text-[var(--color-gray-950)]"
                style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
              >
                워크스페이스 연결
              </span>
            </div>

            {/* 연결 카드 목록 */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {PROVIDERS.map(({ id, name, description, iconBg, Icon, iconColor }) => {
                const connectionCount = connectionCounts[id] ?? 0
                const isConnected = connectionCount > 0
                const isLoading = loading === id

                return (
                  <div
                    key={id}
                    className="relative flex flex-col justify-between rounded-[20px] p-6"
                    style={{
                      height: 250,
                      border: `${isConnected ? '1.5px' : '1px'} solid ${isConnected ? 'var(--color-brand-400)' : 'var(--color-gray-80)'}`,
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
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-4">
                        {/* 플랫폼 아이콘 */}
                        <span
                          className="flex items-center justify-center rounded-[10px]"
                          style={{ width: 48, height: 48, background: iconBg }}
                        >
                          <Icon size={24} color={iconColor} />
                        </span>

                        <div className="flex flex-col gap-[2px]">
                          <div className="flex flex-wrap items-center gap-1">
                            <span
                              className="font-semibold text-[var(--color-gray-950)]"
                              style={{ fontSize: 'var(--font-size-md)', lineHeight: 'var(--line-height-sm)' }}
                            >
                              {name}
                            </span>
                            <span
                              className="font-semibold text-[var(--color-gray-950)]"
                              style={{ fontSize: 'var(--font-size-md)', lineHeight: 'var(--line-height-sm)' }}
                            >
                              연결하기
                            </span>
                          </div>
                          <p
                            className="text-[var(--color-gray-700)]"
                            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                          >
                            {description}
                          </p>
                          {/* 연동 계정 수 */}
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
                    </div>

                    {/* 하단: 연결하기 버튼 */}
                    <button
                      type="button"
                      onClick={() => handleConnect(id)}
                      disabled={isLoading}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
                      style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-gray-inverse)' }}
                    >
                      {isLoading && <Loader2 size={16} className="animate-spin" />}
                      연결하기
                    </button>
                  </div>
                )
              })}
            </div>

            {error && (
              <p
                className="text-center"
                style={{ fontSize: 'var(--font-size-3xs)', color: 'var(--color-urgent-500)' }}
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 하단 바 */}
      <div
        className="flex shrink-0 items-center justify-center px-[var(--spacing-md)] sm:px-[var(--spacing-xl)]"
        style={{ height: 128, borderTop: '1px solid var(--color-gray-80)' }}
      >
        <div className="flex w-full max-w-[1000px] justify-end">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            disabled={!isAnyConnected}
            className="flex h-12 w-full items-center justify-center rounded-[12px] font-medium transition-colors sm:w-[130px]"
            style={{
              fontSize: 'var(--font-size-xs)',
              background: isAnyConnected ? 'var(--color-brand-500)' : 'var(--color-gray-50)',
              color: isAnyConnected ? 'white' : 'var(--color-gray-400)',
              cursor: isAnyConnected ? 'pointer' : 'default',
            }}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  )
}
