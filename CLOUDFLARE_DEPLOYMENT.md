# Cloudflare Pages 部署指南

本项目可以部署到 Cloudflare Pages，利用其全球 CDN 网络提供快速的静态网站托管。

## 前置要求

1. Cloudflare 账户
2. GitHub 仓库（推荐）或本地项目
3. Node.js 18+ 环境

## 方法一：通过 Cloudflare 控制台部署（推荐）

### 1. 连接 GitHub 仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 "Pages" 部分
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 授权 Cloudflare 访问你的 GitHub 仓库
6. 选择 `blog-of-pages` 仓库

### 2. 配置构建设置

在项目设置页面配置以下构建参数：

- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `npx @cloudflare/next-on-pages@1`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: `/` (项目根目录)

### 3. 环境变量设置

在 "Environment variables" 部分添加：

```
NODE_VERSION = 18
```

### 4. 部署

1. 点击 "Save and Deploy"
2. Cloudflare 将自动从 GitHub 拉取代码并构建
3. 构建完成后，你的网站将在 `https://your-project-name.pages.dev` 可用

## 方法二：使用 Wrangler CLI 部署

### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 构建项目

```bash
npm run build
npx @cloudflare/next-on-pages@1
```

### 4. 部署到 Pages

```bash
wrangler pages deploy .vercel/output/static --project-name blog-pages
```

## 配置文件说明

### wrangler.toml

项目根目录的 `wrangler.toml` 文件包含基本配置：

```toml
name = "blog-pages"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".vercel/output/static"
compatibility_flags = ["nodejs_compat"]
```

**注意**: Pages 项目的构建配置（build command、环境变量等）应该在 Cloudflare 控制台中设置，而不是在 wrangler.toml 文件中。

## 自动部署

一旦通过 GitHub 连接设置了项目，每次推送到主分支时，Cloudflare Pages 都会自动触发新的部署。

## 自定义域名

1. 在 Cloudflare Pages 项目设置中
2. 进入 "Custom domains" 部分
3. 添加你的域名
4. 按照指示更新 DNS 记录

## 故障排除

### 构建失败
- 检查 Node.js 版本是否设置为 18+
- 确认构建命令正确：`npx @cloudflare/next-on-pages@1`
- 检查输出目录：`.vercel/output/static`

### 部署后页面空白
- 确认 Next.js 配置为静态导出模式
- 检查 `next.config.ts` 中的 `output: 'export'` 设置

### API 路由问题
- Cloudflare Pages 不支持 Next.js API 路由
- 确保所有 API 调用指向外部服务（如 AWS Lambda）

## 性能优化

Cloudflare Pages 自动提供：
- 全球 CDN 缓存
- 自动 HTTPS
- HTTP/2 和 HTTP/3 支持
- 图片优化（通过 Cloudflare Images）

## 监控和分析

在 Cloudflare Dashboard 中可以查看：
- 部署历史
- 访问统计
- 性能指标
- 错误日志

## 🔧 技术配置

### Next.js Cloudflare 配置
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
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
- ⚡ **Edge Runtime** - 使用 safe-mdx 支持 Cloudflare Workers
- 🔒 **安全渲染** - 无 eval 执行，安全渲染用户内容

## 🚀 部署后验证

部署完成后，访问您的 Cloudflare Pages 域名，验证以下功能：

1. ✅ 首页正常加载并显示文章列表
2. ✅ 点击文章可以正常查看详情
3. ✅ 写博客页面功能正常
4. ✅ 删除功能正常工作
5. ✅ 响应式设计在移动端正常

## 🔧 故障排除

### Node.js Compatibility Error

如果您看到 "Node.JS Compatibility Error" 错误页面，请确保：

1. ✅ **兼容性标志已设置**：
   - 进入 Cloudflare Pages 项目设置
   - 找到 "Functions" → "Compatibility flags"
   - 添加 `nodejs_compat` 标志
   - 重新部署项目

2. ✅ **wrangler.toml 配置正确**：
   ```toml
   compatibility_flags = ["nodejs_compat"]
   ```

3. ✅ **重新部署**：
   - 设置兼容性标志后，触发重新部署
   - 可以通过推送新代码或手动重新部署

### 其他常见问题

- **构建失败**：检查构建命令是否为 `npx @cloudflare/next-on-pages@1`
- **API 调用失败**：确认环境变量 `NEXT_PUBLIC_API_BASE_URL` 已正确设置
- **页面加载慢**：Edge Runtime 首次冷启动可能需要几秒钟

## 🔗 相关链接

- GitHub 仓库: https://github.com/Tikous/blogPages
- AWS API 文档: 见项目 README.md
- Cloudflare Pages 文档: https://developers.cloudflare.com/pages/
- Next.js on Cloudflare: https://developers.cloudflare.com/pages/framework-guides/nextjs/ 