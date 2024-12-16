document.addEventListener('DOMContentLoaded', function() {
    // 工具面板切换
    const toolToggle = document.querySelector('.tool-toggle');
    const toolsPanel = document.querySelector('.tools-panel');
    let isPanelVisible = true;

    toolToggle.addEventListener('click', function() {
        isPanelVisible = !isPanelVisible;
        if (isPanelVisible) {
            toolsPanel.classList.remove('collapsed');
            this.innerHTML = '<i class="fas fa-chevron-right"></i>';
        } else {
            toolsPanel.classList.add('collapsed');
            this.innerHTML = '<i class="fas fa-chevron-left"></i>';
        }
    });

    // 批改模式切换
    const modeBtns = document.querySelectorAll('.mode-btn');
    const aiPanel = document.querySelector('.ai-panel');
    const manualPanel = document.querySelector('.manual-panel');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const mode = this.getAttribute('data-mode');
            if (mode === 'ai') {
                aiPanel.style.display = 'block';
                manualPanel.style.display = 'none';
            } else {
                aiPanel.style.display = 'none';
                manualPanel.style.display = 'block';
            }
        });
    });

    // 面板最小化
    document.querySelectorAll('.panel-minimize').forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.closest('.panel');
            panel.classList.toggle('minimized');
            this.innerHTML = panel.classList.contains('minimized') 
                ? '<i class="fas fa-plus"></i>' 
                : '<i class="fas fa-minus"></i>';
        });
    });

    // 批改工具
    const correctionTools = document.querySelectorAll('.correction-tool');
    let currentTool = null;

    correctionTools.forEach(tool => {
        tool.addEventListener('click', function() {
            correctionTools.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.getAttribute('data-type');
        });
    });

    // 文本选择处理
    const essayBody = document.querySelector('.essay-body');
    
    essayBody.addEventListener('mouseup', function() {
        if (!currentTool) return;

        const selection = window.getSelection();
        if (!selection.toString()) return;

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        switch(currentTool) {
            case 'mark':
                addMarking(range, selectedText, 'highlight');
                break;
            case 'comment':
                addMarking(range, selectedText, 'comment');
                break;
            case 'suggest':
                addMarking(range, selectedText, 'suggestion');
                break;
        }
    });

    function addMarking(range, text, type) {
        const marking = document.createElement('span');
        marking.className = `correction-${type}`;
        marking.textContent = text;

        if (type === 'highlight') {
            marking.style.backgroundColor = '#fff3cd';
        } else if (type === 'comment') {
            marking.style.borderBottom = '2px dashed #1890ff';
            marking.setAttribute('data-comment', '点击添加评语');
        } else if (type === 'suggestion') {
            marking.style.borderBottom = '2px solid #ff4d4f';
            marking.setAttribute('data-suggestion', '点击添加修改建议');
        }

        range.deleteContents();
        range.insertNode(marking);

        if (type !== 'highlight') {
            marking.addEventListener('click', function() {
                const prompt = type === 'comment' ? '请输入评语：' : '请输入修改建议：';
                const input = window.prompt(prompt);
                if (input) {
                    this.setAttribute(`data-${type}`, input);
                }
            });
        }
    }
});