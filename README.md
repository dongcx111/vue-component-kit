# Vue Component Kit

![npm version](https://img.shields.io/badge/npm-v1.0.0--alpha.0-orange) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个用于 Vue 3 的现代组件库，提供优雅的 UI 组件和实用的组合式函数。

## 特性

- ✨ 基于 Vue 3 + TypeScript 构建
- 🎨 现代化的组件设计
- 📦 支持 ESM 和 CommonJS
- 🚀 轻量级，无额外依赖
- 📱 响应式设计
- 🛠️ 实用的组合式函数

## 安装

可以通过以下包管理器安装：

### pnpm

```bash
pnpm add vue-component-kit
```

### npm

```bash
npm install vue-component-kit
```

### yarn

```bash
yarn add vue-component-kit
```

## 快速开始

### 按需引入

```typescript
import { createApp } from "vue";
import { VckTimeline } from "vue-component-kit";
import "vue-component-kit/theme/timeline.css";

const app = createApp(App);
app.use(VckTimeline);
app.mount("#app");
```

## 组件

### Timeline 时间轴组件

一个优雅的时间轴组件，支持多种自定义配置。

#### 基础用法

```vue
<template>
  <VckTimeline
    time="2024-01-01"
    category="事件"
    title="新的开始"
    description="这是一个重要的里程碑"
    thumbnail="https://example.com/image.jpg"
  />
</template>

<script setup>
import { VckTimeline } from "vue-component-kit";
</script>
```

#### Props

| 属性        | 说明                               | 类型                | 默认值 |
| ----------- | ---------------------------------- | ------------------- | ------ |
| time        | 时间                               | string              | ''     |
| category    | 分类                               | string              | ''     |
| title       | 标题                               | string              | ''     |
| thumbnail   | 缩略图地址                         | string              | ''     |
| description | 描述                               | string              | ''     |
| isLast      | 是否为最后一项                     | boolean             | false  |
| color       | 主题颜色                           | string              | 'blue' |
| root        | 用于 IntersectionObserver 的根元素 | HTMLElement \| null | null   |

#### Slots

| 名称   | 说明           |
| ------ | -------------- |
| left   | 左侧内容插槽   |
| center | 中间 icon 插槽 |
| right  | 右侧内容插槽   |

## Hooks

### useThemeChange 主题切换 Hook

一个优雅的主题切换 Hook，支持淡入淡出和滑动动画效果。

#### 基础用法

```vue
<template>
  <button @click="toggleDark">切换主题</button>
</template>

<script setup>
import { useThemeChange } from "vue-component-kit";

const { isDark, toggleDark } = useThemeChange({
  animation: true,
  animationType: "slide",
});
</script>
```

#### API

```typescript
interface UseThemeChangeOptions {
  animation?: boolean; // 是否启用动画，默认为 true
  animationType?: "fade" | "slide"; // 动画类型，默认为 'slide'
}

interface UseThemeChangeReturn {
  isDark: Readonly<Ref<boolean>>; // 是否为深色模式
  toggleDark: () => void; // 切换主题函数
}

function useThemeChange(options?: UseThemeChangeOptions): UseThemeChangeReturn;
```

## 开发

### 克隆项目

```bash
git clone https://github.com/your-repo/vue-component-kit.git
cd vue-component-kit
```

### 安装依赖

```bash
pnpm install
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建 shared 包
pnpm build:shared

# 构建组件包
pnpm build:component
```

### 测试

```bash
# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

### 代码规范

```bash
# 运行 Lint
pnpm lint

# 自动修复
pnpm lint:fix

# 格式化代码
pnpm fmt

# 检查格式
pnpm fmt:check
```

## 项目结构

```
vue-component-kit/
├── packages/
│   ├── vue-component-kit/  # 主包入口
│   ├── components/          # 组件源码
│   │   ├── timeline/        # 时间轴组件
│   │   └── hooks/           # 组合式函数
│   └── shared/              # 共享工具
├── docs/                    # 文档
├── play/                    # 演示项目
└── package.json
```

## 许可证

MIT License

## 作者

dongcx111

## 贡献

欢迎提交 Issue 和 Pull Request！
