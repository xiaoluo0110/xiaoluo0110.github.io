# 小叶罗 · 可视化导航站

个人可视化作品导航站（Vue 3 + Vite）。

## 本地开发

```bash
npm install
npm run dev
```

## 构建产物

```bash
npm run build
# 下次构建
# 1. 改 src/ 里的代码
# 2. 重新构建
npm run build

# 3. 提交并推送（源码 + 新的 docs/ 一起推）
git add .
git commit -m "update site"
git push
```

本项目构建输出目录是 **`docs/`**（作用等同于常见的 `dist/`）。  
上线用的是 `docs/` 里的静态文件，不是根目录的源码 `index.html`。

## 部署到 GitHub Pages（二选一）

### 方式 A：用 `/docs` 目录（推荐，简单）

1. 本地执行 `npm run build`
2. 把代码（含 `docs/`）推送到 `main`
3. 打开仓库 **Settings → Pages**
4. Source 选 **Deploy from a branch**
5. Branch 选 `main`，Folder 选 **`/docs`**
6. 保存后访问：https://xiaoluo0110.github.io/

### 方式 B：用 GitHub Actions 自动构建

1. 推送代码到 `main`（仓库里已有 `.github/workflows/deploy.yml`）
2. Settings → Pages → Source 选 **GitHub Actions**
3. 每次推送会自动 `npm ci && npm run build` 并发布

> 注意：不要把 Pages 指到仓库根目录。根目录的 `index.html` 是 Vite 源码入口，浏览器直接打开无法运行。

## 内容分类

1. **学科工具**：数学（已上线）、地理、物理
2. **三维演示**：Cesium、ArcGIS、Three.js（规划中）
3. **应用场景**：气象（已上线）、馆藏展示（规划中）
