import SetupClient from './SetupClient'

type Provider = 'slack' | 'discord' | 'jira'
const VALID_PROVIDERS: Provider[] = ['slack', 'discord', 'jira']

interface SetupPageProps {
  searchParams: Promise<{ provider?: string; status?: string }>
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const { provider, status } = await searchParams

  const initialConnected: Provider[] =
    status === 'connected' && provider && (VALID_PROVIDERS as string[]).includes(provider)
      ? [provider as Provider]
      : []

  const initialError =
    status === 'error' && provider
      ? `${provider} 연동 중 오류가 발생했습니다. 다시 시도해주세요.`
      : null

  return <SetupClient initialConnected={initialConnected} initialError={initialError} />
}
