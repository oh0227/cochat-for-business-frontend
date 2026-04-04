/** 메시지 화면 채널별 목업 데이터 */

import type { ChannelSummary, NotificationSummary } from '@/types'

export const mockChannelSummaries: ChannelSummary[] = [
  {
    id: 'ch-001',
    integrationId: 'integ-slack-001',
    provider: 'slack',
    workspaceName: 'CoChat 팀 워크스페이스',
    channelName: 'finance-team',
    counts: { critical: 0, high: 3, medium: 1, low: 1 },
    latestAt: '2026-04-03T09:30:00Z',
  },
  {
    id: 'ch-002',
    integrationId: 'integ-discord-001',
    provider: 'discord',
    workspaceName: 'CoChat Dev Server',
    channelName: 'dev-frontend',
    counts: { critical: 1, high: 3, medium: 0, low: 0 },
    latestAt: '2026-04-03T10:05:00Z',
  },
  {
    id: 'ch-003',
    integrationId: 'integ-slack-001',
    provider: 'slack',
    workspaceName: 'CoChat 팀 워크스페이스',
    channelName: 'announcements',
    counts: { critical: 0, high: 0, medium: 0, low: 1 },
    latestAt: '2026-04-02T12:00:00Z',
  },
  {
    id: 'ch-004',
    integrationId: 'integ-slack-001',
    provider: 'slack',
    workspaceName: 'CoChat 팀 워크스페이스',
    channelName: 'general',
    counts: { critical: 0, high: 3, medium: 1, low: 0 },
    latestAt: '2026-04-03T11:00:00Z',
  },
  {
    id: 'ch-005',
    integrationId: 'integ-discord-001',
    provider: 'discord',
    workspaceName: 'CoChat Dev Server',
    channelName: 'team-event',
    counts: { critical: 1, high: 0, medium: 0, low: 0 },
    latestAt: '2026-04-03T09:45:00Z',
  },
]

export const mockMessageSummary: NotificationSummary = {
  critical: 2,
  high: 3,
  medium: 1,
  low: 3,
  total: 9,
}
