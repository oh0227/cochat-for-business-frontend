import SetupClient from './SetupClient'

type Provider = 'slack' | 'discord' | 'jira'
const VALID_PROVIDERS: Provider[] = ['slack', 'discord', 'jira']

interface SetupPageProps {
  searchParams: Promise<{ provider?: string; status?: string }>
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const { provider, status } = await searchParams

  // OAuth 콜백으로 돌아온 경우 해당 provider를 연결 완료 상태로 초기화
  const initialConnected: Provider[] =
    status === 'connected' && provider && (VALID_PROVIDERS as string[]).includes(provider)
      ? [provider as Provider]
      : []

  return <SetupClient initialConnected={initialConnected} />
}
