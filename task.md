# 任务清单

## ✅ 阶段一: 核心 Web 应用与可视化播放器 (已完成)

这个阶段的目标是创建一个功能完善的、交互式的 Web 演示页面。该页面将使用模拟数据，精确地展示所描述的对话场景。

- **[x] 1. 项目初始化与环境配置**
    - [x] 使用 `pnpm create vue@latest` 初始化 Vue 3 + TypeScript 项目。
    - [x] 集成 Tailwind CSS。
    - [x] 配置 `shadcn-vue`，并设置主色为 `#34CC85`。
    - [x] 按需安装了 `Button` 组件。

- **[x] 2. 模拟数据与组件设计**
    - [x] 在 `src/data/conversation.ts` 中创建了关于“职场”和“裸辞”话题的模拟对话数据。
    - [x] 创建了 `Avatar.vue` 头像组件，包含占位符和 `isSpeaking` 状态（放大和高亮）。
    - [x] 创建了 `Subtitle.vue` 字幕组件。
    - [x] 创建了 `Stage.vue` 舞台组件，实现了两行布局（主播行和嘉宾行）。

- **[x] 3. 核心播放逻辑与状态管理**
    - [x] 在 `App.vue` 中使用 Vue 3 的响应式 API (`ref`, `computed`) 管理应用状态。
    - [x] 实现了播放/暂停功能。
    - [x] 使用 `requestAnimationFrame` 创建了平滑的播放计时器。

- **[x] 4. 调试与验证**
    - [x] 解决了因 Vite 端口占用导致的白屏问题。
    - [x] 确认应用在浏览器中按预期正常工作。

- **[x] 5. 版本控制**
    - [x] 初始化了 Git 仓库。
    - [x] 将所有已完成的工作提交到 `main` 分支。
