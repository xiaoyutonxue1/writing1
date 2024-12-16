document.addEventListener('DOMContentLoaded', function() {
    // 消息类型切换
    const messageTypes = document.querySelectorAll('.message-type');
    messageTypes.forEach(type => {
        type.addEventListener('click', function() {
            messageTypes.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            // 这里可以添加加载对应类型消息的逻辑
        });
    });

    // 消息项点击事件
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            messageItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            this.classList.remove('unread');
            // 在移动端显示消息详情
            const messageDetail = document.querySelector('.message-detail');
            messageDetail.classList.add('active');
        });
    });

    // 发送消息
    const sendBtn = document.querySelector('.send-btn');
    const messageInput = document.querySelector('.detail-input textarea');
    
    sendBtn.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message) {
            // 创建新消息元素
            const chatMessage = document.createElement('div');
            chatMessage.className = 'chat-message sent';
            chatMessage.innerHTML = `
                <div class="message-bubble">
                    ${message}
                </div>
                <span class="message-time">${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
            `;
            
            // 添加到聊天区域
            const detailContent = document.querySelector('.detail-content');
            detailContent.appendChild(chatMessage);
            detailContent.scrollTop = detailContent.scrollHeight;
            
            // 清空输入框
            messageInput.value = '';
        }
    });

    // 回车发送消息
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // 响应式处理
    function handleResponsive() {
        const width = window.innerWidth;
        const messagesLayout = document.querySelector('.messages-layout');
        
        if (width <= 768) {
            messagesLayout.classList.add('mobile');
        } else {
            messagesLayout.classList.remove('mobile');
            // 重置移动端状态
            document.querySelector('.message-sidebar').classList.remove('active');
            document.querySelector('.message-detail').classList.remove('active');
        }
    }

    window.addEventListener('resize', handleResponsive);
    handleResponsive();
});