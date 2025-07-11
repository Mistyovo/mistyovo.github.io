// 侧边栏切换功能
(function() {
    let sidebarVisible = true;
    const sidebar = document.querySelector('.sidebar');
    const outer = document.querySelector('.outer');
    const toggleBtn = document.querySelector('.sidebar-toggle i');
    
    if (!sidebar || !outer) return;
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = function() {
        if (window.innerWidth < 768 && sidebarVisible) {
            toggleSidebar();
        }
    };
    document.body.appendChild(overlay);
    
    // 切换侧边栏显示/隐藏
    window.toggleSidebar = function() {
        sidebarVisible = !sidebarVisible;
        const isMobile = window.innerWidth < 768;
        
        if (sidebarVisible) {
            // 显示侧边栏
            sidebar.classList.remove('sidebar-hidden');
            sidebar.classList.add('sidebar-visible');
            
            if (isMobile) {
                overlay.classList.add('sidebar-overlay-show');
                document.body.style.overflow = 'hidden'; // 防止滚动
            } else {
                outer.classList.remove('outer-fullwidth');
                outer.classList.add('outer-sidebar');
            }
            
            // 更新按钮图标
            if (toggleBtn) {
                toggleBtn.className = 'fa-solid fa-bars';
            }
        } else {
            // 隐藏侧边栏
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
            
            if (isMobile) {
                overlay.classList.remove('sidebar-overlay-show');
                document.body.style.overflow = ''; // 恢复滚动
            } else {
                outer.classList.remove('outer-sidebar');
                outer.classList.add('outer-fullwidth');
            }
            
            // 更新按钮图标
            if (toggleBtn) {
                toggleBtn.className = 'fa-solid fa-angles-right';
            }
        }
    };
    
    // 初始化状态
    sidebar.classList.add('sidebar-visible');
    if (window.innerWidth >= 768) {
        outer.classList.add('outer-sidebar');
    }
    
    // 响应式处理：在小屏幕上自动隐藏侧边栏
    function handleResize() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth < 768) {
            // 小屏幕时自动隐藏侧边栏
            if (sidebarVisible) {
                sidebarVisible = false;
                sidebar.classList.remove('sidebar-visible');
                sidebar.classList.add('sidebar-hidden');
                overlay.classList.remove('sidebar-overlay-show');
                document.body.style.overflow = '';
                
                if (toggleBtn) {
                    toggleBtn.className = 'fa-solid fa-angles-right';
                }
            }
            // 移动端时移除outer的margin调整
            outer.classList.remove('outer-sidebar', 'outer-fullwidth');
        } else {
            // 大屏幕时恢复侧边栏并调整outer
            if (!sidebarVisible) {
                sidebarVisible = true;
                sidebar.classList.remove('sidebar-hidden');
                sidebar.classList.add('sidebar-visible');
                
                if (toggleBtn) {
                    toggleBtn.className = 'fa-solid fa-bars';
                }
            }
            
            // 桌面端时调整outer位置
            if (sidebarVisible) {
                outer.classList.remove('outer-fullwidth');
                outer.classList.add('outer-sidebar');
            } else {
                outer.classList.remove('outer-sidebar');
                outer.classList.add('outer-fullwidth');
            }
            
            // 移除移动端的遮罩和滚动限制
            overlay.classList.remove('sidebar-overlay-show');
            document.body.style.overflow = '';
        }
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 页面加载时检查屏幕大小
    handleResize();
    
    // 键盘快捷键支持 (Ctrl + B)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
    });
})();
