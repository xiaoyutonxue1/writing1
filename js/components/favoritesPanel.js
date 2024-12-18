import { getFavorites, removeFavorite } from '../utils/favorites.js';

export function createFavoritesPanel() {
    return `
        <div class="favorites-panel">
            <div class="panel-header">
                <h3><i class="fas fa-star"></i> 我的收藏</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="panel-content">
                <div class="favorites-list"></div>
            </div>
        </div>
    `;
}

export function initializeFavoritesPanel(container) {
    const panel = container.querySelector('.favorites-panel');
    const closeBtn = panel.querySelector('.close-btn');
    const favoritesList = panel.querySelector('.favorites-list');

    function updateFavoritesList() {
        const favorites = getFavorites();
        favoritesList.innerHTML = favorites.length ? favorites.map(item => `
            <div class="favorite-item" data-id="${item.id}">
                <div class="favorite-content">
                    <h4>${item.title}</h4>
                    <p>${item.preview}</p>
                    <div class="favorite-meta">
                        <span><i class="fas fa-clock"></i> ${new Date(item.savedAt).toLocaleDateString()}</span>
                        <span><i class="fas fa-tag"></i> ${item.type}</span>
                    </div>
                </div>
                <div class="favorite-actions">
                    <button class="use-btn" title="引用内容">
                        <i class="fas fa-quote-right"></i>
                    </button>
                    <button class="remove-btn" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('') : '<div class="empty-message">暂无收藏内容</div>';

        // Add event listeners to buttons
        panel.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.favorite-item');
                const id = parseInt(item.dataset.id);
                if (confirm('确定要删除这个收藏吗？')) {
                    removeFavorite(id);
                    updateFavoritesList();
                }
            });
        });

        panel.querySelectorAll('.use-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.favorite-item');
                const id = parseInt(item.dataset.id);
                const favorite = getFavorites().find(f => f.id === id);
                if (favorite && window.editor) {
                    window.editor.insertContent(favorite.content);
                }
            });
        });
    }

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('show');
    });

    // Initial load
    updateFavoritesList();

    return {
        show: () => panel.classList.add('show'),
        hide: () => panel.classList.remove('show'),
        update: updateFavoritesList
    };
}