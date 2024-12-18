document.addEventListener('DOMContentLoaded', function() {
    // 头像上传功能
    const editAvatarBtn = document.querySelector('.edit-avatar');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        document.querySelector('.profile-avatar img').src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // 编辑资料按钮
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // 这里可以添加编辑个人资料的逻辑
            console.log('编辑个人资料');
        });
    }

    // 资源卡片点击事件
    document.querySelectorAll('.resource-card').forEach(card => {
        card.addEventListener('click', function() {
            const resourceType = this.querySelector('h3').textContent;
            // 这里可以添加打开对应资源的逻辑
            console.log('打开资源：', resourceType);
        });
    });

    // 设置卡片点击事件
    document.querySelectorAll('.setting-card').forEach(card => {
        card.addEventListener('click', function() {
            const settingType = this.querySelector('h3').textContent;
            // 这里可以添加打开对应设置的逻辑
            console.log('打开设置：', settingType);
        });
    });

    // 这里可以添加图表初始化代码
    // 例如使用 Chart.js 或其他图表库来绘制班级成绩分布图
    function initializeCharts() {
        // 图表初始化代码
        console.log('初始化图表');
    }

    // 调用图表初始化
    initializeCharts();

    // 响应式处理
    function handleResponsive() {
        const width = window.innerWidth;
        if (width <= 768) {
            // 添加移动端适配逻辑
        }
    }

    window.addEventListener('resize', handleResponsive);
    handleResponsive();
});