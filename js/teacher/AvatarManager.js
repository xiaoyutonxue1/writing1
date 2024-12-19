class AvatarManager {
    constructor() {
        this.avatarApis = [
            'https://api.dicebear.com/7.x/avataaars/svg',
            'https://api.dicebear.com/7.x/bottts/svg',
            'https://api.dicebear.com/7.x/personas/svg'
        ];
    }

    // 生成随机头像URL
    generateRandomAvatar() {
        const randomApi = this.avatarApis[Math.floor(Math.random() * this.avatarApis.length)];
        const seed = Math.random().toString(36).substring(7);
        return `${randomApi}?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    }

    // 更新头像
    updateAvatar(avatarElement) {
        const newAvatarUrl = this.generateRandomAvatar();
        avatarElement.src = newAvatarUrl;
        
        // 同时更新导航栏头像
        const navAvatar = document.querySelector('.nav-user .user-avatar');
        if (navAvatar) {
            navAvatar.src = newAvatarUrl;
            navAvatar.style.display = 'block';
            const placeholder = navAvatar.nextElementSibling;
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
        
        return newAvatarUrl;
    }

    // 设置指定头像
    setAvatar(avatarElement, avatarUrl) {
        avatarElement.src = avatarUrl;
        
        // 同时更新导航栏头像
        const navAvatar = document.querySelector('.nav-user .user-avatar');
        if (navAvatar) {
            navAvatar.src = avatarUrl;
            navAvatar.style.display = 'block';
            const placeholder = navAvatar.nextElementSibling;
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    }

    // 显示头像占位符
    showPlaceholder(name) {
        const navAvatar = document.querySelector('.nav-user .user-avatar');
        if (navAvatar) {
            navAvatar.style.display = 'none';
            const placeholder = navAvatar.nextElementSibling;
            if (placeholder) {
                placeholder.style.display = 'flex';
                const span = placeholder.querySelector('span');
                if (span) {
                    span.textContent = name.charAt(0);
                }
            }
        }
    }
} 