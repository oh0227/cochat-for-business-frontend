'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Hash, MessageSquare, CheckCircle } from 'lucide-react'

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

export default function SetupPage() {
  const router = useRouter()
  const [connected, setConnected] = useState<Set<Provider>>(new Set())

  function toggleConnect(provider: Provider) {
    setConnected((prev) => {
      const next = new Set(prev)
      if (next.has(provider)) next.delete(provider)
      else next.add(provider)
      return next
    })
  }

  const isAnyConnected = connected.size > 0

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 본문 */}
      <div className="flex flex-1 flex-col items-center px-[460px] pt-[170px]">
        <div className="flex w-full flex-col gap-14 items-start">
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
                return (
                  <div
                    key={id}
                    className="flex flex-1 flex-col justify-between rounded-[20px] border p-6"
                    style={{
                      height: 250,
                      borderColor: isConnected ? iconColor : '#dfe3e5',
                      borderWidth: isConnected ? 1.5 : 1,
                    }}
                  >
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
                              {isConnected ? '연결됨' : '연결하기'}
                            </span>
                          </div>
                          <p
                            className="text-[var(--color-gray-700)]"
                            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                          >
                            {description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 하단: 버튼 */}
                    <button
                      type="button"
                      onClick={() => toggleConnect(id)}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] font-medium text-white transition-opacity hover:opacity-80"
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        background: isConnected ? iconColor : '#2e3237',
                      }}
                    >
                      {isConnected && <CheckCircle size={18} />}
                      {isConnected ? '연결 완료' : '연결하기'}
                    </button>
                  </div>
                )
              })}
            </div>
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
            background: isAnyConnected ? '#2e3237' : '#f0f2f3',
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
