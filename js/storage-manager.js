/**
 * 知行录 - 本地存储管理模块
 */

const StorageManager = {
    KEYS: {
        FAVORITES: 'zhixinglu_favorites',
        READ_PROGRESS: 'zhixinglu_read_progress',
        THEME: 'zhixinglu_theme',
        LAST_VISIT: 'zhixinglu_last_visit'
    },

    // 收藏管理
    getFavorites() {
        try {
            const data = localStorage.getItem(this.KEYS.FAVORITES);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    addFavorite(module, id) {
        const favorites = this.getFavorites();
        const key = `${module}_${id}`;
        if (!favorites.includes(key)) {
            favorites.push(key);
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
        }
    },

    removeFavorite(module, id) {
        const favorites = this.getFavorites();
        const key = `${module}_${id}`;
        const index = favorites.indexOf(key);
        if (index > -1) {
            favorites.splice(index, 1);
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
        }
    },

    isFavorite(module, id) {
        const favorites = this.getFavorites();
        return favorites.includes(`${module}_${id}`);
    },

    toggleFavorite(module, id) {
        if (this.isFavorite(module, id)) {
            this.removeFavorite(module, id);
            return false;
        } else {
            this.addFavorite(module, id);
            return true;
        }
    },

    // 阅读进度管理
    getReadProgress(module, id) {
        try {
            const data = localStorage.getItem(this.KEYS.READ_PROGRESS);
            const progress = data ? JSON.parse(data) : {};
            return progress[`${module}_${id}`] || null;
        } catch {
            return null;
        }
    },

    saveReadProgress(module, id, progress) {
        try {
            const data = localStorage.getItem(this.KEYS.READ_PROGRESS);
            const allProgress = data ? JSON.parse(data) : {};
            allProgress[`${module}_${id}`] = {
                ...progress,
                timestamp: Date.now()
            };
            localStorage.setItem(this.KEYS.READ_PROGRESS, JSON.stringify(allProgress));
        } catch (e) {
            console.warn('保存阅读进度失败:', e);
        }
    },

    getLastReadItems() {
        try {
            const data = localStorage.getItem(this.KEYS.READ_PROGRESS);
            const progress = data ? JSON.parse(data) : {};
            return Object.entries(progress)
                .map(([key, value]) => ({
                    key,
                    ...value
                }))
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 5);
        } catch {
            return [];
        }
    },

    // 主题管理
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    },

    setTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
        document.documentElement.setAttribute('data-theme', theme);
    },

    toggleTheme() {
        const current = this.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
        return next;
    },

    // 访问记录
    recordVisit() {
        localStorage.setItem(this.KEYS.LAST_VISIT, Date.now().toString());
    },

    getLastVisit() {
        return localStorage.getItem(this.KEYS.LAST_VISIT);
    }
};
