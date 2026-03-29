/**
 * 知行录 - 搜索功能模块
 */

const SearchManager = {
    searchTimeout: null,
    isSearching: false,

    init() {
        const searchBox = document.getElementById('searchBox');
        const searchResults = document.getElementById('searchResults');

        if (!searchBox || !searchResults) return;

        // 输入事件
        searchBox.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // 聚焦事件
        searchBox.addEventListener('focus', () => {
            if (searchResults.classList.contains('active')) {
                searchResults.style.display = 'block';
            }
        });

        // 键盘事件
        searchBox.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.closeSearch();
            }
        });
    },

    async performSearch(keyword) {
        const searchResults = document.getElementById('searchResults');
        
        if (!keyword || keyword.trim().length === 0) {
            this.closeSearch();
            return;
        }

        this.isSearching = true;
        
        try {
            const results = DataManager.search(keyword);
            
            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="empty-state" style="padding: 40px 20px;">
                        <div class="empty-state-icon">🔍</div>
                        <p>未找到相关内容</p>
                    </div>`;
            } else {
                searchResults.innerHTML = results.slice(0, 10).map(item => {
                    const moduleNames = {
                        books: '📚 书籍',
                        history: '🏛️ 人物',
                        shanhaijing: '🐉 山海经'
                    };
                    
                    return `
                        <div class="search-result-item" onclick="App.showDetail('${item.module}', ${item.id}); SearchManager.closeSearch();">
                            <div class="result-title">${this.highlightText(item.title, keyword)}</div>
                            <div class="result-meta">
                                ${moduleNames[item.module] || item.module} 
                                ${item.subtitle ? `· ${this.highlightText(item.subtitle, keyword)}` : ''}
                                ${item.year ? `· ${item.year}` : ''}
                            </div>
                        </div>`;
                }).join('');
            }

            searchResults.classList.add('active');
            searchResults.style.display = 'block';
        } catch (error) {
            console.error('搜索失败:', error);
        } finally {
            this.isSearching = false;
        }
    },

    highlightText(text, keyword) {
        if (!text || !keyword) return text || '';
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },

    closeSearch() {
        const searchResults = document.getElementById('searchResults');
        const searchBox = document.getElementById('searchBox');
        
        if (searchResults) {
            searchResults.classList.remove('active');
            searchResults.style.display = 'none';
        }
        if (searchBox) {
            searchBox.value = '';
        }
    }
};
