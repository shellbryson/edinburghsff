import ReactMarkdown from 'react-markdown'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
