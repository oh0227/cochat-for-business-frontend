// [백엔드 연결] 이 파일은 실제 백엔드가 준비되기 전까지 사용하는 목업 Route Handler입니다.
// 백엔드 API가 완성되면 이 파일을 삭제하고,
// src/app/setup/SetupClient.tsx의 getIntegrationAuthUrl()을 실제 백엔드 엔드포인트로 교체하세요.
//
// ─── 실제 백엔드 연결 시 체크리스트 ───────────────────────────────────────
//
// 1. 이 파일(route.ts) 삭제
//
// 2. SetupClient.tsx > getIntegrationAuthUrl()
//    - fetch URL을 실제 백엔드 엔드포인트로 교체
//      예) '/api/integrations/${provider}/auth' → 'https://api.example.com/integrations/${provider}/oauth/authorize'
//    - 인증이 필요한 경우 Authorization 헤더 추가
//
// 3. 응답 스펙 확인
//    - 현재 가정: { url: string }  ← 사용자를 리다이렉트할 OAuth authorize URL
//    - 백엔드 응답 필드명이 다를 경우 getIntegrationAuthUrl() 내 파싱 로직 수정
//
// 4. callback redirect 경로 확인
//    - 실제 OAuth 완료 후 백엔드는 프론트엔드의 /setup?provider={provider}&status=connected 로 리다이렉트해야 함
//    - 백엔드에 redirect_uri를 전달하거나, 백엔드 측에서 하드코딩 필요
// ────────────────────────────────────────────────────────────────────────────

type RouteParams = Promise<{ provider: string }>

export async function GET(request: Request, { params }: { params: RouteParams }) {
  const { provider } = await params

  // [백엔드 연결] 아래 로직 전체를 삭제하고 실제 백엔드 API를 호출합니다.
  const baseUrl = new URL(request.url).origin
  const mockCallbackUrl = `${baseUrl}/api/integrations/${provider}/callback`

  return Response.json({ url: mockCallbackUrl })
}
