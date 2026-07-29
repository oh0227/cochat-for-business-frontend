'use client'

import { useState, useEffect } from 'react'
import { Hash, MessageSquare, Plus, Trash2, TriangleAlert } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import NotificationPermissionButton from '@/components/ui/NotificationPermissionButton'
import { TEMP_USER_ID } from '@/lib/api'

type Provider = 'slack' | 'discord' | 'jira'

interface Integration {
  id: string
  provider: Provider
  identifier: string // email or workspace name
}

// 백엔드 GET /api/v1/integrations 원본 응답 (스네이크 케이스)
interface BackendIntegration {
  provider: string
  integration_id: number
  account_identifier: string
  account_name: string | null
  status: string
}

function toIntegration(raw: BackendIntegration): Integration {
  return {
    id: String(raw.integration_id),
    provider: raw.provider as Provider,
    identifier: raw.account_name || raw.account_identifier,
  }
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

async function fetchIntegrations(): Promise<Integration[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/integrations`,
      { headers: { 'X-Cochat-User-Id': String(TEMP_USER_ID) }, cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json() as { integrations?: BackendIntegration[] }
    return (data.integrations ?? []).map(toIntegration)
  } catch {
    return []
  }
}

async function deleteIntegration(id: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/integrations/${id}`,
      { method: 'DELETE', headers: { 'X-Cochat-User-Id': String(TEMP_USER_ID) } }
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
  const [deleteTarget, setDeleteTarget] = useState<Integration | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const ok = await deleteIntegration(deleteTarget.id)
    if (ok) {
      setIntegrations((prev) => prev.filter((i) => i.id !== deleteTarget.id))
    }
    setDeleting(false)
    setDeleteTarget(null)
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

      {/* 화면 설정 */}
      <div className="flex flex-col gap-4 rounded-[14px] border border-[var(--color-gray-80)] p-[21px]">
        <span
          className="font-semibold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
        >
          화면 설정
        </span>
        <ThemeToggle />
      </div>

      {/* 알림 설정 */}
      <div className="flex flex-col gap-4 rounded-[14px] border border-[var(--color-gray-80)] p-[21px]">
        <div className="flex flex-col gap-1">
          <span
            className="font-semibold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
          >
            알림
          </span>
          <p
            className="text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            탭을 보고 있지 않을 때도 새 메시지를 데스크톱 알림으로 받아보세요.
          </p>
        </div>
        <NotificationPermissionButton />
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className="flex shrink-0 items-center justify-center rounded-[10px]"
                    style={{ width: 36, height: 36, background: iconBg }}
                  >
                    <Icon size={20} color={iconColor} />
                  </span>
                  <span
                    className="truncate font-semibold text-[var(--color-gray-950)]"
                    style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
                  >
                    {name} 연결된 계정
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(provider)}
                  disabled={isAdding}
                  className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-[12px] px-3 font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
                  style={{ fontSize: 'var(--font-size-3xs)', background: 'var(--color-gray-inverse)' }}
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
                      className="flex h-[72px] items-center justify-between gap-3 rounded-[10px] border border-[var(--color-gray-80)] px-[17px]"
                    >
                      <span
                        className="min-w-0 truncate font-semibold text-[var(--color-gray-950)]"
                        style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
                      >
                        {account.identifier}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(account)}
                        className="flex size-8 items-center justify-center rounded-[10px] transition-colors hover:bg-[rgba(239,68,68,0.08)]"
                      >
                        <Trash2 size={18} className="text-[var(--color-urgent-500)]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      {deleteTarget && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="flex w-full max-w-[380px] flex-col gap-5 rounded-[16px] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] p-6">
              <div className="flex items-start gap-3">
                <span
                  className="flex shrink-0 items-center justify-center rounded-full"
                  style={{ width: 36, height: 36, background: 'rgba(239,68,68,0.1)' }}
                >
                  <TriangleAlert size={18} className="text-[var(--color-urgent-500)]" />
                </span>
                <div className="flex flex-col gap-1">
                  <span
                    className="font-semibold text-[var(--color-gray-950)]"
                    style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
                  >
                    연동을 삭제할까요?
                  </span>
                  <p
                    className="text-[var(--color-gray-700)]"
                    style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                  >
                    {PROVIDER_CONFIG[deleteTarget.provider].name}의 &quot;{deleteTarget.identifier}&quot; 연동이 삭제되고, 되돌릴 수 없습니다.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex h-10 items-center justify-center rounded-[10px] border border-[var(--color-gray-80)] px-4 font-medium text-[var(--color-gray-950)] transition-opacity hover:opacity-80 disabled:opacity-60"
                  style={{ fontSize: 'var(--font-size-xs)' }}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex h-10 items-center justify-center rounded-[10px] px-4 font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-60"
                  style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-urgent-500)' }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
