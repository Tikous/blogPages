import axios from 'axios'

const API_BASE_URL = 'https://qtnbpuw8jc.execute-api.ap-southeast-2.amazonaws.com/Prod'

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 博客文章类型定义
export interface Post {
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

// API 服务
export const blogApi = {
  // 获取所有博客文章
  async getPosts(): Promise<Post[]> {
    try {
      const response = await api.get('/posts')
      return response.data
    } catch (error) {
      console.error('获取博客列表失败:', error)
      return []
    }
  },

  // 根据 ID 获取单篇博客文章
  async getPost(id: string): Promise<Post | null> {
    try {
      const response = await api.get(`/posts/${id}`)
      return response.data
    } catch (error) {
      console.error('获取博客详情失败:', error)
      return null
    }
  },

  // 创建新的博客文章
  async createPost(data: {
    title: string
    content: string
    summary?: string
    tags?: string[]
    published?: boolean
  }): Promise<Post | null> {
    try {
      const response = await api.post('/posts', data)
      return response.data
    } catch (error) {
      console.error('创建博客失败:', error)
      throw error
    }
  },

  // 更新博客文章
  async updatePost(id: string, data: {
    title?: string
    content?: string
    summary?: string
    tags?: string[]
    published?: boolean
  }): Promise<Post | null> {
    try {
      const response = await api.put(`/posts/${id}`, data)
      return response.data
    } catch (error) {
      console.error('更新博客失败:', error)
      throw error
    }
  },

  // 删除博客文章
  async deletePost(id: string): Promise<boolean> {
    try {
      await api.delete(`/posts/${id}`)
      return true
    } catch (error) {
      console.error('删除博客失败:', error)
      return false
    }
  }
}