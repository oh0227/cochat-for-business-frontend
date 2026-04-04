'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Hash, MessageSquare, Check, Loader2 } from 'lucide-react'

type Provider = 'slack' | 'discord' | 'jira'

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
}

export default function SetupClient({ initialConnected }: SetupClientProps) {
  const router = useRouter()

  // useReducer 대신 간단하게 각 상태를 Set으로
  const [connected, setConnected] = useState<Set<Provider>>(() => new Set(initialConnected))
  const [loading, setLoading] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isAnyConnected = connected.size > 0

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
    <div className="flex min-h-screen flex-col bg-white">
      {/* 본문 */}
      <div className="flex flex-1 flex-col items-center px-[460px] pt-[170px]">
        <div className="flex w-full flex-col items-start gap-14">
          {/* 상단: 로고 + 환영 메시지 */}
          <div className="flex w-full flex-col items-center gap-10">
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
                <br />
                사용자가 온전히 집중할 수 있는 업무 환경을 만듭니다.
              </p>
            </div>
          </div>

          {/* 워크스페이스 연결 섹션 */}
          <div className="flex w-full flex-col items-center gap-4">
            <div className="w-[1000px]">
              <span
                className="font-semibold text-[var(--color-gray-950)]"
                style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
              >
                워크스페이스 연결
              </span>
            </div>

            {/* 연결 카드 3개 */}
            <div className="flex w-[1000px] gap-4">
              {PROVIDERS.map(({ id, name, description, iconBg, Icon, iconColor }) => {
                const isConnected = connected.has(id)
                const isLoading = loading === id

                return (
                  <div
                    key={id}
                    className="relative flex flex-1 flex-col justify-between rounded-[20px] p-6"
                    style={{
                      height: 250,
                      border: `${isConnected ? '1.5px' : '1px'} solid ${isConnected ? '#8285f4' : '#dfe3e5'}`,
                    }}
                  >
                    {/* 연결 완료 배지 (우상단) */}
                    {isConnected && (
                      <div
                        className="absolute right-[14px] top-[14px] flex size-6 items-center justify-center rounded-full"
                        style={{ background: '#6366f1' }}
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
                          <div className="flex items-center gap-1">
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
                              style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)', color: '#5a5ddb' }}
                            >
                              연동 1개
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
                      style={{ fontSize: 'var(--font-size-xs)', background: '#2e3237' }}
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
                style={{ fontSize: 'var(--font-size-3xs)', color: '#ef4444' }}
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 하단 바 */}
      <div
        className="flex shrink-0 items-center justify-end px-[460px]"
        style={{ height: 128, borderTop: '1px solid #e2e8f0' }}
      >
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          disabled={!isAnyConnected}
          className="flex h-12 w-[130px] items-center justify-center rounded-[12px] font-medium transition-colors"
          style={{
            fontSize: 'var(--font-size-xs)',
            background: isAnyConnected ? '#6366f1' : '#f0f2f3',
            color: isAnyConnected ? 'white' : '#8a939b',
            cursor: isAnyConnected ? 'pointer' : 'default',
          }}
        >
          시작하기
        </button>
      </div>
    </div>
  )
}
