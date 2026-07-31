'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, TriangleAlert } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import NotificationPermissionButton from '@/components/ui/NotificationPermissionButton'
import { TEMP_USER_ID } from '@/lib/api'
import { PROVIDER_ICON_META, type ProviderKey } from '@/components/icons/ProviderIcon'

type Provider = 'slack' | 'discord' | 'jira' | 'google_calendar'

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
    name: PROVIDER_ICON_META.slack.name,
    iconBg: PROVIDER_ICON_META.slack.bg,
    iconColor: PROVIDER_ICON_META.slack.color,
    Icon: PROVIDER_ICON_META.slack.Icon,
  },
  discord: {
    name: PROVIDER_ICON_META.discord.name,
    iconBg: PROVIDER_ICON_META.discord.bg,
    iconColor: PROVIDER_ICON_META.discord.color,
    Icon: PROVIDER_ICON_META.discord.Icon,
  },
  jira: {
    name: PROVIDER_ICON_META.jira.name,
    iconBg: PROVIDER_ICON_META.jira.bg,
    iconColor: PROVIDER_ICON_META.jira.color,
    Icon: PROVIDER_ICON_META.jira.Icon,
  },
  google_calendar: {
    name: PROVIDER_ICON_META.google_calendar.name,
    iconBg: PROVIDER_ICON_META.google_calendar.bg,
    iconColor: PROVIDER_ICON_META.google_calendar.color,
    Icon: PROVIDER_ICON_META.google_calendar.Icon,
  },
}

interface ProviderEntry {
  key: ProviderKey
  comingSoon: boolean
}

// jira는 아직 실제 연동이 안 되고 "추후지원 예정"으로만 노출됨 (온보딩과 동일)
const MESSENGER_ENTRIES: ProviderEntry[] = [
  { key: 'slack', comingSoon: false },
  { key: 'discord', comingSoon: false },
  { key: 'jira', comingSoon: true },
  { key: 'kakaowork', comingSoon: true },
  { key: 'naverworks', comingSoon: true },
  { key: 'telegram', comingSoon: true },
]
const CALENDAR_ENTRIES: ProviderEntry[] = [
  { key: 'google_calendar', comingSoon: false },
  { key: 'naver_calendar', comingSoon: true },
  { key: 'apple_calendar', comingSoon: true },
]

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
    <div className="flex flex-col gap-6">
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
      <div className="flex flex-col gap-3 rounded-[14px] border border-[var(--color-gray-80)] p-4">
        <span
          className="font-semibold text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
        >
          화면 설정
        </span>
        <ThemeToggle />
      </div>

      {/* 알림 설정 */}
      <div className="flex flex-col gap-3 rounded-[14px] border border-[var(--color-gray-80)] p-4">
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

      {/* 연동 섹션: 메신저 */}
      <div className="flex flex-col gap-2">
        <h2
          className="font-semibold text-[var(--color-gray-900)]"
          style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
        >
          메신저
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MESSENGER_ENTRIES.map(({ key, comingSoon }) => (
            <ProviderSection
              key={key}
              id={key}
              comingSoon={comingSoon}
              accounts={comingSoon ? [] : getProviderAccounts(key as Provider)}
              loading={loading}
              isAdding={!comingSoon && addingProvider === key}
              onAdd={comingSoon ? () => {} : () => handleAdd(key as Provider)}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      </div>

      {/* 연동 섹션: 캘린더 */}
      <div className="flex flex-col gap-2">
        <h2
          className="font-semibold text-[var(--color-gray-900)]"
          style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
        >
          캘린더
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CALENDAR_ENTRIES.map(({ key, comingSoon }) => (
            <ProviderSection
              key={key}
              id={key}
              comingSoon={comingSoon}
              accounts={comingSoon ? [] : getProviderAccounts(key as Provider)}
              loading={loading}
              isAdding={!comingSoon && addingProvider === key}
              onAdd={comingSoon ? () => {} : () => handleAdd(key as Provider)}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
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

/* ─── provider 카드 (연동 가능 / 추후지원 예정 공통) ───────────────────────── */

interface ProviderSectionProps {
  id: ProviderKey
  comingSoon: boolean
  accounts: Integration[]
  loading: boolean
  isAdding: boolean
  onAdd: () => void
  onDelete: (account: Integration) => void
}

function ProviderSection({ id, comingSoon, accounts, loading, isAdding, onAdd, onDelete }: ProviderSectionProps) {
  const { name, bg, color, Icon } = PROVIDER_ICON_META[id]

  return (
    <div
      className="flex flex-col gap-3 rounded-[14px] border border-[var(--color-gray-80)] p-4"
      style={{ opacity: comingSoon ? 0.6 : 1 }}
    >
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex shrink-0 items-center justify-center rounded-[10px]"
            style={{ width: 30, height: 30, background: bg }}
          >
            <Icon size={16} color={color} />
          </span>
          <span
            className="truncate font-semibold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-2xs)' }}
          >
            {name} 연동
          </span>
        </div>

        {/* title은 disabled 버튼 자체보다 감싸는 span에 둬야 일부 브라우저에서도 호버 툴팁이 항상 뜬다 */}
        <span title={comingSoon ? '추후 지원 예정입니다.' : undefined}>
          <button
            type="button"
            onClick={onAdd}
            disabled={comingSoon || isAdding}
            aria-label="연동 추가하기"
            className="flex size-8 shrink-0 items-center justify-center rounded-[10px] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:hover:opacity-100"
            style={{ background: comingSoon ? 'var(--color-gray-50)' : 'var(--color-gray-inverse)' }}
          >
            <Plus size={16} className={comingSoon ? 'text-[var(--color-gray-400)]' : 'text-white'} />
          </button>
        </span>
      </div>

      {/* 연동 목록 (워크스페이스/서버/사이트 등, provider마다 부르는 이름은 달라도 개념은 동일) */}
      {!comingSoon && !loading && accounts.length > 0 && (
        <div className="flex flex-col gap-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex h-[46px] items-center justify-between gap-3 rounded-[10px] border border-[var(--color-gray-80)] px-3"
            >
              <span
                className="min-w-0 truncate font-semibold text-[var(--color-gray-950)]"
                style={{ fontSize: 'var(--font-size-4xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                {account.identifier}
              </span>
              <button
                type="button"
                onClick={() => onDelete(account)}
                className="flex size-7 items-center justify-center rounded-[8px] transition-colors hover:bg-[rgba(239,68,68,0.08)]"
              >
                <Trash2 size={15} className="text-[var(--color-urgent-500)]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
