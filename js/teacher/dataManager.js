// 教师端数据管理类
class TeacherDataManager {
    constructor() {
        this.cache = new Map();
        this.lastUpdate = null;
    }

    // 获取学生数据
    static async getStudentData() {
        try {
            // TODO: 从后端API获取数据
            // 目前使用模拟数据
            return {
                students: [
                    {
                        id: 1,
                        name: '张三',
                        class: '三年级一班',
                        writings: [
                            {
                                id: 1,
                                title: '我的暑假',
                                content: '今年暑假...',
                                submitTime: '2024-01-15 14:30:00',
                                score: 85,
                                aiScore: 83,
                                teacherScore: 85,
                                issues: [
                                    { type: 'grammar', description: '病句', count: 2 },
                                    { type: 'content', description: '内容单薄', count: 1 }
                                ],
                                feedback: '整体结构完整，但细节描写不够...'
                            }
                        ],
                        progress: {
                            overall: [75, 78, 82, 85],
                            language: [70, 75, 80, 85],
                            content: [80, 82, 85, 88],
                            structure: [75, 78, 80, 82]
                        }
                    },
                    {
                        id: 2,
                        name: '李四',
                        class: '三年级一班',
                        writings: [
                            {
                                id: 2,
                                title: '我的理想',
                                content: '我的理想是...',
                                submitTime: '2024-01-14 15:20:00',
                                score: 88,
                                aiScore: 87,
                                teacherScore: 88,
                                issues: [
                                    { type: 'structure', description: '结构不够清晰', count: 1 }
                                ],
                                feedback: '想象力丰富，但需要注意文章结构...'
                            }
                        ],
                        progress: {
                            overall: [70, 75, 80, 88],
                            language: [65, 70, 78, 85],
                            content: [75, 80, 85, 90],
                            structure: [70, 75, 78, 85]
                        }
                    }
                ],
                classes: [
                    {
                        id: 1,
                        name: '三年级一班',
                        studentCount: 45,
                        averageScore: 82.5,
                        writingCount: 180,
                        commonIssues: [
                            { type: 'grammar', description: '病句', count: 25 },
                            { type: 'content', description: '内容单薄', count: 20 },
                            { type: 'structure', description: '结构混乱', count: 15 }
                        ]
                    }
                ],
                statistics: {
                    totalWritings: 1234,
                    averageScore: 85.6,
                    aiAccuracy: 92.5,
                    progressRate: 85,
                    timeDistribution: {
                        dates: ['2024-01-10', '2024-01-11', '2024-01-12', '2024-01-13', '2024-01-14'],
                        counts: [45, 52, 48, 60, 55],
                        scores: [82, 83, 85, 84, 86]
                    },
                    issueDistribution: [
                        { issue: '病句', count: 150, color: '#2563eb' },
                        { issue: '用词不当', count: 120, color: '#059669' },
                        { issue: '结构混乱', count: 90, color: '#d97706' },
                        { issue: '主题不明', count: 60, color: '#7c3aed' },
                        { issue: '内容单薄', count: 80, color: '#dc2626' }
                    ],
                    aiPerformance: {
                        dates: ['2024-01-10', '2024-01-11', '2024-01-12', '2024-01-13', '2024-01-14'],
                        aiAccuracy: [91, 92, 92.5, 93, 92.5],
                        humanCorrection: [9, 8, 7.5, 7, 7.5]
                    }
                }
            };
        } catch (error) {
            console.error('获取学生数据失败:', error);
            throw error;
        }
    }

    // 获取班级数据
    static async getClassData(classId) {
        try {
            const data = await this.getStudentData();
            return data.classes.find(c => c.id === classId);
        } catch (error) {
            console.error('获取班级数据失败:', error);
            throw error;
        }
    }

    // 获取学生详细数据
    static async getStudentDetail(studentId) {
        try {
            const data = await this.getStudentData();
            return data.students.find(s => s.id === studentId);
        } catch (error) {
            console.error('获取学生详细数据失败:', error);
            throw error;
        }
    }

    // 获取写作分析数据
    static async getWritingAnalysis(timeRange = 'month') {
        try {
            const data = await this.getStudentData();
            return data.statistics.timeDistribution;
        } catch (error) {
            console.error('获取写作分析数据失败:', error);
            throw error;
        }
    }

    // 获取常见问题分析
    static async getCommonIssues(type = 'all') {
        try {
            const data = await this.getStudentData();
            let issues = data.statistics.issueDistribution;
            if (type !== 'all') {
                issues = issues.filter(issue => issue.type === type);
            }
            return issues;
        } catch (error) {
            console.error('获取常见问题分析失败:', error);
            throw error;
        }
    }

    // 获取AI批改准确率数据
    static async getAIAccuracy(timeRange = 'month') {
        try {
            const data = await this.getStudentData();
            return data.statistics.aiPerformance;
        } catch (error) {
            console.error('获取AI批改准确率数据失败:', error);
            throw error;
        }
    }

    // 获取学生进步数据
    static async getStudentProgress(studentId = 'all') {
        try {
            const data = await this.getStudentData();
            if (studentId === 'all') {
                // 返回所有学生的平均进步数据
                return this.calculateAverageProgress(data.students);
            }
            const student = data.students.find(s => s.id === studentId);
            return student ? student.progress : null;
        } catch (error) {
            console.error('获取学生进步数据失败:', error);
            throw error;
        }
    }

    // 计算平均进步数据
    static calculateAverageProgress(students) {
        const progressSum = {
            overall: new Array(4).fill(0),
            language: new Array(4).fill(0),
            content: new Array(4).fill(0),
            structure: new Array(4).fill(0)
        };

        students.forEach(student => {
            Object.keys(student.progress).forEach(key => {
                student.progress[key].forEach((value, index) => {
                    progressSum[key][index] += value;
                });
            });
        });

        const studentCount = students.length;
        return {
            overall: progressSum.overall.map(sum => sum / studentCount),
            language: progressSum.language.map(sum => sum / studentCount),
            content: progressSum.content.map(sum => sum / studentCount),
            structure: progressSum.structure.map(sum => sum / studentCount)
        };
    }

    // 导出分析报告
    static async exportAnalysisReport(format = 'pdf') {
        try {
            const data = await this.getStudentData();
            // TODO: 实现报告导出功能
            console.log('导出分析报告:', format, data);
        } catch (error) {
            console.error('导出分析报告失败:', error);
            throw error;
        }
    }
} 