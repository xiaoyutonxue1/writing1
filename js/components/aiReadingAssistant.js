// AI Reading Assistant Component
export function createAIReadingAssistant() {
    const assistant = document.createElement('div');
    assistant.className = 'ai-reading-assistant';
    assistant.innerHTML = `
        <button class="ai-toggle">
            <i class="fas fa-robot"></i>
        </button>
        <div class="ai-chat-panel">
            <div class="ai-header">
                <h3><i class="fas fa-robot"></i> AI阅读助手</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="quick-actions">
                <button class="action-btn" data-action="introduce">
                    <i class="fas fa-book-open"></i> 跟我介绍一下这篇文章
                </button>
                <button class="action-btn" data-action="quiz">
                    <i class="fas fa-question-circle"></i> 我读完了，可以考考我
                </button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <input type="text" placeholder="输入您的问题...">
                <button class="send-btn"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    return assistant;
}

export function initializeAIReadingAssistant(articleTitle, articleContent) {
    const assistant = document.querySelector('.ai-reading-assistant');
    if (!assistant) return;

    const toggleBtn = assistant.querySelector('.ai-toggle');
    const chatPanel = assistant.querySelector('.ai-chat-panel');
    const closeBtn = assistant.querySelector('.close-btn');
    const actionBtns = assistant.querySelectorAll('.action-btn');
    const chatInput = assistant.querySelector('.chat-input input');
    const sendBtn = assistant.querySelector('.send-btn');
    const messagesContainer = assistant.querySelector('.chat-messages');

    // Toggle chat panel
    toggleBtn.addEventListener('click', () => {
        chatPanel.classList.toggle('show');
    });

    closeBtn.addEventListener('click', () => {
        chatPanel.classList.remove('show');
    });

    // Quick actions
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'introduce') {
                addMessage('ai', `让我来为您介绍《${articleTitle}》这篇文章。这是一篇精彩的作品，主要讲述了...`);
                // 这里可以根据文章内容生成更详细的介绍
            } else if (action === 'quiz') {
                startQuiz();
            }
        });
    });

    // Send message
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage('user', text);
        chatInput.value = '';

        // 模拟AI回复
        setTimeout(() => {
            const response = generateAIResponse(text);
            addMessage('ai', response);
        }, 1000);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Start quiz
    function startQuiz() {
        const questions = generateQuestions();
        let currentQuestion = 0;

        function showQuestion() {
            const question = questions[currentQuestion];
            let optionsHtml = question.options.map((option, index) => 
                `<button class="quiz-option" data-index="${index}">${option}</button>`
            ).join('');

            addMessage('ai', `
                <div class="quiz-question">
                    <p>${question.text}</p>
                    <div class="quiz-options">
                        ${optionsHtml}
                    </div>
                </div>
            `);

            // Add click handlers to options
            const options = messagesContainer.querySelectorAll('.quiz-option');
            options.forEach(option => {
                option.addEventListener('click', () => {
                    const index = parseInt(option.dataset.index);
                    const isCorrect = index === question.correct;
                    
                    options.forEach(opt => opt.disabled = true);
                    option.classList.add(isCorrect ? 'correct' : 'incorrect');

                    setTimeout(() => {
                        addMessage('ai', isCorrect ? 
                            '回答正确！让我们继续下一题。' : 
                            `这题答错了。正确答案是：${question.options[question.correct]}`
                        );

                        currentQuestion++;
                        if (currentQuestion < questions.length) {
                            setTimeout(showQuestion, 1500);
                        } else {
                            addMessage('ai', '测试完成！您已经很好地理解了文章的内容。');
                        }
                    }, 1000);
                });
            });
        }

        showQuestion();
    }

    // Generate quiz questions based on article content
    function generateQuestions() {
        // 这里应该根据文章内容动态生成问题
        return [
            {
                text: "文章的主要主题是什么？",
                options: ["春天的景色", "夏天的热闹", "秋天的收获"],
                correct: 0
            },
            {
                text: "作者使用了什么写作手法？",
                options: ["拟人", "比喻", "夸张"],
                correct: 1
            }
        ];
    }

    // Generate AI response based on user input
    function generateAIResponse(userInput) {
        // 这里应该实现更智能的响应生成逻辑
        return "我理解您的问题。根据文章内容，...";
    }
}