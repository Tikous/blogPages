# Cloudflare Pages 部署指南

## 📋 部署步骤

### 1. 准备工作
- ✅ 代码已推送到 GitHub: https://github.com/Tikous/blogPages
- ✅ 项目已配置为静态导出 (`output: 'export'`)
- ✅ 已创建 `wrangler.toml` 配置文件

### 2. 在 Cloudflare Pages 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 "Pages" 服务
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 连接您的 GitHub 账户
6. 选择 `Tikous/blogPages` 仓库

### 3. 构建配置

在 Cloudflare Pages 设置页面配置以下参数：

```
Framework preset: Next.js
Build command: npm run build
Build output directory: out
Root directory: (留空)
```

### 4. 环境变量设置

在 Cloudflare Pages 的环境变量中设置：

```
NODE_VERSION = 18
NEXT_PUBLIC_API_BASE_URL = https://qtnbpuw8jc.execute-api.ap-southeast-2.amazonaws.com/Prod
```

### 5. 部署

- 点击 "Save and Deploy"
- Cloudflare 会自动从 GitHub 拉取代码并构建
- 构建完成后，您的博客将可通过 Cloudflare 提供的域名访问

## 🔧 技术配置

### Next.js 静态导出配置
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};
```

### 构建脚本
```json
{
  "scripts": {
    "build": "next build",
    "export": "next export"
  }
}
```

## 🌐 API 集成

博客系统集成了 AWS API Gateway，支持：
- ✅ 获取文章列表
- ✅ 获取文章详情  
- ✅ 创建新文章
- ✅ 更新文章
- ✅ 删除文章

API 基础地址：`https://qtnbpuw8jc.execute-api.ap-southeast-2.amazonaws.com/Prod`

## 📱 功能特性

- 🏠 **首页** - 博客文章列表展示
- 📖 **详情页** - 支持 Markdown 渲染和代码高亮
- ✍️ **写博客** - 实时预览编辑器
- 🗑️ **删除功能** - 带确认对话框的安全删除
- 📱 **响应式设计** - 适配各种设备
- 🎨 **现代UI** - 基于 Tailwind CSS 4

## 🚀 部署后验证

部署完成后，访问您的 Cloudflare Pages 域名，验证以下功能：

1. ✅ 首页正常加载并显示文章列表
2. ✅ 点击文章可以正常查看详情
3. ✅ 写博客页面功能正常
4. ✅ 删除功能正常工作
5. ✅ 响应式设计在移动端正常

## 🔗 相关链接

- GitHub 仓库: https://github.com/Tikous/blogPages
- AWS API 文档: 见项目 README.md
- Next.js 静态导出文档: https://nextjs.org/docs/pages/building-your-application/deploying/static-exports 