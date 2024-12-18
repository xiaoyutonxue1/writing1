// Personalized Learning Plan System
export function createPersonalizedLearningModal() {
    return `
        <div class="learning-modal personalized-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>个性化学习计划</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="learning-options">
                        <div class="learning-option" data-type="diagnosis">
                            <i class="fas fa-stethoscope"></i>
                            <h3>能力诊断系统</h3>
                            <p>全方位评估学习能力</p>
                        </div>
                        <div class="learning-option" data-type="planning">
                            <i class="fas fa-tasks"></i>
                            <h3>学习规划系统</h3>
                            <p>制定个性化学习计划</p>
                        </div>
                        <div class="learning-option" data-type="tracking">
                            <i class="fas fa-chart-line"></i>
                            <h3>进度跟踪系统</h3>
                            <p>实时监控学习进度</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Diagnosis System Content
export function createDiagnosisContent() {
    return `
        <div class="diagnosis-content">
            <button class="back-btn"><i class="fas fa-arrow-left"></i> 返回</button>
            <h3>能力诊断系统</h3>
            <div class="diagnosis-grid">
                <div class="diagnosis-card" data-type="assessment">
                    <h4>多维度评估</h4>
                    <ul>
                        <li>写作水平测试</li>
                        <li>知识掌握程度</li>
                        <li>学习能力评估</li>
                    </ul>
                    <button class="start-btn">开始评估</button>
                </div>
                <div class="diagnosis-card" data-type="style">
                    <h4>学习风格分析</h4>
                    <ul>
                        <li>学习偏好识别</li>
                        <li>学习习惯分析</li>
                        <li>学习方式建议</li>
                    </ul>
                    <button class="start-btn">开始分析</button>
                </div>
                <div class="diagnosis-card" data-type="interest">
                    <h4>兴趣倾向识别</h4>
                    <ul>
                        <li>写作兴趣测评</li>
                        <li>题材偏好分析</li>
                        <li>个性化推荐</li>
                    </ul>
                    <button class="start-btn">开始测评</button>
                </div>
            </div>
        </div>
    `;
}

// Planning System Content
export function createPlanningContent() {
    return `
        <div class="planning-content">
            <button class="back-btn"><i class="fas fa-arrow-left"></i> 返回</button>
            <h3>学习规划系统</h3>
            <div class="planning-grid">
                <div class="planning-card">
                    <h4>个性化目标设定</h4>
                    <div class="goal-settings">
                        <div class="goal-item">
                            <h5>短期学习目标</h5>
                            <textarea placeholder="设定本周学习目标..."></textarea>
                        </div>
                        <div class="goal-item">
                            <h5>中期能力提升</h5>
                            <textarea placeholder="设定本月能力提升目标..."></textarea>
                        </div>
                        <div class="goal-item">
                            <h5>长期发展规划</h5>
                            <textarea placeholder="设定长期发展目标..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="planning-card">
                    <h4>阶段性任务分配</h4>
                    <div class="task-settings">
                        <div class="task-item">
                            <label>任务难度匹配</label>
                            <select>
                                <option>初级难度</option>
                                <option>中级难度</option>
                                <option>高级难度</option>
                            </select>
                        </div>
                        <div class="task-item">
                            <label>学习时间安排</label>
                            <input type="number" placeholder="每日学习时长（分钟）">
                        </div>
                        <div class="task-item">
                            <label>练习量调整</label>
                            <input type="range" min="1" max="5" value="3">
                        </div>
                    </div>
                </div>
                <div class="planning-card">
                    <h4>动态调整机制</h4>
                    <div class="adjustment-options">
                        <div class="adjustment-item">
                            <input type="checkbox" id="effectMonitor">
                            <label for="effectMonitor">学习效果监测</label>
                        </div>
                        <div class="adjustment-item">
                            <input type="checkbox" id="planAdjust">
                            <label for="planAdjust">计划实时调整</label>
                        </div>
                        <div class="adjustment-item">
                            <input type="checkbox" id="suggestionUpdate">
                            <label for="suggestionUpdate">学习建议更新</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Tracking System Content
export function createTrackingContent() {
    return `
        <div class="tracking-content">
            <button class="back-btn"><i class="fas fa-arrow-left"></i> 返回</button>
            <h3>进度跟踪系统</h3>
            <div class="tracking-grid">
                <div class="tracking-card">
                    <h4>学习数据记录</h4>
                    <div class="data-records">
                        <div class="record-item">
                            <span>学习时长统计</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: 75%"></div>
                                <span>15小时/周</span>
                            </div>
                        </div>
                        <div class="record-item">
                            <span>完成任务记录</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: 60%"></div>
                                <span>12/20项</span>
                            </div>
                        </div>
                        <div class="record-item">
                            <span>能力提升追踪</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: 85%"></div>
                                <span>提升显著</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tracking-card">
                    <h4>效果评估</h4>
                    <div class="evaluation-content">
                        <div class="chart-container">
                            阶段性测评图表
                        </div>
                        <div class="evaluation-summary">
                            <h5>能力提升分析</h5>
                            <ul>
                                <li>写作水平：显著提升</li>
                                <li>词汇运用：稳步提高</li>
                                <li>文章结构：持续进步</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="tracking-card">
                    <h4>及时反馈</h4>
                    <div class="feedback-content">
                        <div class="feedback-item">
                            <i class="fas fa-bell"></i>
                            <span>学习建议推送</span>
                            <button class="view-btn">查看</button>
                        </div>
                        <div class="feedback-item">
                            <i class="fas fa-trophy"></i>
                            <span>激励机制触发</span>
                            <button class="view-btn">查看</button>
                        </div>
                        <div class="feedback-item">
                            <i class="fas fa-envelope"></i>
                            <span>家长教师通知</span>
                            <button class="view-btn">查看</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}