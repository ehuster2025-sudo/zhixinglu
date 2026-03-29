/**
 * 知行录 - 详情页渲染模块
 */

const DetailRenderer = {
    // 打开详情页
    async open(module, id) {
        const item = DataManager.getItem(module, id);
        if (!item) return;

        UIRenderer.currentModule = module;
        UIRenderer.currentItemId = id;

        // 保存阅读进度
        StorageManager.saveReadProgress(module, id, {
            lastViewed: Date.now(),
            section: 'top'
        });

        // 渲染头部
        this.renderHeader(item, module);
        
        // 渲染内容
        this.renderContent(item, module);
        
        // 显示遮罩
        document.getElementById('detailOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';

        // 滚动到顶部
        document.getElementById('detailOverlay').scrollTop = 0;
    },

    // 渲染头部
    renderHeader(item, module) {
        const isBook = module === 'books';
        
        document.getElementById('detailCover').innerHTML = item.coverImage 
            ? `<img src="${item.coverImage}" style="width:100%;height:100%;object-fit:cover;" alt="${item.title}">` 
            : item.icon || '📖';
            
        document.getElementById('detailTitle').textContent = item.title;
        document.getElementById('detailSubtitle').textContent = item.subtitle || '';
        
        const metaHTML = isBook 
            ? `<span><strong>年份</strong> ${item.year}</span><span><strong>类别</strong> ${item.category}</span>`
            : `<span><strong>标签</strong> ${item.tag}</span><span><strong>日期</strong> ${item.date}</span>`;
        
        document.getElementById('detailMeta').innerHTML = metaHTML;
    },

    // 渲染内容
    renderContent(item, module) {
        let html = '';

        // 面包屑导航
        html += this.renderBreadcrumb(item, module);

        // 每日一句（随机展示）
        const dailyQuote = DataManager.getDailyQuote();
        if (dailyQuote && Math.random() > 0.5) {
            html += this.renderDailyQuote(dailyQuote);
        }

        // 书籍简介
        if (item.summary) {
            html += `
                <section class="detail-section" id="section-summary">
                    <h2 class="detail-section-title">📖 书籍简介</h2>
                    <p class="book-summary">${item.summary}</p>
                </section>`;
        }

        // 作者介绍
        if (item.authorBackground) {
            html += this.renderAuthor(item.authorBackground);
        }

        // 核心要点
        if (item.keyPoints && item.keyPoints.length > 0) {
            html += this.renderKeyPoints(item.keyPoints);
        }

        // 章节简介
        if (item.chapters && item.chapters.length > 0) {
            html += this.renderChapters(item.chapters);
        }

        // 名言警句
        if (item.quotes && item.quotes.length > 0) {
            html += this.renderQuotes(item.quotes);
        }

        // 人物关系图
        if (item.characterMap && item.characterMap.relationships) {
            html += this.renderCharacterMap(item.characterMap);
        }

        // 延伸阅读
        if (item.extended && item.extended.length > 0) {
            html += this.renderExtended(item.extended);
        }

        // 阅读指南
        if (item.guide && item.guide.length > 0) {
            html += this.renderGuide(item.guide);
        }

        document.getElementById('detailContent').innerHTML = html;

        // 渲染目录导航
        this.renderTOC();
    },

    // 面包屑导航
    renderBreadcrumb(item, module) {
        const moduleNames = {
            books: '书籍摘要',
            history: '历史人物',
            shanhaijing: '山海经'
        };

        return `
            <nav class="breadcrumb" aria-label="面包屑导航">
                <a href="#" onclick="App.showHome(); return false;" aria-label="返回首页">🏠 首页</a>
                <span class="separator">›</span>
                <a href="#" onclick="App.showModule('${module}'); return false;">${moduleNames[module]}</a>
                <span class="separator">›</span>
                <span aria-current="page">${item.title}</span>
            </nav>`;
    },

    // 每日一句
    renderDailyQuote(quote) {
        return `
            <div class="daily-quote" role="complementary" aria-label="每日名言">
                <blockquote>"${quote.text}"</blockquote>
                <cite>—— ${quote.source}${quote.fromTitle ? `（出自《${quote.fromTitle}》）` : ''}</cite>
            </div>`;
    },

    // 作者介绍
    renderAuthor(author) {
        let html = `
            <section class="detail-section" id="section-author">
                <h2 class="detail-section-title">👤 作者介绍</h2>
                <div class="author-info">
                    <p><strong>${author.name}</strong></p>
                    <p>${author.desc}</p>`;

        if (author.motivation && author.motivation.length > 0) {
            html += `<p style="margin-top: 12px;"><strong>创作动机：</strong></p><ul class="guide-list">`;
            author.motivation.forEach(m => {
                html += `<li>${m}</li>`;
            });
            html += `</ul>`;
        }

        html += `</div></section>`;
        return html;
    },

    // 核心要点
    renderKeyPoints(keyPoints) {
        let html = `
            <section class="detail-section" id="section-keypoints">
                <h2 class="detail-section-title">💡 核心要点</h2>
                <div class="key-points">`;
        
        keyPoints.forEach((kp, idx) => {
            html += `
                <article class="key-point-item">
                    <span class="point-num" aria-hidden="true">${idx + 1}</span>
                    <div class="point-content">
                        <h3>${kp.title}</h3>
                        <p>${kp.content}</p>
                    </div>
                </article>`;
        });
        
        html += `</div></section>`;
        return html;
    },

    // 章节简介
    renderChapters(chapters) {
        let html = `
            <section class="detail-section" id="section-chapters">
                <h2 class="detail-section-title">📑 章节简介</h2>
                <div class="chapters-list">`;
        
        chapters.forEach(ch => {
            html += `
                <article class="chapter-item">
                    <h3>${ch.title}</h3>
                    <p>${ch.content}</p>
                </article>`;
        });
        
        html += `</div></section>`;
        return html;
    },

    // 名言警句
    renderQuotes(quotes) {
        let html = `
            <section class="detail-section" id="section-quotes">
                <h2 class="detail-section-title">💬 名言警句</h2>
                <div class="quotes-list">`;
        
        quotes.forEach(q => {
            html += `
                <blockquote class="quote-item">
                    <p>"${q.text}"</p>
                    <cite>—— ${q.source}</cite>
                </blockquote>`;
        });
        
        html += `</div></section>`;
        return html;
    },

    // 人物关系图
    renderCharacterMap(characterMap) {
        let html = `
            <section class="detail-section" id="section-characters">
                <h2 class="detail-section-title">👥 ${characterMap.title || '人物关系图'}</h2>
                <div class="character-map">`;
        
        characterMap.relationships.forEach(rel => {
            html += `
                <div class="relation-item">
                    <span class="rel-from">${rel.from}</span>
                    <span class="rel-arrow" aria-hidden="true">→</span>
                    <span class="rel-to">${rel.to}</span>
                    <span class="rel-desc">${rel.desc || rel.relation}</span>
                </div>`;
        });
        
        html += `</div></section>`;
        return html;
    },

    // 延伸阅读
    renderExtended(extended) {
        let html = `
            <section class="detail-section" id="section-extended">
                <h2 class="detail-section-title">📚 延伸阅读</h2>
                <div class="extended-list">`;
        
        extended.forEach(item => {
            html += `
                <article class="extended-item">
                    <h4>${item.title}</h4>
                    <p class="author">${item.author}</p>
                    <p>${item.desc}</p>
                </article>`;
        });
        
        html += `</div></section>`;
        return html;
    },

    // 阅读指南
    renderGuide(guide) {
        let html = `
            <section class="detail-section" id="section-guide">
                <h2 class="detail-section-title">📝 阅读指南</h2>
                <ul class="guide-list">`;
        
        guide.forEach(g => {
            html += `<li>${g}</li>`;
        });
        
        html += `</ul></section>`;
        return html;
    },

    // 渲染目录导航
    renderTOC() {
        const sections = document.querySelectorAll('.detail-section');
        if (sections.length === 0) return;

        // 移除已存在的 TOC
        const existingTOC = document.querySelector('.toc-container');
        if (existingTOC) existingTOC.remove();

        // 创建 TOC
        const tocContainer = document.createElement('nav');
        tocContainer.className = 'toc-container';
        tocContainer.setAttribute('aria-label', '目录导航');

        let tocHTML = '<div class="toc-title">📑 目录</div><ul class="toc-list">';
        
        sections.forEach((section, index) => {
            const title = section.querySelector('.detail-section-title');
            if (title) {
                const sectionId = section.id || `section-${index}`;
                section.id = sectionId;
                const text = title.textContent.replace(/^[^\s]+\s/, ''); // 移除 emoji
                tocHTML += `<li class="toc-item" data-target="${sectionId}" onclick="DetailRenderer.scrollToSection('${sectionId}')">${text}</li>`;
            }
        });
        
        tocHTML += '</ul>';
        tocContainer.innerHTML = tocHTML;
        document.body.appendChild(tocContainer);

        // 监听滚动更新高亮
        this.initTOCScrollSpy();
    },

    // 滚动到指定章节
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    // TOC 滚动监听
    initTOCScrollSpy() {
        const overlay = document.getElementById('detailOverlay');
        const sections = document.querySelectorAll('.detail-section');
        const tocItems = document.querySelectorAll('.toc-item');

        overlay.addEventListener('scroll', () => {
            let currentSection = '';
            const scrollPos = overlay.scrollTop + 150;

            sections.forEach(section => {
                if (section.offsetTop <= scrollPos) {
                    currentSection = section.id;
                }
            });

            tocItems.forEach(item => {
                item.classList.toggle('active', item.dataset.target === currentSection);
            });
        });
    },

    // 关闭详情页
    close() {
        document.getElementById('detailOverlay').classList.remove('active');
        document.body.style.overflow = '';
        
        // 移除 TOC
        const toc = document.querySelector('.toc-container');
        if (toc) toc.remove();
    }
};
