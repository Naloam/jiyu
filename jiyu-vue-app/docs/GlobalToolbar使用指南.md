# 全局工具栏组件使用指南

## 概述

`GlobalToolbar` 是一个全局导航组件，用于在积语伴学应用的所有页面顶部显示统一的导航菜单。它替代了原先各页面独立实现的顶部工具栏，提供了统一的用户体验和更易维护的代码结构。

## 特性

- 统一的导航菜单，包含应用的主要页面链接
- 支持高亮当前激活的页面
- 支持自定义隐藏特定菜单项
- 支持添加额外的导航项
- 内置个性化学习下拉菜单
- 显示用户名和设置按钮
- 响应式设计，支持移动设备

## 使用方法

### 基础用法

```vue
<template>
  <div>
    <GlobalToolbar @toggle-settings="yourSettingsHandlerMethod" />
    <!-- 页面其他内容 -->
  </div>
</template>

<script setup>
import GlobalToolbar from '@/components/common/GlobalToolbar.vue'

// 处理设置按钮点击
const yourSettingsHandlerMethod = () => {
  // 处理设置菜单打开的逻辑
}
</script>
```

### 隐藏特定菜单项

如果当前页面是某个菜单项对应的页面，通常需要隐藏该菜单项以避免用户点击当前页面的链接：

```vue
<GlobalToolbar 
  :hideItems="['/current-page-route']" 
  @toggle-settings="yourSettingsHandlerMethod"
/>
```

例如，在 Chat.vue 中可以隐藏智能问答菜单项：

```vue
<GlobalToolbar 
  :hideItems="['/chat']" 
  @toggle-settings="toggleSidebar"
/>
```

### 添加额外的导航项

对于需要在标准导航之外添加特殊导航项的页面，可以使用 `extraNavItems` 属性：

```vue
<GlobalToolbar 
  :extraNavItems="[
    { label: '自定义项目', route: '/custom-route' }
  ]"
  @toggle-settings="yourSettingsHandlerMethod"
/>
```

### 处理个性化学习菜单点击

个性化学习下拉菜单中的按钮点击会触发 `feature-click` 事件，携带特性标识符：

```vue
<GlobalToolbar 
  @feature-click="handleFeatureClick" 
  @toggle-settings="yourSettingsHandlerMethod"
/>
```

```javascript
const handleFeatureClick = (feature) => {
  switch (feature) {
    case 'feynman':
      // 处理费曼学习法
      break
    case 'planning':
      // 处理智能规划
      break
    case 'coming-soon':
      // 处理即将推出的功能
      break
  }
}
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| extraNavItems | Array | [] | 额外的导航项，每项包含 `label` 和 `route` 属性 |
| hideItems | Array | [] | 需要隐藏的导航项路由路径数组 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| toggle-settings | 无 | 点击设置按钮时触发 |
| feature-click | feature: string | 点击个性化学习下拉菜单中的功能按钮时触发，参数为功能标识符 |

## 样式定制

全局工具栏的样式采用 SCSS 编写，包含以下特性：

- 半透明背景配合毛玻璃效果
- 响应式布局，自动适应各种屏幕尺寸
- 鼠标悬停和激活状态的视觉反馈

如需自定义样式，可通过 CSS 变量或在父组件中定义全局样式来覆盖默认样式。

## 维护注意事项

1. 更新默认导航项时，需要同步更新所有页面中可能用到的 `hideItems` 属性
2. 添加新的个性化学习功能时，需要在使用该组件的各页面中更新 `handleFeatureClick` 方法
3. 导航菜单项顺序应保持一致，以提供统一的用户体验

## 最佳实践

- 在所有页面统一使用 GlobalToolbar 组件
- 所有页面顶部需要预留约 60px 的空间（padding-top: 60px）以避免内容被工具栏遮挡
- 对应当前页面的导航项应通过 `hideItems` 属性隐藏，避免用户点击当前页面链接
- 每个页面应实现自己的设置处理逻辑，并通过 `@toggle-settings` 事件绑定
