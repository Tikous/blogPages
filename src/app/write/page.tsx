'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { blogApi } from '@/lib/api'

export default function WriteBlog() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState('')
  const [published, setPublished] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const post = await blogApi.createPost({
        title,
        content,
        summary,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published,
      })

      if (post) {
        // 发布成功，直接回到首页
        router.push('/')
        // 延迟刷新以确保首页显示最新博客列表
        setTimeout(() => {
          window.location.href = '/'
        }, 200)
      }
    } catch (error) {
      console.error('发布博客失败:', error)
      alert('发布失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 头部 */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          返回首页
        </Link>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="btn-secondary flex items-center gap-2"
          >
            <Eye size={20} />
            {isPreview ? '编辑' : '预览'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 编辑区域 */}
        <div className={`${isPreview ? 'hidden lg:block' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                标题 *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="输入博客标题..."
                required
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                摘要
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="form-input h-24 resize-none"
                placeholder="简短描述这篇博客的内容..."
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="form-input"
                placeholder="用逗号分隔多个标签，如：技术,前端,React"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                内容 * (支持 Markdown)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-textarea"
                placeholder="开始写你的博客内容... 支持 Markdown 语法"
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">立即发布</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                {isSubmitting ? '发布中...' : (published ? '发布博客' : '保存草稿')}
              </button>
            </div>
          </form>
        </div>

        {/* 预览区域 */}
        <div className={`${!isPreview ? 'hidden lg:block' : ''}`}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">预览</h2>
            
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            )}
            
            {summary && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-gray-700">{summary}</p>
              </div>
            )}
            
            {tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            
            {content && (
              <div className="prose max-w-none">
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
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
            
            {!title && !content && (
              <p className="text-gray-500 text-center py-8">
                开始写作，预览将在这里显示
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 