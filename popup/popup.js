console.log('popup.js loaded');
console.log(chrome);
document.addEventListener('DOMContentLoaded', function() {
    console.log('popup.js loaded inner');
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
        console.log(tabs);
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