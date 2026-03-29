/**
 * 知行录 - 数据加载与管理模块
 */

const DataManager = {
    data: { books: [], history: [], shanhaijing: [] },
    isLoading: false,

    async loadAll() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const ts = Date.now();
            const [booksRes, historyRes, shanhaijingRes] = await Promise.all([
                fetch(`./data/books.json?t=${ts}`),
                fetch(`./data/history.json?t=${ts}`),
                fetch(`./data/shanhaijing.json?t=${ts}`)
            ]);

            if (!booksRes.ok || !historyRes.ok || !shanhaijingRes.ok) {
                throw new Error('数据加载失败');
            }

            this.data.books = await booksRes.json();
            this.data.history = await historyRes.json();
            this.data.shanhaijing = await shanhaijingRes.json();

            console.log('数据加载成功:', this.data);
            return this.data;
        } catch (error) {
            console.error('加载错误:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    },

    getModule(moduleName) {
        return this.data[moduleName] || [];
    },

    getItem(moduleName, id) {
        return this.data[moduleName]?.find(item => item.id === id);
    },

    getAllQuotes() {
        const allQuotes = [];
        ['books', 'history', 'shanhaijing'].forEach(module => {
            this.data[module].forEach(item => {
                if (item.quotes) {
                    item.quotes.forEach(quote => {
                        allQuotes.push({
                            ...quote,
                            fromTitle: item.title,
                            fromModule: module
                        });
                    });
                }
            });
        });
        return allQuotes;
    },

    getDailyQuote() {
        const quotes = this.getAllQuotes();
        if (quotes.length === 0) return null;
        
        const today = new Date();
        const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % quotes.length;
        return quotes[dayIndex];
    },

    search(keyword) {
        if (!keyword || keyword.trim().length === 0) return [];

        const results = [];
        const lowerKeyword = keyword.toLowerCase();

        ['books', 'history', 'shanhaijing'].forEach(module => {
            this.data[module].forEach(item => {
                const searchableText = [
                    item.title,
                    item.subtitle,
                    item.summary,
                    item.tag,
                    item.category,
                    ...(item.quotes || []).map(q => q.text),
                    ...(item.keyPoints || []).map(kp => kp.title + ' ' + kp.content)
                ].join(' ').toLowerCase();

                if (searchableText.includes(lowerKeyword)) {
                    results.push({
                        ...item,
                        module,
                        matchType: this.getMatchType(item, lowerKeyword)
                    });
                }
            });
        });

        return results;
    },

    getMatchType(item, keyword) {
        if (item.title?.toLowerCase().includes(keyword)) return 'title';
        if (item.subtitle?.toLowerCase().includes(keyword)) return 'subtitle';
        if (item.summary?.toLowerCase().includes(keyword)) return 'summary';
        return 'content';
    }
};
