import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string
}

/** AI 요약(Gemini 마크다운 출력)을 서식 있는 텍스트로 렌더링 */
export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div
      className="flex flex-col gap-[var(--spacing-2xs)] text-[var(--color-gray-900)]"
      style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <p className="font-semibold text-[var(--color-gray-950)]" style={{ fontSize: 'var(--font-size-xs)' }}>{children}</p>,
          h2: ({ children }) => <p className="font-semibold text-[var(--color-gray-950)]" style={{ fontSize: 'var(--font-size-xs)' }}>{children}</p>,
          h3: ({ children }) => <p className="font-semibold text-[var(--color-gray-950)]">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-[var(--color-gray-950)]">{children}</strong>,
          ul: ({ children }) => <ul className="flex flex-col gap-[var(--spacing-4xs)] pl-[var(--spacing-sm)] list-disc">{children}</ul>,
          ol: ({ children }) => <ol className="flex flex-col gap-[var(--spacing-4xs)] pl-[var(--spacing-sm)] list-decimal">{children}</ol>,
          hr: () => <hr className="border-[var(--color-gray-80)]" />,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-500)] underline">
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded-[var(--radius-3xs)] bg-[var(--color-gray-50)] px-[var(--spacing-4xs)]" style={{ fontSize: 'var(--font-size-5xs)' }}>
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
