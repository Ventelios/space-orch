# 星际首席爱乐乐团 · 2027 乐季招募站

一个零依赖的静态网站。无构建、无框架、无需 npm。

## 本地预览

任选一种：

```bash
# Python 3
python -m http.server 8080

# Node
npx serve .

# PHP
php -S localhost:8080
```

然后打开 <http://localhost:8080>。

> 直接双击 `index.html` 也能看，但通过 `file://` 打开时部分浏览器会限制字体加载，建议用本地服务。

## 目录结构

```
.
├── index.html              单页全部内容
├── assets/
│   ├── css/style.css       全部样式（含响应式与动效降级）
│   ├── js/main.js          星尘背景 / 滚动入场 / 移动端菜单
│   └── img/
│       ├── hero.webp/.png  首屏主视觉
│       ├── earth.webp/.png 地球乐厅
│       └── fox.webp/.png   狐星剧场
├── generated-images/       未裁剪的原始生成图（可删）
└── README.md
```

> 这是一个概念设计演示，站内不含任何真实联系方式。
> 全站唯一的外部链接是「立即报名」，指向腾讯文档报名表：
> <https://docs.qq.com/form/page/DSUZzRm1Qa29sd0Nq>

## 发布到 GitHub Pages

```bash
git init
git add .
git commit -m "feat: 星际首席爱乐乐团招募站"
git branch -M main
git remote add origin git@github.com:<你的用户名>/<仓库名>.git
git push -u origin main
```

然后在 GitHub 仓库页面：

1. **Settings → Pages**
2. **Source** 选择 `Deploy from a branch`
3. **Branch** 选 `main` / 目录选 `/ (root)`
4. 保存，等 1–2 分钟，访问 `https://<用户名>.github.io/<仓库名>/`

如果之后绑定自定义域名（例如 `space-orch.net`），在 **Custom domain** 填入域名，
并在 DNS 处添加指向 `<用户名>.github.io` 的 CNAME 记录。

## 改动指南

| 想改什么 | 改哪里 |
| --- | --- |
| 文案 | `index.html`，区块按注释分隔 |
| 配色 | `assets/css/style.css` 顶部的 `:root` 变量 |
| 招聘声部 / 缺额 | `.voices` 列表，每项一个 `<li class="voice">` |
| 巡演场次 | `.tour` 表格的 `<tbody>` |
| 报名表链接 | 搜索 `docs.qq.com`（共 2 处：CTA 主按钮、页脚） |

## 无障碍与性能

- 语义化标签、`skip link`、`:focus-visible` 描边
- 全站支持 `prefers-reduced-motion`，动效自动降级为静态
- 图片使用 `<picture>` + WebP，首屏图 `preload`，其余 `loading="lazy"`
- 无第三方 JS，唯一外部依赖是 Google Fonts（可自行改为本地字体）
