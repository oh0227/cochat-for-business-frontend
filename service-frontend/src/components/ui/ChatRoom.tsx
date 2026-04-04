'use client'

import { useState, useRef } from 'react'
import { ArrowLeft, Bell, Hash, MessageSquare, CalendarPlus, Sparkles, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ChannelSummary, ChatMessage, Notification } from '@/types'
import ChatMessageRow from './ChatMessageRow'
import AlertCard from './AlertCard'

const PROVIDER_ICON: Record<string, { iconBg: string; textColor: string; Icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  slack: {
    iconBg: 'rgba(236,86,148,0.1)',
    textColor: '#ec5694',
    Icon: ({ size, color }) => <Hash size={size} color={color ?? '#ec5694'} />,
  },
  discord: {
    iconBg: 'rgba(97,95,255,0.1)',
    textColor: '#6366f1',
    Icon: ({ size, color }) => <MessageSquare size={size} color={color ?? '#6366f1'} />,
  },
}

interface ChatRoomProps {
  channel: ChannelSummary
  messages: ChatMessage[]
  notifications: Notification[]
}

export default function ChatRoom({ channel, messages, notifications }: ChatRoomProps) {
  const router = useRouter()
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null)
  const [showAiDraft, setShowAiDraft] = useState(false)
  const [copied, setCopied] = useState(false)
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const { iconBg, textColor, Icon } = PROVIDER_ICON[channel.provider] ?? PROVIDER_ICON.slack

  // 알림 선택 시 해당 메시지로 스크롤
  function handleSelectNotif(notifId: string) {
    const next = selectedNotifId === notifId ? null : notifId
    setSelectedNotifId(next)
    setShowAiDraft(false)
    if (!next) return

    const linked = messages.find((m) => m.notificationId === notifId)
    if (linked) {
      setTimeout(() => {
        messageRefs.current.get(linked.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
    }
  }

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
    <div
      className="flex overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-gray-80)] bg-white"
      style={{ height: 'calc(100vh - 2 * var(--spacing-lg))' }}
    >
      {/* ── 중앙: 채팅 영역 ── */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* 헤더 */}
        <div
          className="flex shrink-0 items-center gap-3 border-b border-[var(--color-gray-80)] px-5"
          style={{ height: 72, background: '#f8f9ff' }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-[42px] items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
          >
            <ArrowLeft size={24} />
          </button>

          <span
            className="flex items-center justify-center rounded-[10px]"
            style={{ width: 32, height: 32, background: iconBg }}
          >
            <Icon size={18} />
          </span>

          <span
            className="font-medium"
            style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)', color: textColor }}
          >
            {channel.workspaceName} &gt; {channel.channelName}
          </span>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-[170px] py-6">
          <div className="flex flex-col gap-1">
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
              style={{ background: '#6366f1', boxShadow: '-4px 0px 24px 0px rgba(99,102,241,0.12)', fontSize: 'var(--font-size-2xs)' }}
            >
              복사되었습니다.
            </div>
          </div>
        )}

        {/* 후속 액션 바 (알림 선택 시 표시) */}
        {selectedNotifId && (
          <div
            className="flex shrink-0 items-center justify-between border-t border-[var(--color-gray-80)] px-10 py-4"
            style={{ boxShadow: '0px -4px 24px 0px rgba(99,102,241,0.12)' }}
          >
            <span
              className="font-semibold text-[var(--color-gray-700)]"
              style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
            >
              후속 액션
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-[var(--radius-sm)] px-4 font-medium text-white transition-opacity hover:opacity-80"
                style={{ fontSize: 'var(--font-size-xs)', background: '#2e3237' }}
              >
                <CalendarPlus size={22} />
                일정 등록
              </button>
              <button
                type="button"
                onClick={() => setShowAiDraft(true)}
                className="flex h-10 items-center gap-2 rounded-[var(--radius-sm)] px-4 font-medium text-white transition-opacity hover:opacity-80"
                style={{ fontSize: 'var(--font-size-xs)', background: '#2e3237' }}
              >
                <Sparkles size={22} />
                AI 답장 생성
              </button>
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-[var(--radius-sm)] bg-[rgba(46,50,55,0.08)] px-4 font-medium text-[var(--color-gray-950)] transition-colors hover:bg-[rgba(46,50,55,0.12)]"
                style={{ fontSize: 'var(--font-size-xs)' }}
              >
                <ExternalLink size={22} />
                {channel.provider === 'discord' ? 'Discord에서 보기' : 'Slack에서 보기'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 우측: 알림 패널 ── */}
      <aside className="flex w-[340px] shrink-0 flex-col border-l border-[var(--color-gray-80)]">
        {/* 헤더 */}
        <div
          className="flex shrink-0 items-center gap-3 border-b border-[var(--color-gray-80)] px-5"
          style={{ height: 72 }}
        >
          <span
            className="flex items-center justify-center rounded-[10px]"
            style={{ width: 36, height: 36, background: 'rgba(239,68,68,0.1)' }}
          >
            <Bell size={20} color="#ef4444" />
          </span>
          <span
            className="font-semibold text-[var(--color-gray-900)]"
            style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
          >
            확인 필요한 알림
          </span>
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
