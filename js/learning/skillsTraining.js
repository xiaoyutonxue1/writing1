// Skills Training System
export function createSkillsTrainingModal() {
    return `
        <div class="learning-modal skills-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>技能训练</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="skills-grid">
                        <div class="skills-card">
                            <h3>基础能力训练</h3>
                            <div class="training-list">
                                <div class="training-item">
                                    <h4>词汇量训练</h4>
                                    <p>通过多样化练习提升词汇储备</p>
                                    <button class="start-btn">开始训练</button>
                                </div>
                                <div class="training-item">
                                    <h4>句子扩展训练</h4>
                                    <p>学习丰富句子结构的技巧</p>
                                    <button class="start-btn">开始训练</button>
                                </div>
                                <div class="training-item">
                                    <h4>段落组织训练</h4>
                                    <p>掌握段落结构和过渡技巧</p>
                                    <button class="start-btn">开始训练</button>
                                </div>
                            </div>
                        </div>
                        <div class="skills-card">
                            <h3>进阶技能训练</h3>
                            <div class="training-list">
                                <div class="training-item">
                                    <h4>文章结构训练</h4>
                                    <p>学习文章整体布局和结构设计</p>
                                    <button class="start-btn">开始训练</button>
                                </div>
                                <div class="training-item">
                                    <h4>写作手法训练</h4>
                                    <p>掌握各种写作技巧和修辞手法</p>
                                    <button class="start-btn">开始训练</button>
                                </div>
                                <div class="training-item">
                                    <h4>创意思维训练</h4>
                                    <p>培养创新思维和表达能力</p>
                                    <button class="start-btn">开始训练</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}