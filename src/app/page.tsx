'use client'

import { useState, useEffect } from 'react'
import { blogApi } from '@/lib/api'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const allPosts = await blogApi.getPosts()
      // 只显示已发布的文章
      const publishedPosts = allPosts.filter(post => post.published)
      setPosts(publishedPosts)
      setError(null)
    } catch (err) {
      console.error('获取博客列表失败:', err)
      setError('加载博客列表失败')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center py-16">
          <div className="text-lg text-gray-600">加载中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              {error}
            </h2>
            <button 
              onClick={fetchPosts}
              className="btn-primary"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">我的博客</h1>
          <p className="text-lg text-gray-600">分享技术心得与生活感悟</p>
        </div>
        <Link
          href="/write"
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle size={20} />
          写博客
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            还没有博客文章
          </h2>
          <p className="text-gray-500 mb-8">
            开始写你的第一篇博客吧！
          </p>
          <Link href="/write" className="btn-primary">
            写第一篇博客
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
