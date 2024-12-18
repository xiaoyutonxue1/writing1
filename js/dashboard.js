document.addEventListener('DOMContentLoaded', function() {
    // Initialize category cards
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        const header = card.querySelector('h3');
        const list = card.querySelector('ul');
        
        // Initial state: collapsed
        list.style.maxHeight = '0px';
        
        header.addEventListener('click', () => {
            const isExpanded = header.classList.contains('expanded');
            
            // Collapse all other categories
            categoryCards.forEach(otherCard => {
                const otherHeader = otherCard.querySelector('h3');
                const otherList = otherCard.querySelector('ul');
                
                if (otherCard !== card) {
                    otherHeader.classList.remove('expanded');
                    otherList.classList.remove('expanded');
                    otherList.style.maxHeight = '0px';
                }
            });
            
            // Toggle current category
            header.classList.toggle('expanded');
            list.classList.toggle('expanded');
            
            if (!isExpanded) {
                list.style.maxHeight = list.scrollHeight + 'px';
            } else {
                list.style.maxHeight = '0px';
            }
        });
    });

    // Assignment details modal
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const assignmentCard = this.closest('.assignment-card');
            const title = assignmentCard.querySelector('h3').textContent;
            const deadline = assignmentCard.querySelector('.deadline').textContent;
            const description = assignmentCard.querySelector('.description').textContent;
            showAssignmentModal(title, deadline, description);
        });
    });
});

function showAssignmentModal(title, deadline, description) {
    const modal = document.createElement('div');
    modal.className = 'assignment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="assignment-details">
                    <div class="detail-item">
                        <h3>作业要求</h3>
                        <p>${description}</p>
                        <p>${deadline}</p>
                    </div>
                    <div class="detail-item">
                        <h3>参考范文</h3>
                        <div class="example-essays">
                            <div class="essay-card" onclick="showEssay('春天的早晨')">
                                <h4>春天的早晨</h4>
                                <p>清晨的阳光洒在窗台上，整个世界都笼罩在金色的光芒中...</p>
                                <div class="essay-meta">
                                    <span><i class="fas fa-star"></i> 优秀范文</span>
                                    <span><i class="fas fa-eye"></i> 查看全文</span>
                                </div>
                            </div>
                            <div class="essay-card" onclick="showEssay('难忘的一天')">
                                <h4>难忘的一天</h4>
                                <p>那是一个特别的日子，让我永远难以忘怀...</p>
                                <div class="essay-meta">
                                    <span><i class="fas fa-star"></i> 优秀范文</span>
                                    <span><i class="fas fa-eye"></i> 查看全文</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close button event
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Show full article modal
function showEssay(title) {
    const modal = document.createElement('div');
    modal.className = 'article-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="article-content">
                    ${getFullArticleContent(title).split('\n\n').map(p => `<p>${p.trim()}</p>`).join('')}
                </div>
            </div>
        </div>

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
                <button class="action-btn" data-action="analyze">
                    <i class="fas fa-chart-line"></i> 我读完了，下面我来分析一下这篇文章
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

    document.body.appendChild(modal);

    // Initialize AI assistant functionality
    initializeAIAssistant(modal, title);

    // Close button event
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function initializeAIAssistant(modal, articleTitle) {
    const aiToggle = modal.querySelector('.ai-toggle');
    const aiPanel = modal.querySelector('.ai-chat-panel');
    const aiCloseBtn = aiPanel.querySelector('.close-btn');
    const actionBtns = aiPanel.querySelectorAll('.action-btn');
    const chatInput = aiPanel.querySelector('input');
    const sendBtn = aiPanel.querySelector('.send-btn');
    const messagesContainer = aiPanel.querySelector('.chat-messages');

    // Toggle AI panel
    aiToggle.addEventListener('click', () => {
        aiPanel.classList.toggle('show');
    });

    aiCloseBtn.addEventListener('click', () => {
        aiPanel.classList.remove('show');
    });

    // Quick actions
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'introduce') {
                addMessage('ai', `让我来为您介绍《${articleTitle}》这篇文章。

这是一篇精彩的作品，主要讲述了自然之美与生活感悟。作者通过细腻的笔触，描绘了一个生机勃勃的春天早晨，展现了大自然的神奇魅力。

文章的亮点在于：
1. 生动的感官描写，让读者仿佛置身其中
2. 优美的语言表达，营造出诗意的意境
3. 深刻的生活感悟，引发读者思考

这篇文章的写作技巧值得学习，特别是在细节描写和情感表达方面。`);
            } else if (action === 'analyze') {
                addMessage('ai', `请分享您对《${articleTitle}》的分析和感悟，可以从以下几个方面入手：

1. 文章的主题思想是什么？
2. 作者使用了哪些写作手法？
3. 文章的结构安排如何？
4. 语言运用有什么特点？
5. 最打动您的段落是哪里？为什么？

请输入您的分析，我会为您点评并提供建议。`);

                // Update input placeholder
                chatInput.placeholder = "请输入您的分析，我来为您点评...";
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

        // Generate AI response based on user's analysis
        setTimeout(() => {
            const response = generateAnalysisFeedback(text, articleTitle);
            addMessage('ai', response);
        }, 1000);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function generateAnalysisFeedback(userAnalysis, title) {
        // Analyze user's input and provide constructive feedback
        const feedback = `您的分析很有见地！让我来补充几点观察：

1. 主题把握：
   您提到的观点很准确，同时我建议可以进一步思考作者的深层寓意。

2. 写作手法：
   您分析的很到位！除了您提到的，文中还运用了比喻、拟人等修辞手法，使文章更加生动。

3. 结构分析：
   您对文章结构的理解很清晰。文章确实采用了总分总的结构，层次分明。

4. 语言特色：
   您注意到了文章的语言优美，这正是这篇文章的一大特色。作者的用词确实很讲究。

5. 创新建议：
   - 可以尝试从多角度解读文章主题
   - 在分析时可以结合具体例子
   - 可以联系现实生活，谈谈感悟

总的来说，您的分析很全面，思路清晰。继续保持这种细致的阅读习惯！`;

        return feedback;
    }

    function startQuiz() {
        const questions = [
            {
                text: "文章的主要主题是什么？",
                options: ["春天的景色", "夏天的热闹", "秋天的收获"],
                correct: 0
            },
            {
                text: "作者使用了什么写作手法？",
                options: ["拟人", "比喻", "夸张"],
                correct: 1
            },
            {
                text: "文章的结构特点是什么？",
                options: ["总分总", "并列式", "时序式"],
                correct: 0
            }
        ];

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
}

// Get full article content
function getFullArticleContent(title) {
    // Mock article content data
    const articles = {
        '春天的早晨': `清晨的阳光洒在窗台上，整个世界都笼罩在金色的光芒中。远处的小鸟在枝头欢快地歌唱，为这美好的早晨增添了一份生机。

我推开窗户，深深地吸了一口气，春天的气息扑面而来。花园里的花儿竞相开放，蝴蝶在花丛中翩翩起舞，构成了一幅美丽的画卷。

漫步在小径上，我感受着春天的温暖。嫩绿的草芽从泥土中探出头来，像是在向世界打招呼。树枝上的新芽正在舒展，仿佛在伸着懒腰。空气中弥漫着泥土和花草的清新气息，让人心旷神怡。

远处的山峦笼罩在薄薄的晨雾中，如同一幅水墨画。阳光穿透雾气，在空中形成了一道道金色的光束，宛如天使的光芒。小溪欢快地流淌，发出清脆的声响，像是在演奏一曲动听的春之歌。

春天的早晨是一天中最美好的时刻。这个时候，整个世界都充满了生机和活力，让人感受到生命的美好。每一个细节都在诉说着春天的故事，每一个瞬间都值得珍惜。

站在这春光明媚的早晨里，我不禁想到：生活就像春天的早晨，充满希望和可能。只要我们保持积极乐观的心态，就能发现生活中的每一个美好瞬间。

让我们珍惜春天的每一个早晨，感受大自然的馈赠，让心灵在春天的气息中得到净化和升华。`,

        '难忘的一天': `那是一个特别的日子，让我永远难以忘怀。阳光明媚，微风轻拂，仿佛连大自然都在为这一天增添色彩。

那天早晨，我怀着忐忑的心情来到教室。这是我第一次在全班同学面前演讲，心跳快得像要跳出胸膛。当我站在讲台上的那一刻，看到同学们期待的眼神，突然感到一股力量涌上心头。

我开始讲述我的故事，声音由颤抖变得坚定。随着演讲的深入，我发现自己越来越自信。当我说到动情处，甚至看到有同学眼中闪烁着泪光。那一刻，我明白了真诚的力量。

演讲结束后，热烈的掌声响彻教室。老师走过来，轻轻拍了拍我的肩膀，说："你做得很好。"这简单的一句话，让我感到所有的努力都是值得的。

这一天教会了我很多：勇气不是没有恐惧，而是克服恐惧的决心；自信不是与生俱来，而是在挑战中逐渐培养的。最重要的是，我学会了相信自己。

现在回想起来，那天的阳光似乎格外明亮，那天的掌声依然在耳边回响。这个难忘的日子，不仅是我成长的见证，更是我人生的一个重要转折点。

有时候，一天的经历就能改变一个人的一生。这个特别的日子，永远铭刻在我的记忆中，成为我生命中最珍贵的回忆之一。`
    };

    return articles[title] || '文章内容加载中...';
}