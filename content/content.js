// 博客侧边栏隐藏插件 - 主逻辑
(function() {
    'use strict';

    // 配置常量
    const CSS_CLASS_NAME = 'sidebar-hidden';
    const STORAGE_PREFIX = 'sidebarHidden_';
    const BUTTON_POSITION_PREFIX = 'buttonPosition_';

    // 状态变量
    let isSidebarHidden = false;
    const currentHostname = window.location.hostname;
    const storageKey = `${STORAGE_PREFIX}${currentHostname}`;
    const buttonPositionKey = `${BUTTON_POSITION_PREFIX}${currentHostname}`;

    /**
     * 获取眼睛图标路径
     * @param {boolean} isHidden - 侧边栏是否隐藏
     * @returns {string} SVG路径数据
     */
    function getEyeIconPath(isHidden) {
        // 睁眼图标路径（显示状态）
        const openEye = "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z";

        // 闭眼图标路径（隐藏状态）
        const closedEye = "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.35 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z";

        return isHidden ? closedEye : openEye;
    }

    /**
     * 初始化函数 - 从存储加载状态并应用样式
     * @async
     */
    async function init() {
        try {
            // 从存储加载状态
            const result = await chrome.storage.local.get([storageKey, buttonPositionKey]);

            // 验证并设置状态
            const storedValue = result[storageKey];
            if (typeof storedValue === 'boolean') {
                isSidebarHidden = storedValue;
            } else {
                // 无效存储值，使用默认值并清理存储
                isSidebarHidden = false;
                console.warn(`Invalid stored value for ${storageKey}: ${storedValue}. Using default.`);
                await cleanupInvalidStorage();
            }

            // 加载按钮位置
            let buttonPosition = { top: 80, right: 20 }; // 默认位置
            const storedPosition = result[buttonPositionKey];
            if (storedPosition && typeof storedPosition === 'object' &&
                typeof storedPosition.top === 'number' &&
                typeof storedPosition.right === 'number') {
                buttonPosition = storedPosition;
            } else if (storedPosition !== undefined) {
                // 无效位置数据，清理存储
                console.warn(`Invalid button position stored for ${buttonPositionKey}:`, storedPosition);
                await chrome.storage.local.remove(buttonPositionKey);
            }

            // 应用隐藏样式
            updateSidebarVisibility();

            // 创建浮动按钮
            createFloatingButton(buttonPosition);

            console.log('博客侧边栏隐藏插件已加载');

            // 监听DOM变化
            setupMutationObserver();
        } catch (error) {
            console.error('初始化失败:', error);
            // 出错时使用默认状态
            isSidebarHidden = false;
            updateSidebarVisibility();
        }
    }

    /**
     * 清理无效的存储数据
     * @async
     */
    async function cleanupInvalidStorage() {
        try {
            await chrome.storage.local.remove(storageKey);
            console.log(`清理了无效的存储键: ${storageKey}`);
        } catch (error) {
            console.error('清理存储失败:', error);
        }
    }

    /**
     * 切换侧边栏显示/隐藏
     */
    function toggleSidebars() {
        isSidebarHidden = !isSidebarHidden;
        updateSidebarVisibility();
        saveState();
        updateButtonState();
    }

    /**
     * 更新侧边栏可见性 - 使用CSS类名控制样式
     */
    function updateSidebarVisibility() {
        try {
            if (isSidebarHidden) {
                // 添加CSS类名以隐藏侧边栏
                document.documentElement.classList.add(CSS_CLASS_NAME);
            } else {
                // 移除CSS类名以显示侧边栏
                document.documentElement.classList.remove(CSS_CLASS_NAME);
            }
        } catch (error) {
            console.error('更新侧边栏可见性失败:', error);
        }
    }

    /**
     * 保存状态到存储
     * @async
     */
    async function saveState() {
        try {
            await chrome.storage.local.set({
                [storageKey]: isSidebarHidden
            });
        } catch (error) {
            console.error('保存状态失败:', error);
            // 可以在这里添加重试逻辑或用户通知
        }
    }

    /**
     * 创建浮动控制按钮
     * @param {Object} position - 按钮位置 { top: number, right: number }
     */
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

        // 设置按钮位置
        button.style.top = `${position.top}px`;
        button.style.right = `${position.right}px`;

        // 添加图标和文字
        button.innerHTML = `
            <svg class="sidebar-toggle-icon" viewBox="0 0 24 24">
                <path d="${getEyeIconPath(isSidebarHidden)}"/>
            </svg>
            <span>${isSidebarHidden ? '显示侧边栏' : '隐藏侧边栏'}</span>
        `;

        // 添加状态类
        if (isSidebarHidden) {
            button.classList.add('hidden');
        }

        // 添加点击事件
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebars();
        });

        // 设置拖拽功能
        setupButtonDrag(button);

        // 添加到页面
        document.body.appendChild(button);
    }

    /**
     * 设置按钮拖拽功能
     * @param {HTMLElement} button - 按钮元素
     */
    function setupButtonDrag(button) {
        let isDragging = false;
        let startX, startY;
        let initialTop, initialRight;

        // 鼠标按下事件
        button.addEventListener('mousedown', function(e) {
            // 防止文本选中
            e.preventDefault();
            e.stopPropagation();

            isDragging = true;

            // 记录初始位置
            startX = e.clientX;
            startY = e.clientY;

            // 获取按钮当前位置
            const computedStyle = window.getComputedStyle(button);
            initialTop = parseInt(computedStyle.top) || 0;
            initialRight = parseInt(computedStyle.right) || 0;

            // 添加拖拽样式
            button.style.opacity = '0.8';
            button.style.cursor = 'grabbing';

            // 防止文本选中
            document.body.style.userSelect = 'none';
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            // 计算移动距离
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // 计算新位置
            let newRight = initialRight - deltaX; // 注意：right坐标与鼠标移动方向相反
            let newTop = initialTop + deltaY;

            // 限制按钮在窗口范围内
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const buttonWidth = button.offsetWidth;
            const buttonHeight = button.offsetHeight;

            // 确保按钮不会超出窗口边界
            newRight = Math.max(0, Math.min(newRight, windowWidth - buttonWidth));
            newTop = Math.max(0, Math.min(newTop, windowHeight - buttonHeight));

            // 应用新位置
            button.style.right = `${newRight}px`;
            button.style.top = `${newTop}px`;
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', function(e) {
            if (!isDragging) return;

            isDragging = false;

            // 恢复样式
            button.style.opacity = '';
            button.style.cursor = 'grab';
            document.body.style.userSelect = '';

            // 保存新位置
            const newTop = parseInt(button.style.top) || 0;
            const newRight = parseInt(button.style.right) || 0;
            saveButtonPosition({ top: newTop, right: newRight });
        });

        // 鼠标离开窗口时停止拖拽
        document.addEventListener('mouseleave', function(e) {
            if (isDragging) {
                isDragging = false;
                button.style.opacity = '';
                button.style.cursor = 'grab';
                document.body.style.userSelect = '';
            }
        });
    }

    /**
     * 保存按钮位置到存储
     * @param {Object} position - 按钮位置 { top: number, right: number }
     * @async
     */
    async function saveButtonPosition(position) {
        try {
            await chrome.storage.local.set({
                [buttonPositionKey]: position
            });
        } catch (error) {
            console.error('保存按钮位置失败:', error);
        }
    }

    /**
     * 更新按钮状态（图标、文字和样式）
     */
    function updateButtonState() {
        try {
            const button = document.getElementById('sidebar-toggle-button');
            if (button) {
                // 更新图标
                const icon = button.querySelector('.sidebar-toggle-icon');
                const path = icon.querySelector('path');
                path.setAttribute('d', getEyeIconPath(isSidebarHidden));

                // 更新文字
                const text = button.querySelector('span');
                text.textContent = isSidebarHidden ? '显示侧边栏' : '隐藏侧边栏';

                // 更新状态类
                if (isSidebarHidden) {
                    button.classList.add('hidden');
                } else {
                    button.classList.remove('hidden');
                }
            }
        } catch (error) {
            console.error('更新按钮状态失败:', error);
        }
    }

    /**
     * 设置DOM变化监听器
     */
    function setupMutationObserver() {
        try {
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

            console.log('DOM变化监听器已启动');
        } catch (error) {
            console.error('设置DOM变化监听器失败:', error);
        }
    }

    /**
     * 处理DOM变化
     * @param {MutationRecord[]} mutations - 变化记录数组
     */
    function handleDomChanges(mutations) {
        try {
            // 检查是否有新节点添加
            let hasNewElements = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    hasNewElements = true;
                    break;
                }
            }

            // 如果有新元素且侧边栏处于隐藏状态，重新应用样式
            if (hasNewElements && isSidebarHidden) {
                updateSidebarVisibility();
            }
        } catch (error) {
            console.error('处理DOM变化失败:', error);
        }
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
        saveState,
        createFloatingButton,
        updateButtonState,
        saveButtonPosition,
        getState: () => isSidebarHidden,
        setState: (state) => {
            if (typeof state === 'boolean') {
                isSidebarHidden = state;
                updateSidebarVisibility();
                saveState();
            } else {
                console.error('setState: 参数必须是布尔值');
            }
        },
        cleanup: function() {
            try {
                // 清理DOM变化监听器
                if (window.sidebarObserver) {
                    window.sidebarObserver.disconnect();
                    delete window.sidebarObserver;
                }

                // 清理防抖定时器
                if (window.mutationDebounce) {
                    clearTimeout(window.mutationDebounce);
                    delete window.mutationDebounce;
                }

                // 移除浮动按钮
                const button = document.getElementById('sidebar-toggle-button');
                if (button) {
                    button.remove();
                }

                // 移除CSS类名
                document.documentElement.classList.remove(CSS_CLASS_NAME);

                console.log('博客侧边栏隐藏插件已清理');
            } catch (error) {
                console.error('清理插件失败:', error);
            }
        }
    };

    // 消息通信处理
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'resetButtonPosition') {
            // 重置按钮位置到默认
            const defaultPosition = { top: 80, right: 20 };

            // 更新存储
            chrome.storage.local.set({
                [buttonPositionKey]: defaultPosition
            });

            // 重新创建按钮
            createFloatingButton(defaultPosition);

            sendResponse({ success: true });
            return true;
        }
    });
})();