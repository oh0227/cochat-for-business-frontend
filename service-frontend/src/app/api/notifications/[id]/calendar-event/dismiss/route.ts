// 캘린더 등록 제안 거절 프록시.
// 백엔드: POST /api/v1/notifications/{notification_id}/calendar-event/dismiss

import { NextRequest, NextResponse } from 'next/server'
import { TEMP_USER_ID } from '@/lib/api'
import { readBackendErrorMessage } from '@/lib/backendError'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const res = await fetch(`${BASE_URL}/api/v1/notifications/${id}/calendar-event/dismiss`, {
    method: 'POST',
    headers: { 'X-Cochat-User-Id': String(TEMP_USER_ID) },
  })

  if (!res.ok) {
    const message = await readBackendErrorMessage(res, '캘린더 등록 제안 거절에 실패했습니다.')
    return NextResponse.json({ error: message }, { status: res.status })
  }

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
