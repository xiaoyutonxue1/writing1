// 训练模式配置
const trainingModes = {
    'guided-writing': {
        title: '引导式写作',
        steps: [
            {
                name: '选择主题',
                description: '从推荐主题中选择，或自定义主题'
            },
            {
                name: '构思大纲',
                description: 'AI助手帮助你规划文章结构'
            },
            {
                name: '素材收集',
                description: '智能推荐相关素材和例句'
            },
            {
                name: '开始写作',
                description: '分段落引导，实时写作建议'
            },
            {
                name: '优化完善',
                description: 'AI助手帮助润色和改进'
            }
        ]
    },
    'scenario-writing': {
        title: '情境写作',
        scenarios: [
            {
                name: '校园生活',
                scenes: ['运动会', '班级活动', '课间趣事']
            },
            {
                name: '日常见闻',
                scenes: ['公园游玩', '商场购物', '节��庆典']
            },
            {
                name: '想象世界',
                scenes: ['未来科技', '奇幻冒险', '童话故事']
            }
        ]
    },
    'writing-game': {
        title: '写作游戏',
        games: [
            {
                name: '词语接龙',
                description: '用上一个词语的最后一个字开始造句'
            },
            {
                name: '看图写话',
                description: '根据图片编写有趣的故事'
            },
            {
                name: '续写故事',
                description: '接着上一个同学的故事继续写'
            }
        ]
    },
    'writing-contest': {
        title: '写作竞赛',
        modes: [
            {
                name: '限时写作',
                description: '在规定时间内完成写作任务'
            },
            {
                name: '主题对战',
                description: '与其他同学同题写作，互相评分'
            },
            {
                name: '创意比拼',
                description: '比拼谁的故事最有创意'
            }
        ]
    }
};

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 为每个训练卡片添加点击事件
    document.querySelectorAll('.training-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('start-btn')) {
                startTraining(card.id);
            }
        });
    });

    // 更新进度条动画
    updateProgress();
});

// 开始训练
function startTraining(modeId) {
    const mode = trainingModes[modeId];
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'training-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${mode.title}</h2>
            <div class="mode-content">
                ${generateModeContent(modeId, mode)}
            </div>
            <div class="modal-buttons">
                <button class="cancel-btn">取消</button>
                <button class="confirm-btn">开始训练</button>
            </div>
        </div>
    `;

    // 添加模态框到页面
    document.body.appendChild(modal);

    // 添加事件监听
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.confirm-btn').addEventListener('click', () => {
        startSpecificTraining(modeId);
        modal.remove();
    });
}

// 生成不同模式的具体内容
function generateModeContent(modeId, mode) {
    switch(modeId) {
        case 'guided-writing':
            return `
                <div class="steps-list">
                    ${mode.steps.map((step, index) => `
                        <div class="step-item">
                            <span class="step-number">${index + 1}</span>
                            <div class="step-info">
                                <h4>${step.name}</h4>
                                <p>${step.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        
        case 'scenario-writing':
            return `
                <div class="scenarios-list">
                    ${mode.scenarios.map(scenario => `
                        <div class="scenario-group">
                            <h4>${scenario.name}</h4>
                            <div class="scene-items">
                                ${scenario.scenes.map(scene => `
                                    <button class="scene-btn">${scene}</button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        
        case 'writing-game':
            return `
                <div class="games-list">
                    ${mode.games.map(game => `
                        <div class="game-item">
                            <h4>${game.name}</h4>
                            <p>${game.description}</p>
                            <button class="game-btn">开始游戏</button>
                        </div>
                    `).join('')}
                </div>
            `;
        
        case 'writing-contest':
            return `
                <div class="contest-modes">
                    ${mode.modes.map(contestMode => `
                        <div class="contest-item">
                            <h4>${contestMode.name}</h4>
                            <p>${contestMode.description}</p>
                            <button class="contest-btn">参加比赛</button>
                        </div>
                    `).join('')}
                </div>
            `;
    }
}

// 开始具体的训练模式
function startSpecificTraining(modeId) {
    // 这里添加跳转到具体训练页面的逻辑
    console.log(`Starting ${modeId} training...`);
    // window.location.href = `/student/training/${modeId}.html`;
}

// 更新进度条
function updateProgress() {
    const progress = document.querySelector('.progress');
    if (progress) {
        // 这里可以从后端获���实际的进度数据
        const currentProgress = 65;
        progress.style.width = `${currentProgress}%`;
    }
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .training-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }

    .steps-list .step-item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .step-number {
        width: 30px;
        height: 30px;
        background: #4CAF50;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
    }

    .scenarios-list .scene-btn {
        background: #f5f5f5;
        border: none;
        padding: 10px 20px;
        margin: 5px;
        border-radius: 5px;
        cursor: pointer;
    }

    .games-list .game-item,
    .contest-modes .contest-item {
        background: #f9f9f9;
        padding: 20px;
        margin-bottom: 15px;
        border-radius: 10px;
    }

    .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .modal-buttons button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .cancel-btn {
        background: #f5f5f5;
    }

    .confirm-btn {
        background: #4CAF50;
        color: white;
    }
`;

document.head.appendChild(style); 