document.addEventListener('DOMContentLoaded', function() {
    // 添加新班级功能
    const addClassBtn = document.querySelector('.add-class-btn');
    if (addClassBtn) {
        addClassBtn.addEventListener('click', function() {
            // 这里可以添加创建新班级的逻辑
            console.log('添加新班级');
        });
    }

    // 添加新作业功能
    const addHomeworkBtn = document.querySelector('.add-homework-btn');
    if (addHomeworkBtn) {
        addHomeworkBtn.addEventListener('click', function() {
            // 这里可以添加发布新作业的逻辑
            console.log('发布新作业');
        });
    }

    // 资源上传功能
    const resourceUpload = document.querySelector('.resource-upload');
    if (resourceUpload) {
        resourceUpload.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = function(e) {
                // 这里可以添加文件上传的逻辑
                console.log('选择的文件：', e.target.files);
            };
            input.click();
        });

        // 拖拽上传
        resourceUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#1890ff';
        });

        resourceUpload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
        });

        resourceUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            // 这里可以添加文件上传的逻辑
            console.log('拖拽的文件：', e.dataTransfer.files);
        });
    }

    // 资源项点击事件
    document.querySelectorAll('.resource-item').forEach(item => {
        item.addEventListener('click', function() {
            const resourceType = this.querySelector('span').textContent;
            // 这里可以添加打开对应资源的逻辑
            console.log('打开资源：', resourceType);
        });
    });

    // 共享资源操作
    document.querySelectorAll('.shared-actions .btn-icon').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.querySelector('i').classList.contains('fa-download') ? '下载' : '删除';
            const fileName = this.closest('.shared-item').querySelector('h4').textContent;

            if (action === '删除') {
                if (confirm(`确定要删除 ${fileName} 吗？`)) {
                    // 这里可以添加删除文件的逻辑
                    this.closest('.shared-item').remove();
                }
            } else {
                // 这里可以添加下载文件的逻辑
                console.log('下载文件：', fileName);
            }
        });
    });

    // 进度条动画
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
});