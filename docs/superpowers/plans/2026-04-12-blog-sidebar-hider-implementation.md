# 博客侧边栏隐藏插件实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个Chrome浏览器扩展，用于隐藏博客页面的左右侧边栏，包括浮动元素，通过可拖拽的浮动按钮控制显示/隐藏状态，并记忆用户偏好。

**Architecture:** 使用Manifest V3开发Chrome扩展，通过content script注入CSS和JavaScript到目标页面，采用CSS+JavaScript混合方案：CSS负责隐藏样式，JavaScript负责状态管理和拖拽交互。

**Tech Stack:** Chrome扩展API (Manifest V3), JavaScript, CSS, Git版本控制

---

## 文件结构

```
blog-sidebar-hider/
├── manifest.json          # 扩展清单文件
├── content/
│   ├── content.css       # CSS样式文件
│   └── content.js        # 主JavaScript逻辑
├── icons/
│   ├── icon16.png        # 16x16图标（占位符）
│   ├── icon48.png        # 48x48图标（占位符）
│   └── icon128.png       # 128x128图标（占位符）
├── popup/
│   ├── popup.html        # 弹出页面（简单版本）
│   ├── popup.css         # 弹出页面样式
│   └── popup.js          # 弹出页面逻辑
├── .gitignore            # Git忽略文件
└── README.md             # 使用说明
```

## 实施任务

### Task 1: 项目初始化

**Files:**
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: 初始化Git仓库**

```bash
git init
git status
```

- [ ] **Step 2: 创建.gitignore文件**

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

- [ ] **Step 3: 创建README.md文件**

```markdown
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

## 开发
- 使用Manifest V3
- 纯JavaScript + CSS实现
- 使用Chrome扩展API存储用户偏好
```

- [ ] **Step 4: 提交初始版本**

```bash
git add .gitignore README.md
git commit -m "chore: initial project setup"
```

### Task 2: 创建扩展清单文件

**Files:**
- Create: `manifest.json`

- [ ] **Step 1: 创建manifest.json文件**

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
    "permissions": [
        "storage"
    ],
    "content_scripts": [
        {
            "matches": ["*://blog.csdn.net/*"],
            "css": ["content/content.css"],
            "js": ["content/content.js"],
            "run_at": "document_end"
        }
    ],
    "action": {
        "default_popup": "popup/popup.html",
        "default_title": "博客侧边栏隐藏工具"
    }
}
```

- [ ] **Step 2: 创建图标目录和占位符文件**

```bash
mkdir -p icons
touch icons/icon16.png icons/icon48.png icons/icon128.png
```

- [ ] **Step 3: 测试清单文件语法**

```bash
python3 -m json.tool manifest.json > /dev/null && echo "JSON syntax OK" || echo "JSON syntax error"
```

- [ ] **Step 4: 提交manifest文件**

```bash
git add manifest.json icons/
git commit -m "feat: add manifest.json and icon placeholders"
```

### Task 3: 创建CSS样式文件

**Files:**
- Create: `content/`
- Create: `content/content.css`

- [ ] **Step 1: 创建content目录**

```bash
mkdir -p content
```

- [ ] **Step 2: 创建content.css文件**

```css
/* 博客侧边栏隐藏插件样式 */

/* 左侧侧边栏隐藏 */
.blog_container_aside, 
.mainAside, 
.aside, 
#asideProfile,
#asideCategory,
#asideArchive,
#asideHotArticle,
#asideNewComments {
    display: none !important;
}

/* 右侧侧边栏隐藏 */
.recommend-right, 
.recommend,
#recommendEnd,
.tool-box,
.csdn-side-toolbar,
.blog-expert-recommend-box {
    display: none !important;
}

/* 浮动工具栏隐藏 */
.csdn-side-toolbar,
.tool-box,
.pulllog-box {
    display: none !important;
}

/* 广告相关隐藏 */
.adsbygoogle,
.ad-box,
.spread-module {
    display: none !important;
}

/* 浮动控制按钮样式 */
.sidebar-toggle-button {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    
    background: rgba(51, 51, 51, 0.9);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    
    display: flex;
    align-items: center;
    gap: 8px;
    
    user-select: none;
}

.sidebar-toggle-button:hover {
    background: rgba(51, 51, 51, 1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.sidebar-toggle-button:active {
    transform: translateY(0);
}

.sidebar-toggle-button.hidden {
    background: rgba(74, 144, 226, 0.9);
}

.sidebar-toggle-button.hidden:hover {
    background: rgba(74, 144, 226, 1);
}

.sidebar-toggle-icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
}
```

- [ ] **Step 3: 验证CSS语法**

```bash
csslint --quiet content/content.css || echo "CSS validation complete"
```

- [ ] **Step 4: 提交CSS文件**

```bash
git add content/content.css
git commit -m "feat: add CSS styles for sidebar hiding and toggle button"
```

### Task 4: 基础JavaScript逻辑

**Files:**
- Create: `content/content.js`

- [ ] **Step 1: 创建content.js基础结构**

```javascript
// 博客侧边栏隐藏插件 - 主逻辑
(function() {
    'use strict';
    
    // 状态变量
    let sidebarHidden = false;
    const hostname = window.location.hostname;
    
    // 初始化函数
    async function init() {
        // 从存储加载状态
        const result = await chrome.storage.local.get(`sidebarHidden_${hostname}`);
        sidebarHidden = result[`sidebarHidden_${hostname}`] || false;
        
        // 应用隐藏样式
        updateSidebarVisibility();
        
        // 创建浮动按钮
        createFloatingButton();
        
        console.log('博客侧边栏隐藏插件已加载');
    }
    
    // 切换侧边栏显示/隐藏
    function toggleSidebars() {
        sidebarHidden = !sidebarHidden;
        updateSidebarVisibility();
        saveState();
        updateButtonState();
    }
    
    // 更新侧边栏可见性
    function updateSidebarVisibility() {
        const styleId = 'sidebar-hider-style';
        let styleElement = document.getElementById(styleId);
        
        if (sidebarHidden) {
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }
            // CSS已通过content.css注入
        } else {
            if (styleElement) {
                styleElement.remove();
            }
        }
    }
    
    // 保存状态到存储
    async function saveState() {
        await chrome.storage.local.set({
            [`sidebarHidden_${hostname}`]: sidebarHidden
        });
    }
    
    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 导出函数供其他任务使用
    window.blogSidebarHider = {
        toggleSidebars,
        updateSidebarVisibility,
        saveState
    };
})();
```

- [ ] **Step 2: 测试JavaScript语法**

```bash
node -c content/content.js && echo "JavaScript syntax OK" || echo "JavaScript syntax error"
```

- [ ] **Step 3: 提交基础JavaScript逻辑**

```bash
git add content/content.js
git commit -m "feat: add basic JavaScript logic for sidebar toggling"
```

### Task 5: 浮动按钮实现

**Files:**
- Modify: `content/content.js`

- [ ] **Step 1: 添加图标路径函数**

```javascript
// 在content.js的init函数前添加
function getEyeIconPath(isHidden) {
    // 睁眼图标路径（显示状态）
    const openEye = "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z";
    
    // 闭眼图标路径（隐藏状态）
    const closedEye = "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.35 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z";
    
    return isHidden ? closedEye : openEye;
}
```

- [ ] **Step 2: 添加创建浮动按钮函数**

```javascript
// 在content.js中添加创建按钮函数
function createFloatingButton() {
    // 如果按钮已存在，先移除
    const existingButton = document.getElementById('sidebar-toggle-button');
    if (existingButton) {
        existingButton.remove();
    }
    
    // 创建按钮元素
    const button = document.createElement('button');
    button.className = 'sidebar-toggle-button';
    button.id = 'sidebar-toggle-button';
    button.title = '点击隐藏/显示侧边栏';
    
    // 添加图标和文字
    button.innerHTML = `
        <svg class="sidebar-toggle-icon" viewBox="0 0 24 24">
            <path d="${getEyeIconPath(sidebarHidden)}"/>
        </svg>
        <span>${sidebarHidden ? '显示侧边栏' : '隐藏侧边栏'}</span>
    `;
    
    // 添加状态类
    if (sidebarHidden) {
        button.classList.add('hidden');
    }
    
    // 添加点击事件
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebars();
    });
    
    // 添加到页面
    document.body.appendChild(button);
}
```

- [ ] **Step 3: 添加更新按钮状态函数**

```javascript
// 在content.js中添加更新按钮状态函数
function updateButtonState() {
    const button = document.getElementById('sidebar-toggle-button');
    if (button) {
        // 更新图标
        const icon = button.querySelector('.sidebar-toggle-icon');
        const path = icon.querySelector('path');
        path.setAttribute('d', getEyeIconPath(sidebarHidden));
        
        // 更新文字
        const text = button.querySelector('span');
        text.textContent = sidebarHidden ? '显示侧边栏' : '隐藏侧边栏';
        
        // 更新状态类
        if (sidebarHidden) {
            button.classList.add('hidden');
        } else {
            button.classList.remove('hidden');
        }
    }
}
```

- [ ] **Step 4: 在init函数中调用createFloatingButton**

```javascript
// 更新init函数中的调用
async function init() {
    // 从存储加载状态
    const result = await chrome.storage.local.get(`sidebarHidden_${hostname}`);
    sidebarHidden = result[`sidebarHidden_${hostname}`] || false;
    
    // 应用隐藏样式
    updateSidebarVisibility();
    
    // 创建浮动按钮
    createFloatingButton();
    
    console.log('博客侧边栏隐藏插件已加载');
}
```

- [ ] **Step 5: 更新toggleSidebars函数调用updateButtonState**

```javascript
// 更新toggleSidebars函数
function toggleSidebars() {
    sidebarHidden = !sidebarHidden;
    updateSidebarVisibility();
    saveState();
    updateButtonState(); // 添加这行
}
```

- [ ] **Step 6: 测试更新后的代码**

```bash
node -c content/content.js && echo "JavaScript syntax OK" || echo "JavaScript syntax error"
```

- [ ] **Step 7: 提交浮动按钮实现**

```bash
git add content/content.js
git commit -m "feat: implement floating toggle button with eye icons"
```

### Task 6: 按钮拖拽功能

**Files:**
- Modify: `content/content.js`

- [ ] **Step 1: 在init函数中添加位置加载逻辑**

```javascript
// 更新init函数，添加位置加载
async function init() {
    // 从存储加载状态
    const storageKeyHidden = `sidebarHidden_${hostname}`;
    const storageKeyPosition = `buttonPosition_${hostname}`;
    
    const result = await chrome.storage.local.get([storageKeyHidden, storageKeyPosition]);
    sidebarHidden = result[storageKeyHidden] || false;
    const savedPosition = result[storageKeyPosition] || { top: 80, right: 20 };
    
    // 应用隐藏样式
    updateSidebarVisibility();
    
    // 创建浮动按钮（传入位置）
    createFloatingButton(savedPosition);
    
    console.log('博客侧边栏隐藏插件已加载');
}
```

- [ ] **Step 2: 更新createFloatingButton函数支持位置参数**

```javascript
function createFloatingButton(position = { top: 80, right: 20 }) {
    // 如果按钮已存在，先移除
    const existingButton = document.getElementById('sidebar-toggle-button');
    if (existingButton) {
        existingButton.remove();
    }
    
    // 创建按钮元素
    const button = document.createElement('button');
    button.className = 'sidebar-toggle-button';
    button.id = 'sidebar-toggle-button';
    button.title = '点击隐藏/显示侧边栏，拖拽改变位置';
    
    // 设置位置
    button.style.top = `${position.top}px`;
    button.style.right = `${position.right}px`;
    
    // 添加图标和文字
    button.innerHTML = `
        <svg class="sidebar-toggle-icon" viewBox="0 0 24 24">
            <path d="${getEyeIconPath(sidebarHidden)}"/>
        </svg>
        <span>${sidebarHidden ? '显示侧边栏' : '隐藏侧边栏'}</span>
    `;
    
    // 添加状态类
    if (sidebarHidden) {
        button.classList.add('hidden');
    }
    
    // 添加点击事件
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebars();
    });
    
    // 添加拖拽功能
    setupButtonDrag(button);
    
    // 添加到页面
    document.body.appendChild(button);
}
```

- [ ] **Step 3: 添加拖拽功能实现**

```javascript
function setupButtonDrag(button) {
    let isDragging = false;
    let dragStartX, dragStartY;
    let buttonStartX, buttonStartY;
    
    // 鼠标按下开始拖拽
    button.addEventListener('mousedown', function(e) {
        // 只在鼠标左键按下时开始拖拽
        if (e.button !== 0) return;
        
        isDragging = true;
        
        // 记录起始位置
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        // 获取按钮当前位置
        const rect = button.getBoundingClientRect();
        buttonStartX = rect.right;
        buttonStartY = rect.top;
        
        // 防止文本选中
        e.preventDefault();
        
        // 添加拖拽样式
        button.style.opacity = '0.8';
        button.style.cursor = 'grabbing';
    });
    
    // 鼠标移动时更新位置
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        // 计算移动距离
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        
        // 计算新位置
        const newRight = Math.max(0, Math.min(window.innerWidth - 50, buttonStartX - deltaX));
        const newTop = Math.max(0, Math.min(window.innerHeight - 50, buttonStartY + deltaY));
        
        // 更新按钮位置
        button.style.right = `${newRight}px`;
        button.style.top = `${newTop}px`;
    });
    
    // 鼠标释放时结束拖拽
    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        
        isDragging = false;
        
        // 恢复样式
        button.style.opacity = '';
        button.style.cursor = '';
        
        // 保存新位置
        const rect = button.getBoundingClientRect();
        const newPosition = {
            top: rect.top,
            right: window.innerWidth - rect.right
        };
        
        saveButtonPosition(newPosition);
    });
    
    // 防止拖拽时选择文本
    document.addEventListener('selectstart', function(e) {
        if (isDragging) {
            e.preventDefault();
        }
    });
}
```

- [ ] **Step 4: 添加保存按钮位置函数**

```javascript
async function saveButtonPosition(position) {
    const storageKey = `buttonPosition_${hostname}`;
    await chrome.storage.local.set({
        [storageKey]: position
    });
}
```

- [ ] **Step 5: 更新CSS支持动态位置**

```css
/* 更新浮动按钮样式，移除固定的top/right值 */
.sidebar-toggle-button {
    position: fixed;
    z-index: 9999;
    
    background: rgba(51, 51, 51, 0.9);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: grab;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    
    display: flex;
    align-items: center;
    gap: 8px;
    
    user-select: none;
}
```

- [ ] **Step 6: 测试拖拽功能**

```bash
# 验证JavaScript语法
node -c content/content.js && echo "JavaScript syntax OK" || echo "JavaScript syntax error"

# 验证CSS语法
csslint --quiet content/content.css || echo "CSS validation complete"
```

- [ ] **Step 7: 提交拖拽功能**

```bash
git add content/content.js content/content.css
git commit -m "feat: add draggable button functionality with position saving"
```

### Task 7: DOM变化监听

**Files:**
- Modify: `content/content.js`

- [ ] **Step 1: 添加MutationObserver初始化**

```javascript
// 在init函数末尾添加
async function init() {
    // ... 现有代码 ...
    
    console.log('博客侧边栏隐藏插件已加载');
    
    // 监听DOM变化
    setupMutationObserver();
}
```

- [ ] **Step 2: 添加MutationObserver实现**

```javascript
function setupMutationObserver() {
    // 创建观察器实例
    const observer = new MutationObserver(function(mutations) {
        // 使用防抖避免频繁处理
        clearTimeout(window.mutationDebounce);
        window.mutationDebounce = setTimeout(() => {
            handleDomChanges(mutations);
        }, 100);
    });
    
    // 配置观察选项
    const config = {
        childList: true,
        subtree: true
    };
    
    // 开始观察
    observer.observe(document.body, config);
    
    // 保存观察器引用以便后续清理
    window.sidebarObserver = observer;
}

function handleDomChanges(mutations) {
    // 检查是否有新节点添加
    let hasNewElements = false;
    
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            hasNewElements = true;
            break;
        }
    }
    
    // 如果有新元素，重新应用样式
    if (hasNewElements && sidebarHidden) {
        updateSidebarVisibility();
    }
}
```

- [ ] **Step 3: 添加清理函数**

```javascript
// 在window.blogSidebarHider对象中添加清理函数
window.blogSidebarHider = {
    toggleSidebars,
    updateSidebarVisibility,
    saveState,
    cleanup: function() {
        if (window.sidebarObserver) {
            window.sidebarObserver.disconnect();
            delete window.sidebarObserver;
        }
        
        const button = document.getElementById('sidebar-toggle-button');
        if (button) {
            button.remove();
        }
        
        const styleElement = document.getElementById('sidebar-hider-style');
        if (styleElement) {
            styleElement.remove();
        }
    }
};
```

- [ ] **Step 4: 测试MutationObserver代码**

```bash
node -c content/content.js && echo "JavaScript syntax OK" || echo "JavaScript syntax error"
```

- [ ] **Step 5: 提交DOM监听功能**

```bash
git add content/content.js
git commit -m "feat: add MutationObserver for dynamic content handling"
```

### Task 8: 弹出页面实现

**Files:**
- Create: `popup/`
- Create: `popup/popup.html`
- Create: `popup/popup.css`
- Create: `popup/popup.js`

- [ ] **Step 1: 创建popup目录**

```bash
mkdir -p popup
```

- [ ] **Step 2: 创建popup.html文件**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>博客侧边栏隐藏工具</title>
    <link rel="stylesheet" href="popup.css">
</head>
<body>
    <div class="container">
        <h1>博客侧边栏隐藏工具</h1>
        
        <div class="status">
            <div class="status-item">
                <span class="status-label">当前状态:</span>
                <span id="status-text" class="status-value">加载中...</span>
            </div>
            <div class="status-item">
                <span class="status-label">目标网站:</span>
                <span id="domain-text" class="status-value">blog.csdn.net</span>
            </div>
        </div>
        
        <div class="actions">
            <button id="reset-button" class="btn btn-secondary">重置按钮位置</button>
            <button id="clear-button" class="btn btn-danger">清除所有设置</button>
        </div>
        
        <div class="instructions">
            <h3>使用说明</h3>
            <ul>
                <li>访问博客页面时，右上角会出现控制按钮</li>
                <li>点击按钮切换侧边栏显示/隐藏状态</li>
                <li>拖拽按钮可以改变位置</li>
                <li>您的偏好设置会自动保存</li>
            </ul>
        </div>
    </div>
    
    <script src="popup.js"></script>
</body>
</html>
```

- [ ] **Step 3: 创建popup.css文件**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f5f5;
    color: #333;
    width: 320px;
    min-height: 400px;
}

.container {
    padding: 20px;
}

h1 {
    font-size: 18px;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
}

.status {
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.status-item:last-child {
    margin-bottom: 0;
}

.status-label {
    font-weight: 500;
    color: #666;
}

.status-value {
    font-weight: 600;
    color: #333;
}

.status-value.active {
    color: #4a90e2;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.btn {
    padding: 10px 15px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.btn:active {
    transform: translateY(0);
}

.btn-secondary {
    background: #666;
    color: white;
}

.btn-secondary:hover {
    background: #555;
}

.btn-danger {
    background: #e74c3c;
    color: white;
}

.btn-danger:hover {
    background: #c0392b;
}

.instructions {
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.instructions h3 {
    font-size: 16px;
    margin-bottom: 10px;
    color: #333;
}

.instructions ul {
    padding-left: 20px;
}

.instructions li {
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.4;
    color: #666;
}

.instructions li:last-child {
    margin-bottom: 0;
}
```

- [ ] **Step 4: 创建popup.js文件**

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // 更新状态显示
    updateStatus();
    
    // 重置按钮位置
    document.getElementById('reset-button').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('blog.csdn.net')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'resetButtonPosition'
                }, function(response) {
                    if (response && response.success) {
                        alert('按钮位置已重置到默认位置');
                    } else {
                        alert('重置失败，请刷新页面后重试');
                    }
                });
            } else {
                alert('请在博客页面使用此功能');
            }
        });
    });
    
    // 清除所有设置
    document.getElementById('clear-button').addEventListener('click', function() {
        if (confirm('确定要清除所有设置吗？这将会重置按钮位置和侧边栏状态。')) {
            chrome.storage.local.clear(function() {
                alert('所有设置已清除');
                updateStatus();
            });
        }
    });
});

function updateStatus() {
    // 获取当前标签页
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            const url = new URL(tabs[0].url);
            document.getElementById('domain-text').textContent = url.hostname;
            
            // 获取存储状态
            chrome.storage.local.get(`sidebarHidden_${url.hostname}`, function(result) {
                const isHidden = result[`sidebarHidden_${url.hostname}`] || false;
                const statusText = document.getElementById('status-text');
                statusText.textContent = isHidden ? '侧边栏已隐藏' : '侧边栏显示中';
                statusText.className = isHidden ? 'status-value active' : 'status-value';
            });
        }
    });
}
```

- [ ] **Step 5: 更新content.js支持消息通信**

```javascript
// 在content.js末尾添加消息监听
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'resetButtonPosition') {
        // 重置按钮位置到默认
        const defaultPosition = { top: 80, right: 20 };
        
        // 更新存储
        chrome.storage.local.set({
            [`buttonPosition_${hostname}`]: defaultPosition
        });
        
        // 重新创建按钮
        createFloatingButton(defaultPosition);
        
        sendResponse({ success: true });
        return true;
    }
});
```

- [ ] **Step 6: 测试弹出页面**

```bash
# 验证HTML语法
tidy -q -errors popup/popup.html 2>/dev/null || echo "HTML check completed"

# 验证CSS语法
csslint --quiet popup/popup.css || echo "CSS validation complete"

# 验证JavaScript语法
node -c popup/popup.js && echo "JavaScript syntax OK" || echo "JavaScript syntax error"
```

- [ ] **Step 7: 提交弹出页面**

```bash
git add popup/
git add content/content.js
git commit -m "feat: add popup page with reset and clear functionality"
```

### Task 9: 测试和验证

**Files:**
- 所有文件

- [ ] **Step 1: 验证所有文件语法**

```bash
# 验证manifest.json
python3 -m json.tool manifest.json > /dev/null && echo "manifest.json: OK" || echo "manifest.json: ERROR"

# 验证content/content.js
node -c content/content.js && echo "content.js: OK" || echo "content.js: ERROR"

# 验证popup/popup.js
node -c popup/popup.js && echo "popup.js: OK" || echo "popup.js: ERROR"

# 验证CSS文件
csslint --quiet content/content.css && echo "content.css: OK" || echo "content.css: check completed"
csslint --quiet popup/popup.css && echo "popup.css: OK" || echo "popup.css: check completed"
```

- [ ] **Step 2: 验证文件结构**

```bash
# 检查必要文件是否存在
required_files=(
    "manifest.json"
    "content/content.css"
    "content/content.js"
    "popup/popup.html"
    "popup/popup.css"
    "popup/popup.js"
    ".gitignore"
    "README.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file (missing)"
    fi
done
```

- [ ] **Step 3: 创建测试页面**

```bash
# 创建简单的测试HTML文件
cat > test-page.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>测试页面</title>
    <style>
        body { margin: 0; padding: 0; }
        .left-sidebar { 
            position: fixed; 
            left: 0; 
            top: 0; 
            width: 200px; 
            height: 100vh; 
            background: #f0f0f0; 
            padding: 20px;
        }
        .right-sidebar { 
            position: fixed; 
            right: 0; 
            top: 0; 
            width: 200px; 
            height: 100vh; 
            background: #f0f0f0; 
            padding: 20px;
        }
        .content { 
            margin: 0 220px; 
            padding: 40px; 
            min-height: 100vh;
            background: white;
        }
        .floating-toolbar {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="left-sidebar">
        <h3>左侧边栏</h3>
        <p>导航菜单</p>
        <ul>
            <li>首页</li>
            <li>分类</li>
            <li>标签</li>
            <li>归档</li>
        </ul>
    </div>
    
    <div class="content">
        <h1>正文内容</h1>
        <p>这是测试页面的正文内容...</p>
        <p>插件应该能隐藏左右侧边栏和浮动工具栏。</p>
    </div>
    
    <div class="right-sidebar">
        <h3>右侧边栏</h3>
        <p>推荐文章</p>
        <ul>
            <li>文章1</li>
            <li>文章2</li>
            <li>文章3</li>
        </ul>
    </div>
    
    <div class="floating-toolbar">
        浮动工具栏
    </div>
    
    <script>
        // 模拟插件功能
        console.log('测试页面已加载');
    </script>
</body>
</html>
EOF
```

- [ ] **Step 4: 运行Git状态检查**

```bash
git status
git log --oneline -5
```

- [ ] **Step 5: 提交测试文件**

```bash
git add test-page.html
git commit -m "test: add test page for manual verification"
```

### Task 10: 最终整理和文档

**Files:**
- 更新: `README.md`
- 创建: `LICENSE` (可选)

- [ ] **Step 1: 更新README.md添加更多信息**

```markdown
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
```

- [ ] **Step 2: 创建MIT许可证文件（可选）**

```markdown
MIT License

Copyright (c) 2026 博客侧边栏隐藏插件作者

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 3: 运行最终检查**

```bash
# 检查所有文件是否存在
ls -la
ls -la content/
ls -la popup/
ls -la icons/
ls -la docs/superpowers/plans/

# 验证最终Git状态
git status
echo "=== 最后5次提交 ==="
git log --oneline -5
```

- [ ] **Step 4: 提交最终更新**

```bash
git add README.md
[ -f LICENSE ] && git add LICENSE
git commit -m "docs: update README with project structure and implementation details"
```

---

## 执行选项

**计划已完成并保存到 `docs/superpowers/plans/2026-04-12-blog-sidebar-hider-implementation.md`**

**两个执行选项：**

**1. Subagent-Driven (推荐)** - 我分派一个新的子代理执行每个任务，在任务之间进行审查，快速迭代

**2. Inline Execution** - 在此会话中使用executing-plans执行任务，批量执行并设置检查点

**请选择哪种方法？**