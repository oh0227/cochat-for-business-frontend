/** 연동 계정(IntegrationAccount) mock 데이터 */

import type { IntegrationAccount } from '@/types'

export const mockIntegrationAccounts: IntegrationAccount[] = [
  {
    id: 'integ-slack-001',
    provider: 'slack',
    workspaceId: 'T0123SLACK',
    workspaceName: 'CoChat 팀 워크스페이스',
    status: 'active',
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'integ-discord-001',
    provider: 'discord',
    workspaceId: 'D0456DISCORD',
    workspaceName: 'CoChat Dev Server',
    status: 'active',
    createdAt: '2026-03-05T00:00:00Z',
  },
  {
    id: 'integ-jira-001',
    provider: 'jira',
    workspaceId: 'cochat.atlassian.net',
    workspaceName: null,
    status: 'inactive',
    createdAt: '2026-03-10T00:00:00Z',
  },
]
