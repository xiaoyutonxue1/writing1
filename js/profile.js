import { getFavorites, removeFavorite } from './utils/favorites.js';
import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize ability radar chart
    const abilityCtx = document.getElementById('abilityChart');
    new Chart(abilityCtx, {
        type: 'radar',
        data: {
            labels: ['内容构思', '语言表达', '结构组织', '写作技巧', '创新思维'],
            datasets: [{
                label: '能力水平',
                data: [85, 92, 78, 88, 82],
                backgroundColor: 'rgba(24, 144, 255, 0.2)',
                borderColor: '#1890ff',
                pointBackgroundColor: '#1890ff',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#1890ff'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Initialize progress line chart
    const progressCtx = document.getElementById('progressChart');
    new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '写作水平',
                data: [65, 70, 75, 82, 88, 92],
                borderColor: '#1890ff',
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Initialize favorites
    function updateFavorites() {
        const favorites = getFavorites();
        const favoritesGrid = document.querySelector('.favorites-grid');
        favoritesGrid.innerHTML = favorites.length ? favorites.map(item => `
            <div class="favorite-card" data-id="${item.id}">
                <div class="favorite-header">
                    <h4>${item.title}</h4>
                    <button class="remove-btn" title="删除">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <p>${item.preview}</p>
                <div class="favorite-meta">
                    <span><i class="fas fa-clock"></i> ${new Date(item.savedAt).toLocaleDateString()}</span>
                    <span><i class="fas fa-tag"></i> ${item.type}</span>
                </div>
            </div>
        `).join('') : '<div class="empty-message">暂无收藏内容</div>';

        // Add event listeners to remove buttons
        document.querySelectorAll('.favorite-card .remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.favorite-card');
                const id = parseInt(card.dataset.id);
                if (confirm('确定要删除这个收藏吗？')) {
                    removeFavorite(id);
                    updateFavorites();
                }
            });
        });
    }

    // Initial load
    updateFavorites();

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Avatar upload
    const editAvatarBtn = document.querySelector('.edit-avatar');
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
});