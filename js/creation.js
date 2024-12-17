// 核心应用类
class WritingApp {
    constructor() {
        this.editor = document.getElementById('editor');
        this.initializeUI();
        this.bindEvents();
    }

    // 初始化UI
    initializeUI() {
        console.log('初始化UI...');
        // 加载任务信息
        this.loadTaskInfo();
        // 加载学习资料
        this.loadMaterials();
    }

    // 绑定事件
    bindEvents() {
        console.log('绑定事件...');
        this.bindSidebarEvents();
        this.bindEditorEvents();
        this.bindTaskInfoEvents();
    }

    // 绑定侧边栏事件
    bindSidebarEvents() {
        // 文件项点击
        const treeItems = document.querySelectorAll('.tree-item');
        treeItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleTreeItemClick(item);
            });
        });

        // 文件夹点击
        const folderHeaders = document.querySelectorAll('.folder-header');
        folderHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleFolderClick(header);
            });
        });

        // 折叠按钮点击
        const collapseBtns = document.querySelectorAll('.collapse-btn');
        collapseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleCollapseClick(btn);
            });
        });
    }

    // 绑定编辑器事件
    bindEditorEvents() {
        if (this.editor) {
            this.editor.addEventListener('input', () => this.handleEditorInput());
        }
    }

    // 绑定任务信息相关事件
    bindTaskInfoEvents() {
        const taskInfo = document.querySelector('.task-header');
        if (!taskInfo) {
            console.log('未找到任务信息区域');
            return;
        }

        // 创建折叠按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'task-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        
        // 创建按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.className = 'task-toggle-container';
        btnContainer.appendChild(toggleBtn);
        
        // 将按钮添加到任务信息区域
        taskInfo.appendChild(btnContainer);

        // 获取需要折叠的内容
        const taskContent = document.querySelector('.task-requirements');
        if (!taskContent) {
            console.log('未找到任务内容区域');
            return;
        }

        // 设置初始状态
        taskContent.style.maxHeight = taskContent.scrollHeight + 'px';
        taskContent.style.overflow = 'hidden';
        taskContent.style.transition = 'max-height 0.3s ease';

        // 绑定点击事件
        toggleBtn.addEventListener('click', () => {
            const isCollapsed = taskContent.style.maxHeight === '0px';
            
            if (isCollapsed) {
                // 展开
                taskContent.style.maxHeight = taskContent.scrollHeight + 'px';
                toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
                toggleBtn.setAttribute('title', '收起');
            } else {
                // 折叠
                taskContent.style.maxHeight = '0px';
                toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
                toggleBtn.setAttribute('title', '展开');
            }
        });
    }

    // 处理文件项点击
    handleTreeItemClick(item) {
        console.log('文件项被点击:', item);
        
        // 移除其他项目的active类
        document.querySelectorAll('.tree-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // 添加当前项目的active类
        item.classList.add('active');
        
        // 加载文件内容
        const fileName = item.querySelector('span').textContent;
        this.loadFileContent(fileName);
    }

    // 处理文件夹点击
    handleFolderClick(header) {
        console.log('文件夹被点击:', header);
        
        const folder = header.closest('.tree-folder');
        const content = folder.querySelector('.folder-content');
        const icon = header.querySelector('.fa-chevron-down');
        
        header.classList.toggle('collapsed');
        
        if (header.classList.contains('collapsed')) {
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            icon.style.transform = 'rotate(-90deg)';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            icon.style.transform = 'rotate(0)';
        }
    }

    // 处理折叠按钮点击
    handleCollapseClick(btn) {
        console.log('折叠按钮被点击:', btn);
        
        const section = btn.closest('.list-section');
        const content = section.querySelector('.section-content');
        const icon = btn.querySelector('i');
        
        btn.classList.toggle('collapsed');
        
        if (btn.classList.contains('collapsed')) {
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            icon.style.transform = 'rotate(-90deg)';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            icon.style.transform = 'rotate(0)';
        }
    }

    // 处理编辑器输入
    handleEditorInput() {
        // 这里可以添加编辑器相关的处理逻辑
        console.log('编辑器内容已更改');
    }

    // 加载文件内容
    loadFileContent(fileName) {
        console.log('加载文件内容:', fileName);
        
        // 范文内容
        const articles = {
            '朱自清《春》': {
                title: '春',
                author: '朱自清',
                content: `盼望着，盼望着，东风来了，春天的脚步近了。

一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。

小草偷偷地从土里钻出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。

桃树、杏树、梨树，你不让我，我不让你，都开满了花赶趟儿。红的像火，粉的像霞，白的像雪。花里带着甜味儿；闭了眼，树上仿佛已经满是桃儿、杏儿、梨儿。

燕子来了，带着忙忙碌碌的消息，风筝也来了，带着柳絮样的轻飘，儿童们也都出来了，草地上，池水旁。

青蛙睡醒了，哈欠连连，挪动到了暖和的地方，花园里，院子里，瞧去，一大队一大队的。

蝴蝶也来了，阳光里晃悠着翅膀，一个个"娇嫩得像嫩姑娘"。

小鸟儿呢，在树稍上呼朋引伴，在空中翩翩飞舞。`
            }
        };

        try {
            // 根据文件名加载内容
            if (fileName.includes('朱自清')) {
                const article = articles['朱自清《春》'];
                if (this.editor) {
                    this.editor.innerHTML = `
                        <h1>${article.title}</h1>
                        <div class="article-meta">
                            <span class="author">作者：${article.author}</span>
                        </div>
                        ${article.content.split('\n').map(p => `<p>${p}</p>`).join('\n')}
                    `;
                    console.log('内容加载成功');
                }
            }
        } catch (error) {
            console.error('加载文件内容时出错:', error);
        }
    }

    // 加载任务信息
    loadTaskInfo() {
        console.log('加载任务信息...');
        // 这里可以添加加载任务信息的逻辑
    }

    // 加载学习资料
    loadMaterials() {
        console.log('加载学习资料...');
        // 这里可以添加加载学习资料的逻辑
    }
}

// 等待DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成');
    setTimeout(() => {
        console.log('初始化应用...');
        window.app = new WritingApp();
    }, 500);
});