# 个人博客系统

这是一个基于 Next.js 15 的现代化个人博客系统，前端界面来自 selfBlog 项目，后端接口调用 AWS 部署的服务。

## 功能特性

- 📝 **博客管理**: 创建、编辑、发布博客文章
- 🏷️ **标签系统**: 为文章添加标签进行分类
- 📱 **响应式设计**: 支持桌面端和移动端
- 🎨 **Markdown 支持**: 支持 Markdown 语法编写文章
- 🔍 **代码高亮**: 支持多种编程语言的代码高亮
- ⚡ **快速加载**: 基于 Next.js 15 的优化性能

## 技术栈

- **前端框架**: Next.js 15
- **UI 样式**: Tailwind CSS 4
- **图标库**: Lucide React
- **Markdown 渲染**: React Markdown
- **代码高亮**: React Syntax Highlighter
- **HTTP 客户端**: Axios
- **日期处理**: date-fns
- **后端 API**: AWS Lambda (https://qtnbpuw8jc.execute-api.ap-southeast-2.amazonaws.com/Prod)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 http://localhost:3000 启动。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── blog/[id]/         # 博客详情页
│   ├── write/             # 写博客页
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── loading.tsx        # 加载页面
│   └── not-found.tsx      # 404 页面
├── components/            # React 组件
│   ├── BlogCard.tsx       # 博客卡片组件
│   └── Navbar.tsx         # 导航栏组件
└── lib/                   # 工具库
    └── api.ts             # API 服务层
```

## API 接口

项目使用 AWS 部署的后端服务，接口地址：
`https://qtnbpuw8jc.execute-api.ap-southeast-2.amazonaws.com/Prod`

### 主要接口

- `GET /posts` - 获取所有博客文章
- `GET /posts/:id` - 获取单篇博客文章
- `POST /posts` - 创建新博客文章
- `PUT /posts/:id` - 更新博客文章
- `DELETE /posts/:id` - 删除博客文章

## 页面说明

### 首页 (/)
- 显示所有已发布的博客文章
- 网格布局展示博客卡片
- 支持创建新博客的快捷入口

### 博客详情页 (/blog/[id])
- 显示完整的博客文章内容
- 支持 Markdown 渲染和代码高亮
- 显示文章元信息（作者、发布时间、标签等）

### 写博客页 (/write)
- 支持 Markdown 语法编写
- 实时预览功能
- 可设置标题、摘要、标签
- 支持保存草稿或直接发布

## 样式说明

项目使用 Tailwind CSS 4 进行样式管理，包含：
- 响应式设计
- 自定义博客卡片样式
- 表单组件样式
- 按钮样式
- 代码高亮样式

## 开发说明

- 使用 TypeScript 进行类型安全开发
- 遵循 Next.js 13+ App Router 规范
- 支持 Turbopack 快速开发模式
- 集成 ESLint 代码规范检查

## 部署

项目可以部署到任何支持 Next.js 的平台，如：
- Vercel
- Netlify
- AWS
- 自建服务器

确保环境变量配置正确，特别是 API 接口地址。
