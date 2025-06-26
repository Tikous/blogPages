'use client'

import { blogApi } from '@/lib/api'
import { notFound, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
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

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [postId, setPostId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        const resolvedParams = await params
        const id = resolvedParams.id
        setPostId(id)
        
        const postData = await blogApi.getPost(id)
        if (!postData) {
          notFound()
        }
        setPost(postData)
      } catch (error) {
        console.error('获取博客详情失败:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params])

  const handleDelete = async () => {
    if (!post || !postId) return
    
    setDeleting(true)
    try {
      const success = await blogApi.deletePost(postId.toString())
      if (success) {
        // 删除成功，返回首页
        router.push('/')
      } else {
        alert('删除失败，请重试')
      }
    } catch (error) {
      console.error('删除博客失败:', error)
      alert('删除失败，请重试')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
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

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            disabled={deleting}
          >
            <Trash2 size={16} />
            删除文章
          </button>
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
              code({ className, children, ...props }: React.ComponentProps<'code'>) {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
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

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              确认删除文章
            </h3>
            <p className="text-gray-600 mb-6">
              您确定要删除文章 &ldquo;<strong>{post.title}</strong>&rdquo; 吗？此操作无法撤销。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                disabled={deleting}
              >
                {deleting && (
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {deleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 