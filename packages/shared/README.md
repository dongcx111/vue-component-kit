# @vue-component-kit/shared

![npm version](https://img.shields.io/badge/npm-v0.01-orange) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

共享工具包，用于跨包共享的工具函数，特别是 Vue 组件的安装相关工具。

## 特性

- `withInstall`: 为 Vue 组件添加 `install` 方法
- `makeInstaller`: 创建组件安装器插件
- `SFCWithInstall`: 带有安装方法的组件类型定义

## 安装

可以通过以下包管理器安装：

````tabs
@tab pnpm
```bash
pnpm add @vue-component-kit/shared
````

@tab npm

```bash
npm install @vue-component-kit/shared
```

@tab yarn

```bash
yarn add @vue-component-kit/shared
```

````

```bash
yarn add @vue-component-kit/shared
````

## 使用

### withInstall

为单个 Vue 组件添加安装方法：

```typescript
import { withInstall } from "@vue-component-kit/shared";
import MyComponent from "./MyComponent.vue";

const MyComponentWithInstall = withInstall(MyComponent);

// 现在可以在应用中使用
app.use(MyComponentWithInstall);
```

### makeInstaller

为多个插件创建统一的安装器。参数类型为 `Plugin[]`，通常使用 `withInstall` 包装后的组件。

```typescript
import { makeInstaller, withInstall } from "@vue-component-kit/shared";
import ComponentA from "./ComponentA.vue";
import ComponentB from "./ComponentB.vue";

const ComponentAPlugin = withInstall(ComponentA);
const ComponentBPlugin = withInstall(ComponentB);
const installer = makeInstaller([ComponentAPlugin, ComponentBPlugin]);

// 在应用中安装所有插件
app.use(installer);
```

### 类型定义

```typescript
import type { SFCWithInstall } from "@vue-component-kit/shared";

interface MyComponent {
  name: string;
  // ... 其他属性
}

type MyComponentWithInstall = SFCWithInstall<MyComponent>;
```

## API 文档

### withInstall<T>(component: T): SFCWithInstall<T>

为组件添加 `install` 方法，使其可以作为 Vue 插件使用。

**参数：**

- `component`: 要安装的组件，必须包含 `name` 属性

**返回值：** 带有 `install` 方法的组件

### makeInstaller(components: Plugin[]): Plugin

创建包含多个组件的安装器插件。

**参数：**

- `components`: 要安装的组件数组

**返回值：** Vue 插件对象

### SFCWithInstall<T>

表示带有 `install` 方法的组件类型。

## 许可证

MIT License

## 作者

dongcx111
