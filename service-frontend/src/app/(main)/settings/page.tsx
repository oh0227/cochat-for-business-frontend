'use client'

import { useState, useEffect } from 'react'
import { Hash, MessageSquare, Plus, Trash2 } from 'lucide-react'

type Provider = 'slack' | 'discord' | 'jira'

interface Integration {
  id: string
  provider: Provider
  identifier: string // email or workspace name
}

const PROVIDER_CONFIG: Record<
  Provider,
  { name: string; iconBg: string; iconColor: string; Icon: React.ComponentType<{ size?: number; color?: string }> }
> = {
  slack: {
    name: 'Slack',
    iconBg: 'rgba(236,86,148,0.1)',
    iconColor: '#ec5694',
    Icon: Hash,
  },
  discord: {
    name: 'Discord',
    iconBg: 'rgba(97,95,255,0.1)',
    iconColor: '#615fff',
    Icon: MessageSquare,
  },
  jira: {
    name: 'Jira',
    iconBg: 'rgba(44,79,251,0.1)',
    iconColor: '#2c4ffb',
    Icon: Hash,
  },
}

const PROVIDERS: Provider[] = ['slack', 'discord', 'jira']

// [백엔드 연결] GET /api/v1/integrations 호출로 교체
// 현재는 빈 배열 반환 (백엔드 응답: { integrations: [] })
async function fetchIntegrations(): Promise<Integration[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/integrations`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json() as { integrations: Integration[] }
    return data.integrations ?? []
  } catch {
    return []
  }
}

// [백엔드 연결] DELETE /api/v1/integrations/{id} 로 교체
async function deleteIntegration(id: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/integrations/${id}`,
      { method: 'DELETE' }
    )
    return res.ok
  } catch {
    return false
  }
}

async function getOAuthUrl(provider: Provider): Promise<string | null> {
  try {
    const res = await fetch(`/api/integrations/${provider}/auth`)
    if (!res.ok) return null
    const data = await res.json() as { url: string }
    return data.url || null
  } catch {
    return null
  }
}

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [addingProvider, setAddingProvider] = useState<Provider | null>(null)

  useEffect(() => {
    fetchIntegrations().then((data) => {
      setIntegrations(data)
      setLoading(false)
    })
  }, [])

  function getProviderAccounts(provider: Provider) {
    return integrations.filter((i) => i.provider === provider)
  }

  async function handleAdd(provider: Provider) {
    setAddingProvider(provider)
    const url = await getOAuthUrl(provider)
    if (url) {
      window.location.href = url
    } else {
      setAddingProvider(null)
    }
  }

  async function handleDelete(id: string) {
    const ok = await deleteIntegration(id)
    if (ok) {
      setIntegrations((prev) => prev.filter((i) => i.id !== id))
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* 헤더 */}
      <div className="flex flex-col gap-1">
        <h1
          className="font-bold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-2xl)', lineHeight: 'var(--line-height-3xl)' }}
        >
          설정
        </h1>
        <p
          className="text-[var(--color-gray-700)]"
          style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
        >
          CoChat 계정 및 환경 설정을 관리하세요.
        </p>
      </div>

      {/* 연동 섹션 목록 */}
      <div className="flex flex-col gap-4">
        {PROVIDERS.map((provider) => {
          const { name, iconBg, iconColor, Icon } = PROVIDER_CONFIG[provider]
          const accounts = getProviderAccounts(provider)
          const isAdding = addingProvider === provider

          return (
            <div
              key={provider}
              className="flex flex-col gap-6 rounded-[14px] border border-[var(--color-gray-80)] p-[21px]"
            >
              {/* 섹션 헤더 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className="flex items-center justify-center rounded-[10px]"
                    style={{ width: 36, height: 36, background: iconBg }}
                  >
                    <Icon size={20} color={iconColor} />
                  </span>
                  <span
                    className="font-semibold text-[var(--color-gray-950)]"
                    style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
                  >
                    {name} 연결된 계정
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(provider)}
                  disabled={isAdding}
                  className="flex h-9 items-center gap-2 rounded-[12px] px-3 font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
                  style={{ fontSize: 'var(--font-size-3xs)', background: '#2e3237' }}
                >
                  <Plus size={18} />
                  계정 추가하기
                </button>
              </div>

              {/* 계정 목록 */}
              {!loading && accounts.length > 0 && (
                <div className="flex flex-col gap-3">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex h-[72px] items-center justify-between rounded-[10px] border border-[var(--color-gray-80)] px-[17px]"
                    >
                      <span
                        className="font-semibold text-[var(--color-gray-950)]"
                        style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
                      >
                        {account.identifier}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(account.id)}
                        className="flex size-8 items-center justify-center rounded-[10px] transition-colors hover:bg-[rgba(239,68,68,0.08)]"
                      >
                        <Trash2 size={18} color="#ef4444" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
