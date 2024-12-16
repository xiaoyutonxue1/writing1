document.addEventListener('DOMContentLoaded', function() {
    // 消息过滤功能
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const filterValue = this.value;
            const messageItems = document.querySelectorAll('.message-item');
            
            messageItems.forEach(item => {
                const messageType = item.querySelector('.message-type').classList[1];
                if (filterValue === 'all' || messageType === filterValue) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // 消息项点击事件
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有消息项的选中状态
            messageItems.forEach(i => i.classList.remove('active'));
            // 添加当前消息项的选中状态
            this.classList.add('active');
            // 移除未读状态
            this.classList.remove('unread');
            this.querySelector('.unread-badge')?.remove();

            // 在移动端显示消息详情
            const messageDetail = document.querySelector('.message-detail');
            messageDetail.classList.add('active');

            // 更新消息详情内容
            updateMessageDetail(this);
        });
    });

    // 发送消息功能
    const chatInput = document.querySelector('.chat-input textarea');
    const sendBtn = document.querySelector('.send-btn');

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            const chatMessages = document.querySelector('.chat-messages');
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message sent';
            messageElement.innerHTML = `
                <div class="message-bubble">
                    ${message}
                </div>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            `;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            chatInput.value = '';
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // 更新消息详情
    function updateMessageDetail(messageItem) {
        const senderName = messageItem.querySelector('.sender-name').textContent;
        const senderAvatar = messageItem.querySelector('.sender-avatar img')?.src;
        
        const detailHeader = document.querySelector('.contact-info');
        if (detailHeader) {
            detailHeader.querySelector('h3').textContent = senderName;
            if (senderAvatar) {
                detailHeader.querySelector('img').src = senderAvatar;
            }
        }
    }

    // 响应式处理
    function handleResponsive() {
        const width = window.innerWidth;
        const messagesLayout = document.querySelector('.messages-layout');
        
        if (width <= 768) {
            messagesLayout.classList.add('mobile');
        } else {
            messagesLayout.classList.remove('mobile');
            document.querySelector('.message-detail').classList.remove('active');
        }
    }

    window.addEventListener('resize', handleResponsive);
    handleResponsive();

    // 返回按钮（移动端）
    document.addEventListener('click', function(e) {
        if (e.target.closest('.back-btn')) {
            document.querySelector('.message-detail').classList.remove('active');
        }
    });
});