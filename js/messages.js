document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-btn');
    const chatContent = document.querySelector('.detail-content');

    // 发送消息函数
    function sendMessage() {
        const text = messageInput.value.trim();
        
        // 验证消息不为空
        if (!text) return;

        // 创建新消息元素
        const messageHTML = `
            <div class="chat-message sent">
                <div class="message-bubble">
                    ${text}
                </div>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;

        // 添加消息到聊天界面
        chatContent.insertAdjacentHTML('beforeend', messageHTML);

        // 清空输入框
        messageInput.value = '';

        // 滚动到最新消息
        chatContent.scrollTop = chatContent.scrollHeight;

        // 这里可以添加发送到服务器的逻辑
        // sendToServer(text);
    }

    // 获取当前时间
    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    // 绑定发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);

    // 绑定回车键发送
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // 阻止默认的换行行为
            sendMessage();
        }
    });

    // 输入框获得焦点
    messageInput.focus();

    // 文件上传处理
    const fileBtn = document.getElementById('fileBtn');
    const fileInput = document.getElementById('fileInput');

    fileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // 创建文件消息
            const fileSize = formatFileSize(file.size);
            const messageHTML = `
                <div class="chat-message sent">
                    <div class="message-bubble">
                        <div class="message-file">
                            <i class="fas fa-file file-icon"></i>
                            <div class="file-info">
                                <div class="file-name">${file.name}</div>
                                <div class="file-size">${fileSize}</div>
                            </div>
                            <button class="download-btn">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
            `;
            chatContent.insertAdjacentHTML('beforeend', messageHTML);
            chatContent.scrollTop = chatContent.scrollHeight;
        }
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 表情选择功能
    const emojiBtn = document.getElementById('emojiBtn');
    // 这里可以使用第三方表情库，如 emoji-picker-element
    emojiBtn.addEventListener('click', () => {
        // 显示表情选择面板
        // 可以使用 popperjs 实现弹出定位
        alert('表情功能开发中...');
    });

    // 添加默认头像URL
    const DEFAULT_AVATARS = {
        teacher: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMxODkwZmYiLz48dGV4dCB4PSIyMCIgeT0iMjAiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxTZWdvZSBVSSxSb2JvdG8sSGVsdmV0aWNhIE5ldWUiPuS4uTwvdGV4dD48L3N2Zz4=',
        student: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiM1MmM0MWEiLz48dGV4dCB4PSIyMCIgeT0iMjAiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxTZWdvZSBVSSxSb2JvdG8sSGVsdmV0aWNhIE5ldWUiPuWtpjwvdGV4dD48L3N2Zz4='
    };

    // 修改头像加载失败处理函数
    function handleAvatarError(event) {
        const img = event.target;
        const name = img.alt;
        const role = name.includes('老师') ? 'teacher' : 'student';
        
        // 使用默认头像
        img.src = DEFAULT_AVATARS[role];
        
        // 移除错误事件监听，防止循环触发
        img.removeEventListener('error', handleAvatarError);
    }

    // 为所有头像添加错误处理
    document.querySelectorAll('.message-avatar img, .contact-avatar img').forEach(img => {
        img.addEventListener('error', handleAvatarError);
    });
});