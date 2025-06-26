import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          页面未找到
        </h2>
        <p className="text-gray-500 mb-8">
          抱歉，您访问的页面不存在或已被删除。
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home size={20} />
          返回首页
        </Link>
      </div>
    </div>
  )
} 