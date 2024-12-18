// AI Assistant functionality
export function createAIAssistant() {
    return `
        <div class="ai-assistant">
            <div class="ai-header">
                <h3><i class="fas fa-robot"></i> AI学习助手</h3>
                <button class="minimize-btn"><i class="fas fa-minus"></i></button>
            </div>
            <div class="ai-chat">
                <div class="chat-messages" id="aiMessages">
                    <div class="message ai">
                        您好！我是您的AI学习助手。在观看视频时有任何问题都可以随时问我。
                    </div>
                </div>
                <div class="chat-input">
                    <textarea id="aiInput" placeholder="输入您的问题..."></textarea>
                    <button id="sendQuestion">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function initializeAIAssistant() {
    const sendButton = document.getElementById('sendQuestion');
    const input = document.getElementById('aiInput');
    const messages = document.getElementById('aiMessages');

    if (!sendButton || !input || !messages) return;

    // Send message function
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Add user message
        messages.innerHTML += `
            <div class="message user">
                ${text}
            </div>
        `;

        // Simulate AI response
        setTimeout(() => {
            messages.innerHTML += `
                <div class="message ai">
                    感谢您的提问！我会根据视频内容为您解答这个问题。
                </div>
            `;
            messages.scrollTop = messages.scrollHeight;
        }, 1000);

        input.value = '';
        messages.scrollTop = messages.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Minimize functionality
    const minimizeBtn = document.querySelector('.minimize-btn');
    const aiAssistant = document.querySelector('.ai-assistant');
    
    minimizeBtn?.addEventListener('click', () => {
        aiAssistant.classList.toggle('minimized');
        minimizeBtn.innerHTML = aiAssistant.classList.contains('minimized') 
            ? '<i class="fas fa-plus"></i>' 
            : '<i class="fas fa-minus"></i>';
    });
}