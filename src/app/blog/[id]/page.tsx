import { blogApi } from '@/lib/api'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import DeleteButton from './DeleteButton'
import React from 'react'

interface Post {
  id: number
  title: string
  content: string
  summary?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
  author?: {
    id: number
    name?: string | null
    email: string
  } | null
  tags: {
    id: number
    name: string
  }[]
}

// 生成静态参数
export async function generateStaticParams() {
  try {
    const posts = await blogApi.getPosts()
    return posts.map((post) => ({
      id: post.id.toString(),
    }))
  } catch (error) {
    console.error('生成静态参数失败:', error)
    // 返回一些默认的 ID 以防 API 不可用
    return [
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
      { id: '5' },
      { id: '6' },
    ]
  }
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = resolvedParams.id
  
  let post: Post | null = null
  
  try {
    post = await blogApi.getPost(id)
  } catch (error) {
    console.error('获取博客详情失败:', error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* 头部操作栏 */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={20} />
            返回博客列表
          </Link>

          <DeleteButton postId={id} />
        </div>

        {/* 博客头部信息 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
              </span>
            </div>
            
            {post.author && (
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author.name || post.author.email}</span>
              </div>
            )}
          </div>

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <Tag size={16} className="text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: { id: number; name: string }) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 摘要 */}
          {post.summary && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-gray-700 leading-relaxed">{post.summary}</p>
            </div>
          )}
        </header>

        {/* 博客内容 */}
        <article className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800" {...props}>
                    {children}
                  </code>
                )
              },
              p: ({ children }) => (
                <p className="text-gray-800 leading-relaxed mb-4">{children}</p>
              ),
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{children}</h3>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 my-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 my-4">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-800">{children}</li>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* 底部信息 */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-gray-500 text-sm">
            最后更新于 {format(new Date(post.updatedAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
          </div>
        </footer>
      </div>
    </>
  )
} 