/**
 * 知行录 - 主应用入口
 */

const App = {
    async init() {
        try {
            // 初始化主题
            this.initTheme();
            
            // 显示骨架屏
            UIRenderer.showSkeleton();
            
            // 加载数据
            await DataManager.loadAll();
            
            // 隐藏骨架屏
            UIRenderer.hideSkeleton();
            
            // 渲染所有模块
            UIRenderer.renderAll();
            
            // 初始化搜索
            SearchManager.init();
            
            // 初始化分享
            ShareManager.init();
            
            // 记录访问
            StorageManager.recordVisit();
            
            console.log('知行录初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
            UIRenderer.hideSkeleton();
            alert('数据加载失败，请刷新页面重试');
        }
    },

    initTheme() {
        const theme = StorageManager.getTheme();
        document.documentElement.setAttribute('data-theme', theme);
    },

    // 显示首页
    showHome() {
        DetailRenderer.close();
        document.querySelector('.hero').style.display = 'block';
        document.getElementById('modulesSection').style.display = 'block';
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // 显示模块
    showModule(module) {
        UIRenderer.currentModule = module;
        document.querySelector('.hero').style.display = 'none';
        document.getElementById('modulesSection').style.display = 'none';
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(module + 'Section').classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // 显示详情
    showDetail(module, id) {
        DetailRenderer.open(module, id);
    },

    // 切换主题
    toggleTheme() {
        const newTheme = StorageManager.toggleTheme();
        console.log('主题切换为:', newTheme);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
