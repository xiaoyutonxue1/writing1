// 教师端数据管理类
class TeacherDataManager {
    constructor() {
        this.cache = new Map();
        this.lastUpdate = null;
        
        // 初始化作业数据
        this.assignments = new Map([
            [1, {
                id: 1,
                studentId: 1,
                studentName: '李明',
                className: '三年级一班',
                title: '春天的早晨',
                content: '春天的早晨真美丽。太阳刚刚升起，温暖的阳光洒在大地上，让人感到无比舒适。小鸟在枝头欢快地歌唱，好像在欢迎春天的到来。草地上的露珠闪闪发光，像是撒落在地上的珍珠。远处的山峦笼罩在薄薄的晨雾中，显得格外神秘。空气中弥漫着泥土和青草的清香，让人忍不住深深地呼吸。这就是春天的早晨，充满生机和希望。',
                submitTime: '2024-01-15 09:30',
                wordCount: 800,
                draft: 2,
                status: 'pending'
            }],
            [2, {
                id: 2,
                studentId: 2,
                studentName: '张华',
                className: '三年级一班',
                title: '我的理想',
                content: '每个人都有自己的理想。有的人想成为科学家，有的人想成为医生，而我的理想是成为一名作家。从小我就喜欢读书写作，常常被书中的故事深深吸引。我希望将来也能创作出打动人心的作品，让更多的人通过我的文字感受到生活的美好。为了实现这个理想，我每天坚持阅读和写作，相信通过不断努力，我一定能够实现自己的梦想。',
                submitTime: '2024-01-14 15:20',
                wordCount: 650,
                draft: 1,
                status: 'pending'
            }],
            [3, {
                id: 3,
                studentId: 3,
                studentName: '王芳',
                className: '三年级二班',
                title: '难忘的一天',
                content: '那是一个阳光明媚的周末，我和家人一起去郊游。我们来到一片美丽的草地，铺上野餐垫，享受美味的食物和清新的空气。午后，我们放风筝、采野花、追逐蝴蝶，玩得不亦乐乎。傍晚时分，夕阳的余晖洒在草地上，为这美好的一天画上了完美的句点。这一天的快乐时光，将永远留在我的记忆中。',
                submitTime: '2024-01-13 16:45',
                wordCount: 720,
                draft: 1,
                status: 'completed'
            }],
            [4, {
                id: 4,
                studentId: 4,
                studentName: '刘强',
                className: '三年级二班',
                title: '我最喜欢的季节',
                content: '在四季中，我最喜欢秋天。秋天的天空特别蓝，白云像棉花糖一样漂浮在空中。树叶变成了金黄色，微风吹过时，它们就会跳起优美的舞蹈。空气中飘着桂花的香味，让人心情愉悦。秋天还是收获的季节，果园里的苹果红彤彤的，稻田里的稻子金灿灿的，到处都充满了丰收的喜悦。',
                submitTime: '2024-01-12 14:30',
                wordCount: 680,
                draft: 1,
                status: 'correcting'
            }],
            [5, {
                id: 5,
                studentId: 5,
                studentName: '赵雪',
                className: '三年级一班',
                title: '我的小狗',
                content: '去年生日，爸爸妈妈送给我一只可爱的小狗。它有着棕色的毛发，圆圆的大眼睛，总是充满好奇地看着周围的一切。我给它取名叫"豆豆"，因为它真的像一颗小豆子那样可爱。豆豆非常聪明，很快就学会了许多小技巧。每天放学回家，它都会开心地跑来迎接我。豆豆已经成为了我最好的朋友。',
                submitTime: '2024-01-11 10:15',
                wordCount: 550,
                draft: 1,
                status: 'completed'
            }]
        ]);
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