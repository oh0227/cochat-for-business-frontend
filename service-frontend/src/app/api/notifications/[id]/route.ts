import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))

  const res = await fetch(`${BASE_URL}/api/v1/notifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '알림 상태 업데이트에 실패했습니다.')
    return NextResponse.json({ error: text }, { status: res.status })
  }

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data)
}
