# 周末不宅家（Weekend Outgo）

「周末不宅家」是一个面向城市周边短途游的 Web 应用。  
核心目标：让用户打开首页即可定位当前位置，获得地图化的游玩路线推荐，并可在“我的”模块持续沉淀个人数据（收藏、历史、资料）。

---

## 一、项目功能特点

### 1) 首页定位与路线推荐
- 首次进入首页自动定位（支持失败回退）。
- 基于当前位置/当前城市中心，推荐多条附近路线。
- 在地图上绘制路线，可点击查看详情。

### 2) 顶部城市搜索栏（增强交互）
- 支持中文搜索城市。
- 支持拼音/首字母搜索（如 `nanjing`、`nj`、`hangzhou`、`hz`）。
- 支持键盘交互：
  - `ArrowUp / ArrowDown` 切换候选
  - `Enter` 选中
  - `Esc` 关闭
- 搜索词高亮、当前城市自动滚动可见。

### 3) 路线详情体验
- 点击路线可打开详情弹窗。
- 详情页包含行程规划、必吃/必游、亮点等信息。
- 已修复地图与弹窗层级冲突，弹窗始终在最上层。

### 4) 我的模块（已完善）
- 资料卡可编辑昵称与简介。
- 收藏路线管理。
- 最近游玩历史记录（含时间、城市、可选坐标）。

### 5) 数据持久化
- 本地缓存：`localStorage`（离线可用）。
- 云端同步：Supabase（可配置后启用）。
  - 用户资料
  - 收藏路线
  - 历史记录

---

## 二、技术栈

- 前端框架：React 19 + TypeScript
- 构建工具：Vite 7
- 路由：React Router 7
- 样式：Tailwind CSS
- 地图：Leaflet + React Leaflet（高清底图）
- 数据云服务：Supabase（PostgreSQL）
- 图标与 UI：lucide-react + Radix UI 组件体系

---

## 三、项目架构

```text
src/
  components/             # 页面组件与业务组件（Hero、Map、Profile、RouteDetail 等）
  data/                   # 路线静态数据与路线几何数据
  hooks/                  # 业务 hooks（收藏、历史、用户资料）
  lib/                    # 基础能力（supabase client、设备 ID）
  pages/                  # 页面入口（Home）
  services/               # 数据服务层（Supabase 读写）
  utils/                  # 工具函数（地理距离、最近城市）
supabase/
  schema.sql              # Supabase 建表与策略 SQL
```

### 分层说明
- **UI 层（components/pages）**：只处理展示与交互。
- **状态层（hooks）**：封装收藏/历史/资料状态与同步逻辑。
- **服务层（services/lib）**：统一管理 Supabase 调用，便于替换后端。
- **数据层（data）**：路线内容与路线坐标独立维护。

---

## 四、页面功能截图

> 截图文件位于 `docs/screenshots/`。当前仓库提供占位图，后续可直接替换同名文件为真实截图。

### 1) 首页：定位 + 地图路线推荐

![首页定位与地图推荐](docs/screenshots/home-map.svg)

### 2) 顶部城市搜索（中文 / 拼音 / 首字母）

![顶部城市搜索下拉](docs/screenshots/home-search-dropdown.svg)

### 3) 路线详情弹窗

![路线详情弹窗](docs/screenshots/route-detail-modal.svg)

### 4) 我的模块（资料 + 收藏 + 历史）

![我的模块](docs/screenshots/profile-module.svg)

---

## 五、快速开始

### 1) 安装依赖
```bash
npm install
```

### 2) 配置环境变量（可选但推荐）
创建 `.env.local`：

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> 若不配置 Supabase，应用仍可运行，仅使用本地持久化模式。

### 3) 初始化 Supabase 数据库
在 Supabase SQL Editor 执行：

```sql
-- 文件路径：supabase/schema.sql
```

### 4) 本地运行
```bash
npm run dev
```

### 5) 打包构建
```bash
npm run build
```

---

## 六、部署指南

### 1) Vercel 部署（推荐）

1. 将仓库推送到 GitHub。
2. 在 Vercel 中导入该仓库。
3. Framework Preset 选择 `Vite`（通常会自动识别）。
4. 在 Vercel Project Settings -> Environment Variables 中配置：

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. 触发部署，默认构建命令与输出目录：
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 2) 静态托管部署（Nginx / OSS / CDN）

本项目是标准 Vite SPA，可按静态资源托管：

```bash
npm install
npm run build
```

将 `dist/` 目录上传到静态服务器，并保证 SPA 路由回退到 `index.html`。

### 3) Nginx 示例配置

```nginx
server {
  listen 80;
  server_name your-domain.com;

  root /var/www/weekend-outgo/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 七、NPM 脚本

- `npm run dev`：启动开发服务
- `npm run build`：TypeScript 编译 + 生产构建
- `npm run preview`：本地预览生产包
- `npm run lint`：ESLint 检查

---

## 八、数据库说明（Supabase）

- Supabase 使用 **PostgreSQL**（不是 MySQL）。
- SQL 脚本已提供：`supabase/schema.sql`。
- 当前脚本包含 demo 级 RLS 策略（匿名可读写），生产建议切换到基于 `auth.uid()` 的用户隔离策略。

---

## 九、后续建议

- 接入真实用户登录（Supabase Auth），实现“账号级”跨设备同步。
- 路线数据改为后台可运营配置（CMS 或管理端）。
- 增加路线规划 API（驾车/步行时间、实时交通）。
