export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-[var(--spacing-xs)]">
      <h1
        className="font-semibold text-[var(--color-gray-950)]"
        style={{ fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-lg)' }}
      >
        알림 현황
      </h1>
      <p
        className="text-[var(--color-gray-400)]"
        style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
      >
        오늘의 업무 현황을 확인하세요
      </p>
    </div>
  )
}
