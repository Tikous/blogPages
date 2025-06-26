import { blogApi } from '@/lib/api'
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

// 生成静态参数 - 为真实博客 + 合理的新博客范围生成页面
export async function generateStaticParams() {
  try {
    const posts = await blogApi.getPosts()
    const existingIds = posts.map((post) => ({
      id: post.id.toString(),
    }))
    
    // 找到最大的现有 ID，并预留一些空间给新博客
    const maxExistingId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0
    const maxPregenId = maxExistingId + 100 // 预留100个新博客的空间
    
    // 为可能的新博客ID预生成页面
    const potentialNewIds = []
    for (let i = maxExistingId + 1; i <= maxPregenId; i++) {
      potentialNewIds.push({ id: i.toString() })
    }
    
    const allIds = [...existingIds, ...potentialNewIds]
    console.log(`预生成 ${allIds.length} 个博客页面 (${existingIds.length} 个现有 + ${potentialNewIds.length} 个预留)`)
    return allIds
  } catch (error) {
    console.error('生成静态参数失败:', error)
    // 如果 API 失败，预生成一个合理范围的 ID
    const fallbackIds = []
    for (let i = 1; i <= 200; i++) {
      fallbackIds.push({ id: i.toString() })
    }
    return fallbackIds
  }
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = resolvedParams.id
  
  let post: Post | null = null
  let error: string | null = null
  
  try {
    post = await blogApi.getPost(id)
  } catch (err) {
    console.error('获取博客详情失败:', err)
    error = '博客不存在或加载失败'
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              {error || '博客不存在'}
            </h2>
            <p className="text-gray-500 mb-6">
              可能是博客已被删除，或者您访问的链接有误。
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: ({ inline, className, children }: any) => {
                const match = /language-(\w+)/.exec(className || '')
                if (!inline && match) {
                  return (
                    <SyntaxHighlighter
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      style={tomorrow as any}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  )
                }
                return (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
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
              h4: ({ children }) => (
                <h4 className="text-lg font-bold text-gray-900 mt-3 mb-2">{children}</h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-base font-bold text-gray-900 mt-2 mb-1">{children}</h5>
              ),
              h6: ({ children }) => (
                <h6 className="text-sm font-bold text-gray-900 mt-2 mb-1">{children}</h6>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 text-gray-800">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 text-gray-800">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="mb-1">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a 
                  href={href} 
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-gray-300">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-100">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody>{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr className="border-b border-gray-200">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 text-left font-semibold text-gray-900 border-r border-gray-300 last:border-r-0">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 text-gray-800 border-r border-gray-300 last:border-r-0">
                  {children}
                </td>
              ),
              hr: () => (
                <hr className="my-8 border-t border-gray-300" />
              ),
              img: ({ src, alt }) => (
                <img 
                  src={src} 
                  alt={alt} 
                  className="max-w-full h-auto rounded-lg shadow-md my-4"
                />
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