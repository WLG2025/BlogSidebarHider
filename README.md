# 博客侧边栏隐藏插件

一个Chrome浏览器扩展，用于隐藏博客页面的左右侧边栏，包括浮动元素，通过可拖拽的浮动按钮控制显示/隐藏状态。

## 功能特性
- 隐藏博客页面的左侧主侧边栏和右侧推荐侧边栏
- 隐藏所有浮动工具栏和悬浮元素
- 不影响正文内容和页面布局
- 通过页面内浮动按钮控制显示/隐藏
- 浮动按钮支持拖拽改变位置
- 记忆用户在特定域名下的选择和按钮位置

## 安装方法
1. 下载或克隆本仓库
2. 打开Chrome浏览器，进入扩展管理页面 (chrome://extensions/)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目的根目录

## 使用方法
1. 访问博客页面
2. 页面右上角会出现控制按钮
3. 点击按钮切换侧边栏显示/隐藏状态
4. 拖拽按钮可以改变位置

## 项目结构
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
│   ├── popup.html        # 弹出页面
│   ├── popup.css         # 弹出页面样式
│   └── popup.js          # 弹出页面逻辑
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-04-12-blog-sidebar-hider-design.md
├── .gitignore            # Git忽略文件
├── README.md             # 使用说明
└── test-page.html        # 测试页面
```

## 技术实现
- **Manifest V3**: 使用最新的Chrome扩展API
- **CSS注入**: 通过content.css隐藏侧边栏元素
- **JavaScript逻辑**: 处理状态管理、拖拽交互和DOM监听
- **存储API**: 使用chrome.storage.local保存用户偏好
- **消息通信**: popup页面与content script通信

## 开发说明
1. 项目使用Git进行版本控制
2. 代码遵循模块化设计原则
3. 包含完整的错误处理
4. 支持动态内容加载

## 已知限制
1. 仅支持Chrome和Edge浏览器
2. CSS选择器针对特定网站结构
3. 需要手动加载扩展（未发布到商店）

## 更新日志
### v1.0.0 (2026-04-12)
- 初始版本发布
- 实现侧边栏隐藏功能
- 添加可拖拽浮动按钮
- 支持状态记忆和位置保存
- 添加弹出控制页面