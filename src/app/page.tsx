import { blogApi } from '@/lib/api'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

// 禁用页面缓存
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPosts() {
  try {
    const posts = await blogApi.getPosts()
    // 只显示已发布的文章
    return posts.filter(post => post.published)
  } catch (error) {
    console.error('获取博客列表失败:', error)
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

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
