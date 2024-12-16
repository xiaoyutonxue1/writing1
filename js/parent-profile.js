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

    // 通知设置开关
    document.querySelectorAll('.switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.setting-item')
                .querySelector('h3').textContent;
            console.log(`${settingName} 已${this.checked ? '开启' : '关闭'}`);
        });
    });

    // 安全设置按钮
    document.querySelectorAll('.security-item .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const securityType = this.closest('.security-item')
                .querySelector('h3').textContent;
            console.log(`修改${securityType}`);
        });
    });

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