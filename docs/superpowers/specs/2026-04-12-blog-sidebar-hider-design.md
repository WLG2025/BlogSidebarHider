# 博客侧边栏隐藏插件设计文档

## 项目概述
开发一个Chrome浏览器扩展，用于隐藏博客页面的左右侧边栏，包括浮动元素，同时保持正文、页眉、页脚不变。插件通过页面内浮动按钮控制显示/隐藏状态。

## 目标用户
个人使用，但设计为可发布到Chrome/Edge扩展商店。

## 核心需求
1. 隐藏博客页面的左侧主侧边栏和右侧推荐侧边栏
2. 隐藏所有浮动工具栏和悬浮元素
3. 不影响正文内容和页面布局
4. 通过页面内浮动按钮控制显示/隐藏
5. 浮动按钮支持拖拽改变位置
6. 记忆用户在特定域名下的选择和按钮位置
7. 仅在目标博客域名生效
8. 使用git进行版本控制和项目管理

## 技术方案
### 架构选择：CSS + JavaScript混合方案
- **CSS**：负责隐藏样式的定义和应用
- **JavaScript**：负责状态管理、浮动按钮交互和DOM监听
- **Chrome扩展API**：使用Manifest V3，支持Chrome和Edge

### 组件设计
#### 1. Content Script（内容脚本）
- **注入时机**：`document_end`（DOM加载完成后）
- **匹配域名**：`*://blog.csdn.net/*`
- **核心功能**：
  - 加载保存的状态
  - 注入CSS样式
  - 创建浮动控制按钮
  - 监听DOM变化（MutationObserver）

#### 2. CSS样式策略
- 使用特定选择器定位侧边栏元素
- 应用`display: none !important`确保覆盖页面样式
- **注意**：CSS选择器中的类名和ID名基于目标网站的实际HTML结构，这是技术必需的匹配方式
- 针对动态内容设计灵活选择器
- 核心隐藏规则：
  ```css
  /* 左侧侧边栏 */
  .blog_container_aside, .mainAside, .aside, #asideProfile,
  #asideCategory, #asideArchive, #asideHotArticle, #asideNewComments {
      display: none !important;
  }
  
  /* 右侧侧边栏 */
  .recommend-right, .recommend, #recommendEnd, .tool-box,
  .csdn-side-toolbar, .blog-expert-recommend-box {
      display: none !important;
  }
  
  /* 浮动工具栏 */
  .csdn-side-toolbar, .tool-box, .pulllog-box {
      display: none !important;
  }
  
  /* 广告相关 */
  .adsbygoogle, .ad-box, .spread-module {
      display: none !important;
  }
  ```

#### 3. 浮动控制按钮
- **位置**：页面右上角偏下（top: 80px, right: 20px）或用户自定义位置
- **样式**：固定位置，圆角设计，深色背景，带图标和文字
- **交互**：
  - 点击切换显示/隐藏状态
  - 支持鼠标拖拽改变位置
  - 更新按钮图标和文字
  - 保存状态和位置到本地存储
- **拖拽功能**：
  - 鼠标按下时开始拖拽
  - 鼠标移动时更新按钮位置
  - 鼠标释放时保存新位置
  - 显示拖拽手柄或使用整个按钮作为拖拽区域
- **视觉状态**：
  - 显示状态："隐藏侧边栏" + 睁眼图标
  - 隐藏状态："显示侧边栏" + 闭眼图标

#### 4. 状态管理
- **存储API**：`chrome.storage.local`
- **键名设计**：
  - `sidebarHidden_{hostname}` - 侧边栏隐藏状态（布尔值）
  - `buttonPosition_{hostname}` - 按钮位置信息（对象，包含top和right值）
- **数据类型**：
  - 侧边栏状态：布尔值
  - 按钮位置：`{top: number, right: number}`（单位为px）
- **作用域**：域名级别（仅在blog.csdn.net下生效）

#### 5. DOM变化监听
- 使用MutationObserver监测新增元素
- 对新元素应用/移除隐藏样式
- 优化：使用debounce避免性能问题

### 项目文件结构
```
blog-sidebar-hider/
├── manifest.json          # 扩展清单文件
├── content/
│   ├── content.css       # CSS样式文件
│   └── content.js        # 主JavaScript逻辑
├── icons/
│   ├── icon16.png        # 16x16图标
│   ├── icon48.png        # 48x48图标
│   └── icon128.png       # 128x128图标
├── popup/
│   ├── popup.html        # 弹出页面（可选）
│   ├── popup.css         # 弹出页面样式
│   └── popup.js          # 弹出页面逻辑
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-04-12-blog-sidebar-hider-design.md
├── .gitignore            # Git忽略文件
├── README.md             # 使用说明
└── LICENSE               # 许可证文件（可选）
```

### Manifest配置
```json
{
    "manifest_version": 3,
    "name": "博客侧边栏隐藏工具",
    "version": "1.0.0",
    "description": "隐藏博客页面的左右侧边栏，专注阅读内容",
    "icons": {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png", 
        "128": "icons/icon128.png"
    },
    "permissions": ["storage"],
    "content_scripts": [{
        "matches": ["*://blog.csdn.net/*"],
        "css": ["content/content.css"],
        "js": ["content/content.js"],
        "run_at": "document_end"
    }],
    "action": {
        "default_popup": "popup/popup.html",
        "default_title": "博客侧边栏隐藏工具"
    }
}
```

### 项目管理
#### Git版本控制
- **初始化**：项目开始时创建git仓库
- **分支策略**：使用main分支作为稳定分支，feature分支用于功能开发
- **提交规范**：使用约定式提交（Conventional Commits）
- **忽略文件**：创建`.gitignore`文件，忽略临时文件、构建产物和编辑器文件

#### .gitignore配置示例
```gitignore
# 操作系统文件
.DS_Store
Thumbs.db

# 编辑器文件
.vscode/
.idea/
*.swp
*.swo

# 依赖文件
node_modules/
package-lock.json

# 构建产物
dist/
build/
*.zip
```

#### 开发流程
1. 初始化git仓库：`git init`
2. 添加初始文件：`git add .`
3. 提交初始版本：`git commit -m "chore: initial commit"`
4. 创建功能分支：`git checkout -b feat/draggable-button`
5. 开发完成后合并到主分支

## 实施计划
### 阶段1：基础功能
1. 创建项目结构和清单文件
2. 实现CSS隐藏规则
3. 实现基本JavaScript状态切换
4. 创建简单浮动按钮

### 阶段2：增强功能
1. 添加状态持久化
2. 实现DOM变化监听
3. 实现按钮拖拽功能和样式优化
4. 添加错误处理和边界情况处理

### 阶段3：测试和优化
1. 在不同页面类型上测试
2. 性能优化和内存管理
3. 用户界面微调
4. 创建扩展图标和弹出页面

## 成功标准
1. 侧边栏完全隐藏，不干扰正文阅读
2. 浮动按钮响应迅速，状态切换流畅
3. 用户选择在不同页面间正确保持
4. 插件不影响页面性能和稳定性
5. 代码结构清晰，易于维护和扩展
6. 按钮拖拽功能流畅，位置记忆准确

## 潜在风险与缓解
1. **网站结构变化**：使用灵活的选择器和MutationObserver动态适应
2. **性能问题**：优化DOM操作，使用debounce减少频繁更新
3. **样式冲突**：使用`!important`和特定选择器确保优先级
4. **存储限制**：使用域名级别存储，避免过度存储数据
5. **拖拽性能**：优化拖拽事件处理，避免频繁的DOM操作和存储写入

## 后续扩展可能性
1. 支持更多博客平台
2. 添加键盘快捷键支持
3. 提供自定义CSS选择器配置
4. 添加白名单/黑名单功能
5. 集成到右键菜单

---
**创建日期**：2026-04-12  
**最后更新**：2026-04-12  
**状态**：设计完成，待实施