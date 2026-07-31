'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Bell, Sparkles, ExternalLink, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ChannelSummary, ChatMessage, Notification } from '@/types'
import ChatMessageRow from './ChatMessageRow'
import AlertCard from './AlertCard'
import CalendarEventAction from './CalendarEventAction'
import { PROVIDER_ICON_META } from '@/components/icons/ProviderIcon'

const PROVIDER_ICON: Record<string, { iconBg: string; textColor: string; Icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  slack: { iconBg: PROVIDER_ICON_META.slack.bg, textColor: PROVIDER_ICON_META.slack.color, Icon: PROVIDER_ICON_META.slack.Icon },
  discord: { iconBg: PROVIDER_ICON_META.discord.bg, textColor: PROVIDER_ICON_META.discord.color, Icon: PROVIDER_ICON_META.discord.Icon },
}

interface ChatRoomProps {
  channel: ChannelSummary
  messages: ChatMessage[]
  notifications: Notification[]
}

export default function ChatRoom({ channel, messages, notifications }: ChatRoomProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null)
  const [showAiDraft, setShowAiDraft] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isAlertsOpen, setAlertsOpen] = useState(false)
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const { iconBg, textColor, Icon } = PROVIDER_ICON[channel.provider ?? 'slack'] ?? PROVIDER_ICON.slack

  // 알림 선택 시 해당 메시지로 스크롤 + 읽음 처리
  function handleSelectNotif(notifId: string) {
    const next = selectedNotifId === notifId ? null : notifId
    setSelectedNotifId(next)
    setShowAiDraft(false)
    if (!next) return

    // 모바일/태블릿 드로어가 열려 있으면 닫아서 스크롤된 메시지가 보이게 한다
    setAlertsOpen(false)

    // 읽음 상태로 업데이트 (fire-and-forget)
    fetch(`/api/notifications/${notifId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read' }),
    }).catch(() => {/* 무시 */})

    const linked = messages.find((m) => m.notificationId === notifId)
    if (linked) {
      setTimeout(() => {
        messageRefs.current.get(linked.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
    }
  }

  // 브리핑 등 다른 화면에서 ?notif= 로 특정 메시지를 지정해 들어온 경우 자동으로 선택 + 스크롤
  useEffect(() => {
    const notifId = searchParams.get('notif')
    if (notifId) handleSelectNotif(notifId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedMessage = selectedNotifId
    ? messages.find((m) => m.notificationId === selectedNotifId)
    : null

  const selectedNotif = selectedNotifId
    ? notifications.find((n) => n.id === selectedNotifId)
    : null

  // 선택된 알림 요약을 기반으로 AI 답장 초안 생성 (목업)
  const aiDraftText = selectedNotif
    ? `${selectedNotif.summary.slice(0, 20)}... 확인했습니다. 검토 후 빠르게 처리하겠습니다.`
    : null

  function handleCopyDraft() {
    if (!aiDraftText) return
    navigator.clipboard.writeText(aiDraftText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative flex h-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)]">
      {/* ── 중앙: 채팅 영역 ── */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* 헤더 */}
        <div
          className="flex shrink-0 items-center gap-3 border-b border-[var(--color-gray-80)] px-3 sm:px-5"
          style={{ height: 72, background: 'var(--color-brand-20)' }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-[42px] shrink-0 items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
          >
            <ArrowLeft size={24} />
          </button>

          <span
            className="flex shrink-0 items-center justify-center rounded-[10px]"
            style={{ width: 32, height: 32, background: iconBg }}
          >
            <Icon size={18} />
          </span>

          <span
            className="min-w-0 flex-1 truncate font-medium"
            style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)', color: textColor }}
          >
            {channel.workspaceName} &gt; {channel.channelName}
          </span>

          {/* 알림 패널 토글 (모바일/태블릿 전용) */}
          <button
            type="button"
            onClick={() => setAlertsOpen(true)}
            aria-label="확인 필요한 알림 열기"
            className="relative flex size-[42px] shrink-0 items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)] lg:hidden"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute right-1 top-1 flex size-[8px] rounded-full bg-[var(--color-urgent-500)]" />
            )}
          </button>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 md:px-12">
          <div className="mx-auto flex max-w-[760px] flex-col gap-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                ref={(el) => {
                  if (el) messageRefs.current.set(msg.id, el)
                  else messageRefs.current.delete(msg.id)
                }}
              >
                <ChatMessageRow
                  message={msg}
                  isSelected={selectedMessage?.id === msg.id}
                  aiDraft={selectedMessage?.id === msg.id && showAiDraft && aiDraftText ? aiDraftText : undefined}
                  provider={channel.provider}
                  onCopy={handleCopyDraft}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 복사 토스트 */}
        {copied && (
          <div className="pointer-events-none absolute bottom-[96px] left-10 z-10">
            <div
              className="flex h-[38px] items-center rounded-[4px] px-4 text-white"
              style={{ background: 'var(--color-brand-500)', boxShadow: '-4px 0px 24px 0px rgba(99,102,241,0.12)', fontSize: 'var(--font-size-2xs)' }}
            >
              복사되었습니다.
            </div>
          </div>
        )}

        {/* 후속 액션 바 (알림 선택 시 표시) */}
        {selectedNotifId && (
          <div
            className="flex shrink-0 flex-col gap-3 border-t border-[var(--color-gray-80)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-4"
            style={{ boxShadow: '0px -4px 24px 0px rgba(99,102,241,0.12)' }}
          >
            <span
              className="font-semibold text-[var(--color-gray-700)]"
              style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
            >
              후속 액션
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {selectedNotif && (
                <CalendarEventAction
                  notificationId={selectedNotif.id}
                  isScheduleRelated={selectedNotif.isScheduleRelated}
                  calendarStatus={selectedNotif.calendarStatus}
                  calendarEventUrl={selectedNotif.calendarEventUrl}
                  createdAt={selectedNotif.createdAt}
                  suggestedStartTime={selectedNotif.suggestedStartTime}
                  suggestedDurationMinutes={selectedNotif.suggestedDurationMinutes}
                  calendarEventStartTime={selectedNotif.calendarEventStartTime}
                  calendarEventEndTime={selectedNotif.calendarEventEndTime}
                  size="lg"
                />
              )}
              <button
                type="button"
                onClick={() => setShowAiDraft(true)}
                className="flex h-10 items-center gap-2 rounded-[var(--radius-sm)] px-4 font-medium text-white transition-opacity hover:opacity-80"
                style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-gray-inverse)' }}
              >
                <Sparkles size={22} />
                AI 답장 생성
              </button>
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-gray-50)] px-4 font-medium text-[var(--color-gray-950)] transition-colors hover:bg-[var(--color-gray-80)]"
                style={{ fontSize: 'var(--font-size-xs)' }}
              >
                <ExternalLink size={22} />
                {channel.provider === 'discord' ? 'Discord에서 보기' : 'Slack에서 보기'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 모바일/태블릿: 알림 패널 오버레이 */}
      {isAlertsOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setAlertsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── 우측: 알림 패널 ── */}
      <aside
        className={[
          'absolute inset-y-0 right-0 z-50 flex w-[85vw] max-w-[340px] shrink-0 flex-col border-l border-[var(--color-gray-80)] bg-[var(--color-gray-default)]',
          'transition-transform duration-200 ease-out',
          isAlertsOpen ? 'translate-x-0' : 'translate-x-full',
          'lg:static lg:z-auto lg:w-[340px] lg:translate-x-0',
        ].join(' ')}
      >
        {/* 헤더 */}
        <div
          className="flex shrink-0 items-center gap-3 border-b border-[var(--color-gray-80)] px-5"
          style={{ height: 72 }}
        >
          <span
            className="flex shrink-0 items-center justify-center rounded-[10px]"
            style={{ width: 36, height: 36, background: 'rgba(239,68,68,0.1)' }}
          >
            <Bell size={20} className="text-[var(--color-urgent-500)]" />
          </span>
          <span
            className="flex-1 truncate font-semibold text-[var(--color-gray-900)]"
            style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
          >
            확인 필요한 알림
          </span>
          <button
            type="button"
            onClick={() => setAlertsOpen(false)}
            aria-label="알림 패널 닫기"
            className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* 알림 목록 */}
        <div className="flex flex-col gap-3 overflow-y-auto p-5">
          {notifications.length === 0 ? (
            <p className="text-[var(--color-gray-400)]" style={{ fontSize: 'var(--font-size-3xs)' }}>
              확인 필요한 알림이 없습니다.
            </p>
          ) : (
            notifications.map((notif) => (
              <AlertCard
                key={notif.id}
                notification={notif}
                isSelected={selectedNotifId === notif.id}
                onSelect={() => handleSelectNotif(notif.id)}
              />
            ))
          )}
        </div>
      </aside>
    </div>
  )
}
