export function createTheoryLearningModal() {
    return `
        <div class="learning-modal theory-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>写作理论学习</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="learning-options">
                        <div class="learning-option" data-type="systematic">
                            <i class="fas fa-graduation-cap"></i>
                            <h3>系统化课程</h3>
                            <p>系统性学习写作理论知识</p>
                        </div>
                        <div class="learning-option" data-type="micro">
                            <i class="fas fa-video"></i>
                            <h3>微课学习</h3>
                            <p>短小精悍的写作技巧课程</p>
                        </div>
                        <div class="learning-option" data-type="case">
                            <i class="fas fa-book-open"></i>
                            <h3>案例学习</h3>
                            <p>经典范文解析与学习</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function createSystematicContent() {
    return `
        <div class="theory-content">
            <button class="back-btn"><i class="fas fa-arrow-left"></i> 返回</button>
            <h3>系统化课程</h3>
            <div class="modules-grid">
                <div class="module-card">
                    <h4>写作基础知识</h4>
                    <ul>
                        <li>写作要素精讲</li>
                        <li>文体特征解析</li>
                        <li>写作规范指导</li>
                        <li>常见问题解答</li>
                    </ul>
                </div>
                <div class="module-card">
                    <h4>写作方法指导</h4>
                    <ul>
                        <li>选材立意指导</li>
                        <li>结构组织方法</li>
                        <li>语言运用技巧</li>
                        <li>修改提升方法</li>
                    </ul>
                </div>
                <div class="module-card">
                    <h4>写作思维培养</h4>
                    <ul>
                        <li>逻辑思维训练</li>
                        <li>创意思维开发</li>
                        <li>批判性思维培养</li>
                        <li>思维导图应用</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

export function createMicroContent() {
    return `
        <div class="theory-content">
            <button class="back-btn"><i class="fas fa-arrow-left"></i> 返回</button>
            <h3>微课学习</h3>
            <div class="modules-grid">
                <div class="module-card">
                    <h4>视频微课</h4>
                    <p>5-8分钟/节的精品微课</p>
                    <div class="video-list">
                        <div class="video-item">
                            <i class="fas fa-play-circle"></i>
                            <span>写作开头技巧</span>
                            <span class="duration">6分钟</span>
                        </div>
                        <div class="video-item">
                            <i class="fas fa-play-circle"></i>
                            <span>描写方法运用</span>
                            <span class="duration">7分钟</span>
                        </div>
                    </div>
                </div>
                <div class="module-card">
                    <h4>图文知识卡片</h4>
                    <div class="card-list">
                        <div class="knowledge-card">
                            <h5>写作技巧速记</h5>
                            <p>包含关键点和实例</p>
                        </div>
                        <div class="knowledge-card">
                            <h5>常用词句积累</h5>
                            <p>分类整理的表达方式</p>
                        </div>
                    </div>
                </div>
                <div class="module-card">
                    <h4>互动式练习</h4>
                    <div class="exercise-list">
                        <div class="exercise-item">
                            <span>开头段练习</span>
                            <button class="start-btn">开始练习</button>
                        </div>
                        <div class="exercise-item">
                            <span>段落过渡练习</span>
                            <button class="start-btn">开始练习</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function createCaseContent() {
    return `
        <div class="theory-content">
            <button class="back-btn"><i class="fas fa-arrow-left"></i> 返回</button>
            <h3>案例学习</h3>
            <div class="modules-grid">
                <div class="module-card">
                    <h4>范文解析</h4>
                    <div class="case-list">
                        <div class="case-item">
                            <h5>优秀作文赏析</h5>
                            <p>详细解读写作特点和亮点</p>
                            <button class="view-btn">查看解析</button>
                        </div>
                    </div>
                </div>
                <div class="module-card">
                    <h4>技法分析</h4>
                    <div class="case-list">
                        <div class="case-item">
                            <h5>写作手法示例</h5>
                            <p>各类写作技巧的实际运用</p>
                            <button class="view-btn">查看分析</button>
                        </div>
                    </div>
                </div>
                <div class="module-card">
                    <h4>创作思路解读</h4>
                    <div class="case-list">
                        <div class="case-item">
                            <h5>写作构思过程</h5>
                            <p>了解作者的创作思路</p>
                            <button class="view-btn">查看解读</button>
                        </div>
                    </div>
                </div>
                <div class="module-card">
                    <h4>写作误区警示</h4>
                    <div class="case-list">
                        <div class="case-item">
                            <h5>常见问题分析</h5>
                            <p>避免写作中的常见错误</p>
                            <button class="view-btn">查看警示</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}