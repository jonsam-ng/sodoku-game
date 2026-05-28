# 🎮 iOS 风格数独游戏

一款优雅的 iOS 风格数独游戏应用，支持简单、中等、复杂三种难度级别，提供流畅的游戏体验和精美的用户界面。

## ✨ 主要功能

- 🎯 **三种难度级别** - 简单、中等、复杂，满足不同水平玩家的需求
- 🔄 **随机数独生成** - 每次游戏都会生成新的数独谜题
- ⏱️ **游戏计时** - 记录您的解题时间
- ❌ **错误统计** - 跟踪您的错误次数
- ✅ **答案检查** - 验证您的解答并高亮错误
- 💡 **提示功能** - 为选中的格子提供正确答案
- 🗑️ **清除功能** - 清除选中格子的内容
- 🔄 **新游戏** - 随时开始新游戏
- 🎨 **智能高亮** - 选中格子时，自动高亮同一行、列和3x3区域
- 🎉 **完成提示** - 成功完成时显示庆祝动画

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **状态管理**: React Hooks (useState, useEffect, useCallback)
- **语言**: TypeScript

## 📦 安装与运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/ 即可开始游戏。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
/workspace
├── public/                # 静态资源
├── src/
│   ├── assets/           # 资源文件
│   ├── components/       # React 组件
│   │   ├── Empty.tsx
│   │   └── Sudoku.tsx    # 数独游戏主组件
│   ├── hooks/           # 自定义 hooks
│   ├── lib/             # 工具库
│   ├── pages/           # 页面
│   │   └── Home.tsx     # 游戏首页
│   ├── utils/           # 工具函数
│   │   └── sudoku.ts    # 数独核心算法
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .trae/documents/     # 项目文档
│   ├── arch.md          # 技术架构文档
│   └── prd.md           # 产品需求文档
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # Tailwind CSS 配置
├── tsconfig.json        # TypeScript 配置
└── package.json
```

## 🎨 设计特点

- **iOS 风格设计** - 简洁清爽的苹果设计风格
- **系统蓝主色调** - 经典的 iOS 蓝色主题
- **圆角设计** - 符合 iOS 设计语言的圆角元素
- **平滑动画** - 按钮和交互都有流畅的过渡效果
- **清晰的视觉层次** - 重要信息一目了然
- **响应式布局** - 适配不同屏幕尺寸

## 🧩 数独算法

项目包含完整的数独生成和验证算法：
- 使用回溯算法生成合法的数独解
- 根据难度级别移除相应数量的格子
- 快速验证数独解答的正确性
- 提供提示功能

## 📄 License

MIT
