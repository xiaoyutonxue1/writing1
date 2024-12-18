// Favorites utility functions
export function saveFavorite(item) {
    const favorites = getFavorites();
    favorites.push({
        ...item,
        id: Date.now(),
        savedAt: new Date().toISOString()
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

export function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

export function removeFavorite(id) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(item => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
}