import { notFound } from 'next/navigation'
import {
  mockChannelSummaries,
  mockChatMessages,
  mockChatRoomNotificationIds,
  mockNotifications,
} from '@/mocks'
import ChatRoom from '@/components/ui/ChatRoom'

interface ChatRoomPageProps {
  params: Promise<{ channelId: string }>
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { channelId } = await params

  const channel = mockChannelSummaries.find((c) => c.id === channelId)
  if (!channel) notFound()

  const messages = mockChatMessages[channelId] ?? []
  const notifIds = mockChatRoomNotificationIds[channelId] ?? []
  const notifications = mockNotifications.filter((n) => notifIds.includes(n.id))

  return (
    <ChatRoom
      channel={channel}
      messages={messages}
      notifications={notifications}
    />
  )
}
