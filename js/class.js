document.addEventListener('DOMContentLoaded', function() {
    // Example essays data
    const essays = {
        '那一天的阳光': `那是一个普通的下午，阳光温柔地洒在教室的窗台上。我坐在靠窗的位置，看着斜斜的光线中漂浮的细小尘埃，思绪随之飘远。

这个场景让我想起了去年的那个特别的下午。那天，我因为考试成绩不理想，心情特别低落。放学后，我一个人留在教室里，看着同样的阳光，思考着自己的不足。

就在这时，王老师走进了教室。她没有说什么，只是静静地坐在我旁边，陪我一起看窗外的风景。过了一会儿，她轻声说："你知道吗？阳光每天都是新的，每一天都是新的开始。"

这句简单的话，却让我豁然开朗。是啊，过去的已经过去，重要的是如何面对新的一天。在那个下午，王老师不仅给了我信心，更教会了我一种面对生活的态度。

从那以后，每当我遇到困难，看到阳光，就会想起那天下午的场景，想起王老师的话。阳光不仅温暖了教室，也温暖了我的心。

现在回想起来，那个下午的阳光是如此特别。它不仅照亮了教室，也照亮了我前进的道路。这让我明白，有时候生活中最普通的时刻，往往会成为最难忘的记忆。

那一天的阳光，不仅带给我温暖，更带给我希望和力量。它教会我，生活中的每一个当下都是珍贵的，都值得我们以积极的心态去面对。`,

        '难忘的运动会': `秋高气爽的十月，我们迎来了期待已久的校运动会。这不仅是一场体育盛会，更是一次难忘的成长经历。

记得那天早晨，天空格外晴朗，微风轻拂，带着几分清爽。操场上彩旗飘扬，加油声此起彼伏。我作为班级的接力跑选手，心情既紧张又兴奋。

比赛开始前，我们班的参赛选手围在一起，互相鼓励。王老师特意来到我们身边，说："不要给自己太大压力，享受比赛的过程，这才是运动会的真正意义。"这句话让我紧张的心情平静了许多。

终于轮到4×100米接力赛。第一棒起跑的同学像离弦的箭一般冲了出去，第二棒、第三棒的交接都很顺利。当接力棒传到我手中时，我感受到了全班同学的期待。

最后一百米，我使出全身力气奔跑，耳边是此起彼伏的加油声。那一刻，我感觉自己不是一个人在跑，而是承载着全班同学的希望。最终，我们获得了第二名的好成绩。

虽然没有获得第一，但当我看到全班同学为我们欢呼时，我明白了一个道理：胜负固然重要，但更重要的是在比赛中展现出的团结协作精神。

这次运动会，不仅让我体会到了运动的快乐，更让我感受到了集体的力量。那天的阳光、汗水、欢呼声，都成为了我高中生活中最珍贵的回忆。

现在回想起来，运动会的意义不仅在于比赛本身，更在于它教会我们如何在团队中承担责任，如何在挫折中成长。这些经历，都将成为我们人生路上宝贵的财富。`,

        '诚信是金': `在这个快速发展的时代，诚信显得尤为珍贵。它不仅是一种品德，更是社会发展的基石。让我们深入探讨诚信的重要性及其在现代社会中的意义。

首先，诚信是人际交往的基础。在日常生活中，无论是与人交谈，还是进行商业往来，诚信都是不可或缺的。一个守信用的人，往往能赢得他人的信任和尊重。反之，一旦失信，不仅会失去他人的信任，还可能影响到整个社会的和谐。

其次，诚信是个人发展的保障。在学习和工作中，诚实守信的人更容易获得机会和认可。比如，在考试中诚实作答，不仅是对自己负责，也是对教育公平的维护。在职场中，诚信更是职业发展的重要基石。

再次，诚信是社会进步的动力。一个充满诚信的社会，能够减少不必要的防范成本，提高社会运行效率。例如，如果每个人都能诚实守信，我们就不需要花费大量资源去防范欺诈和造假。

然而，在现实生活中，我们也看到了一些不诚信的现象。有人为了一时利益而欺骗他人，有人为了便利而违背承诺。这些行为不仅损害了他人的利益，也破坏了社会的信任基础。

因此，培养诚信意识刻不容缓。从个人做起，在日常生活中践行诚信；从教育入手，在学校中强化诚信教育；从制度着眼，建立健全社会信用体系。

诚信不是一句空话，而是需要我们用行动来维护的价值准则。它像一面镜子，照出我们的品格；像一把尺子，衡量我们的行为；像一座灯塔，指引我们前进的方向。

让我们共同努力，用诚信铸就美好的未来，让诚信之花在我们的社会中处处绽放。因为我们深知，诚信不仅是金，更是一个社会文明进步的重要标志。`
    };

    // Show essay modal
    window.showEssay = function(title) {
        const modal = document.getElementById('essayModal');
        const modalTitle = modal.querySelector('.modal-header h2');
        const modalContent = modal.querySelector('.article-content');
        
        modalTitle.textContent = title;
        modalContent.innerHTML = essays[title].split('\n\n').map(p => `<p>${p.trim()}</p>`).join('');
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Initialize AI assistant
        initializeAIAssistant(modal, title);
    };

    // Close modal
    document.querySelectorAll('.essay-modal .close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.essay-modal');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        });
    });

    // Close modal on outside click
    document.querySelector('.essay-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('essay-modal')) {
            e.target.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    function initializeAIAssistant(modal, essayTitle) {
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
                    addMessage('ai', `让我来为您介绍《${essayTitle}》这篇文章。

这是一篇精彩的作品，主要讲述了一个难忘的经历。作者通过细腻的笔触，生动地描绘了人物、场景和情节，展现了深刻的主题思想。

文章的亮点在于：
1. 细腻的心理描写，真实感人
2. 生动的场景描写，身临其境
3. 深刻的主题思想，发人深省

这篇文章的写作技巧值得学习，特别是在细节描写和情感表达方面。`);
                } else if (action === 'analyze') {
                 <boltAction type="file" filePath="js/class.js">
                } else if (action === 'analyze') {
                    addMessage('ai', `请分享您对《${essayTitle}》的分析和感悟，可以从以下几个方面入手：

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
                const response = generateAnalysisFeedback(text, essayTitle);
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
                    options: ["成长的经历", "生活的感悟", "友情的可贵"],
                    correct: 0
                },
                {
                    text: "作者使用了什么写作手法？",
                    options: ["比喻", "拟人", "夸张"],
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
});