/**
 * 知行录 - UI 渲染模块
 */

const UIRenderer = {
    currentModule: null,
    currentItemId: null,
    currentFilter: 'all',
    currentSort: 'default',

    // 渲染所有模块
    renderAll() {
        this.updateCounts();
        this.renderGrid('books');
        this.renderGrid('history');
        this.renderGrid('shanhaijing');
    },

    // 更新模块数量
    updateCounts() {
        const data = DataManager.data;
        const booksCount = document.getElementById('booksCount');
        const historyCount = document.getElementById('historyCount');
        const shanhaijingCount = document.getElementById('shanhaijingCount');

        if (booksCount) booksCount.textContent = `(${data.books?.length || 0})`;
        if (historyCount) historyCount.textContent = `(${data.history?.length || 0})`;
        if (shanhaijingCount) shanhaijingCount.textContent = `(${data.shanhaijing?.length || 0})`;
    },

    // 渲染网格
    renderGrid(module) {
        const grid = document.getElementById(module + 'Grid');
        const items = DataManager.getModule(module);
        
        if (!items || !items.length) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">📭</div>
                    <p>暂无内容</p>
                </div>`;
            return;
        }

        // 渲染筛选器
        this.renderFilters(module, items);
        
        // 应用筛选和排序
        const filtered = this.getFilteredAndSorted(items, module);
        
        // 渲染卡片
        grid.innerHTML = filtered.map(item => this.createCardHTML(module, item)).join('');
        
        // 绑定懒加载
        this.initLazyLoading();
    },

    // 渲染筛选器
    renderFilters(module, items) {
        const tags = [...new Set(items.map(i => i.tag).filter(Boolean))];
        const filters = document.getElementById(module + 'Filters');
        
        let filterHTML = `<span class="filter-chip ${this.currentFilter === 'all' ? 'active' : ''}" 
            onclick="UIRenderer.setFilter('${module}', 'all')" 
            role="button" 
            tabindex="0"
            aria-pressed="${this.currentFilter === 'all'}">全部</span>`;
        
        tags.forEach(tag => {
            filterHTML += `<span class="filter-chip ${this.currentFilter === tag ? 'active' : ''}" 
                onclick="UIRenderer.setFilter('${module}', '${tag}')" 
                role="button" 
                tabindex="0"
                aria-pressed="${this.currentFilter === tag}">${tag}</span>`;
        });

        // 添加排序控件
        filterHTML += `
            <div class="sort-controls" style="margin-left: auto;">
                <select class="sort-select" onchange="UIRenderer.setSort('${module}', this.value)" aria-label="排序方式">
                    <option value="default">默认排序</option>
                    <option value="year-asc">年份 ↑</option>
                    <option value="year-desc">年份 ↓</option>
                    <option value="title-asc">标题 A-Z</option>
                    <option value="title-desc">标题 Z-A</option>
                </select>
            </div>`;

        filters.innerHTML = filterHTML;
    },

    // 获取筛选和排序后的数据
    getFilteredAndSorted(items, module) {
        let filtered = items;
        
        // 应用筛选
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(i => i.tag === this.currentFilter);
        }

        // 应用排序
        switch (this.currentSort) {
            case 'year-asc':
                filtered = [...filtered].sort((a, b) => (a.year || 0) - (b.year || 0));
                break;
            case 'year-desc':
                filtered = [...filtered].sort((a, b) => (b.year || 0) - (a.year || 0));
                break;
            case 'title-asc':
                filtered = [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || '', 'zh'));
                break;
            case 'title-desc':
                filtered = [...filtered].sort((a, b) => (b.title || '').localeCompare(a.title || '', 'zh'));
                break;
        }

        return filtered;
    },

    // 创建卡片 HTML
    createCardHTML(module, item) {
        const isFav = StorageManager.isFavorite(module, item.id);
        const coverHTML = item.coverImage 
            ? `<img data-src="${item.coverImage}" alt="${item.title}" class="lazy-image">`
            : item.icon || '📖';
        
        return `
            <article class="card" 
                tabindex="0" 
                onclick="App.showDetail('${module}', ${item.id})" 
                onkeydown="if(event.key==='Enter')App.showDetail('${module}',${item.id})"
                role="button"
                aria-label="查看 ${item.title} 详情">
                <button class="card-favorite ${isFav ? 'active' : ''}" 
                    onclick="event.stopPropagation(); UIRenderer.toggleFavoriteCard('${module}', ${item.id}, this)"
                    aria-label="${isFav ? '取消收藏' : '收藏'}"
                    aria-pressed="${isFav}">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <div class="card-cover">${coverHTML}</div>
                <div class="card-body">
                    <div class="card-tag">${item.tag || ''}</div>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-subtitle">${item.subtitle || ''}</p>
                    <p class="card-summary">${item.summary || ''}</p>
                </div>
            </article>`;
    },

    // 切换收藏状态
    toggleFavoriteCard(module, id, btn) {
        const isFav = StorageManager.toggleFavorite(module, id);
        btn.classList.toggle('active', isFav);
        btn.innerHTML = isFav ? '❤️' : '🤍';
        btn.setAttribute('aria-pressed', isFav);
        btn.setAttribute('aria-label', isFav ? '取消收藏' : '收藏');
    },

    // 设置筛选
    setFilter(module, filter) {
        this.currentFilter = filter;
        this.renderGrid(module);
    },

    // 设置排序
    setSort(module, sort) {
        this.currentSort = sort;
        this.renderGrid(module);
    },

    // 初始化懒加载
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-image');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('.lazy-image').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // 降级处理
            document.querySelectorAll('.lazy-image').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },

    // 渲染骨架屏
    showSkeleton(count = 6) {
        const grids = ['booksGrid', 'historyGrid', 'shanhaijingGrid'];
        grids.forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (grid) {
                grid.innerHTML = Array(count).fill('').map(() => `
                    <div class="skeleton-card">
                        <div class="skeleton-cover"></div>
                        <div class="skeleton-body">
                            <div class="skeleton-line short"></div>
                            <div class="skeleton-line medium"></div>
                            <div class="skeleton-line"></div>
                        </div>
                    </div>
                `).join('');
            }
        });
    },

    // 隐藏骨架屏
    hideSkeleton() {
        document.querySelectorAll('.skeleton-card').forEach(el => el.remove());
    }
};
