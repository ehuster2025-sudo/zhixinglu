/**
 * 知行录 - 分享功能模块
 */

const ShareManager = {
    isMenuOpen: false,

    init() {
        // 创建分享按钮
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.innerHTML = '🔗';
        shareBtn.setAttribute('aria-label', '分享');
        shareBtn.onclick = () => this.toggleMenu();
        document.body.appendChild(shareBtn);

        // 创建分享菜单
        const shareMenu = document.createElement('div');
        shareMenu.className = 'share-menu';
        shareMenu.id = 'shareMenu';
        shareMenu.innerHTML = `
            <button class="share-option" onclick="ShareManager.copyLink()">
                <span>📋</span> 复制链接
            </button>
            <button class="share-option" onclick="ShareManager.shareToWechat()">
                <span>💬</span> 微信分享
            </button>
            <button class="share-option" onclick="ShareManager.shareToWeibo()">
                <span>📢</span> 微博分享
            </button>
            <button class="share-option" onclick="ShareManager.generateImage()">
                <span>🖼️</span> 生成分享图
            </button>
        `;
        document.body.appendChild(shareMenu);

        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.share-btn') && !e.target.closest('.share-menu')) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        const menu = document.getElementById('shareMenu');
        this.isMenuOpen = !this.isMenuOpen;
        menu.classList.toggle('active', this.isMenuOpen);
    },

    closeMenu() {
        const menu = document.getElementById('shareMenu');
        this.isMenuOpen = false;
        menu.classList.remove('active');
    },

    getCurrentUrl() {
        return window.location.href;
    },

    getCurrentTitle() {
        return document.title;
    },

    async copyLink() {
        const url = this.getCurrentUrl();
        try {
            await navigator.clipboard.writeText(url);
            this.showToast('链接已复制到剪贴板');
        } catch {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('链接已复制到剪贴板');
        }
        this.closeMenu();
    },

    shareToWechat() {
        this.showToast('请截图后分享到微信');
        this.closeMenu();
    },

    shareToWeibo() {
        const url = encodeURIComponent(this.getCurrentUrl());
        const title = encodeURIComponent(this.getCurrentTitle());
        const weiboUrl = `https://service.weibo.com/share/share.php?url=${url}&title=${title}`;
        window.open(weiboUrl, '_blank');
        this.closeMenu();
    },

    generateImage() {
        this.showToast('分享图生成功能开发中...');
        this.closeMenu();
    },

    showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 0.9rem;
            z-index: 1000;
            animation: fadeInUp 0.3s ease;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
};
