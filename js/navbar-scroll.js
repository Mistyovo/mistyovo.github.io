// 导航栏滚动隐藏功能
(function() {
    let lastScrollTop = 0;
    let scrollTimeout;
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        // 清除之前的定时器
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // 判断是否在顶部或底部
        const isAtTop = scrollTop <= 50; // 顶部阈值
        const isAtBottom = scrollTop + windowHeight >= documentHeight - 50; // 底部阈值
        
        if (isAtTop || isAtBottom) {
            // 在顶部或底部时显示导航栏
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
        } else {
            // 在中间位置时判断滚动方向
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // 向下滚动且不在顶部时隐藏导航栏
                navbar.classList.remove('navbar-visible');
                navbar.classList.add('navbar-hidden');
            } else if (scrollTop < lastScrollTop) {
                // 向上滚动时显示导航栏
                navbar.classList.remove('navbar-hidden');
                navbar.classList.add('navbar-visible');
            }
        }
        
        // 设置延迟，在停止滚动后稍等一会再做最终判断
        scrollTimeout = setTimeout(function() {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isCurrentlyAtTop = currentScrollTop <= 50;
            const isCurrentlyAtBottom = currentScrollTop + windowHeight >= documentHeight - 50;
            
            if (!isCurrentlyAtTop && !isCurrentlyAtBottom) {
                // 如果停止滚动时不在顶部或底部，隐藏导航栏
                navbar.classList.remove('navbar-visible');
                navbar.classList.add('navbar-hidden');
            }
        }, 1000); // 1秒后隐藏
        
        lastScrollTop = scrollTop;
    }
    
    // 初始化状态
    navbar.classList.add('navbar-visible');
    
    // 监听滚动事件，使用节流优化性能
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(function() {
                ticking = false;
            }, 16); // 约60fps
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // 监听鼠标移动到顶部时显示导航栏
    document.addEventListener('mousemove', function(e) {
        if (e.clientY <= 50) {
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
        }
    });
})();
