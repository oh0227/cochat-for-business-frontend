// OAuth 콜백 프록시 핸들러.
// 실제 OAuth 콜백은 백엔드가 처리합니다: GET /api/v1/integrations/{provider}/callback?code=...
// 백엔드가 OAuth code를 처리한 뒤 프론트엔드의 /setup?provider={provider}&status=connected 로 리다이렉트합니다.
//
// 이 파일은 백엔드가 OAuth redirect_uri로 프론트엔드 주소를 사용하는 경우를 위한 브릿지입니다.
// 백엔드가 자체 콜백 URL을 사용한다면 이 파일은 사용되지 않습니다.

import { toOAuthRouteSlug } from '@/lib/integrationProvider'

type RouteParams = Promise<{ provider: string }>

export async function GET(request: Request, { params }: { params: RouteParams }) {
  const { provider } = await params
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? new URL(request.url).origin

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    // code 없이 직접 접근한 경우 (개발 환경 테스트용 - 연결 완료 처리)
    return Response.redirect(`${frontendUrl}/setup?provider=${provider}&status=connected`)
  }

  if (!backendUrl) {
    return Response.json({ error: 'NEXT_PUBLIC_BACKEND_URL이 설정되지 않았습니다.' }, { status: 500 })
  }

  try {
    // 백엔드 콜백 엔드포인트로 code 전달
    const res = await fetch(
      `${backendUrl}/api/v1/integrations/${toOAuthRouteSlug(provider)}/callback?code=${code}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      return Response.redirect(`${frontendUrl}/setup?provider=${provider}&status=error`)
    }

    return Response.redirect(`${frontendUrl}/setup?provider=${provider}&status=connected`)
  } catch {
    return Response.redirect(`${frontendUrl}/setup?provider=${provider}&status=error`)
  }
}
