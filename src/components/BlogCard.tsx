import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar, User } from 'lucide-react'
import { Post } from '@/lib/api'

interface BlogCardProps {
  post: Post
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.id}`}>
      <article className="blog-card p-6 h-full flex flex-col">
        {/* 标题 */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h2>

        {/* 摘要 */}
        {post.summary && (
          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
            {post.summary}
          </p>
        )}

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                {format(new Date(post.createdAt), 'MM月dd日', { locale: zhCN })}
              </span>
            </div>
            
            {post.author && (
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{post.author.name || '博主'}</span>
              </div>
            )}
          </div>

          {!post.published && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              草稿
            </span>
          )}
        </div>
      </article>
    </Link>
  )
} 