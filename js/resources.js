// 资源导航页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有元素
    const tabs = document.querySelectorAll('.tab-item');
    const categories = document.querySelectorAll('.resource-category');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    // 分类筛选功能
    function initTabSwitching() {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.dataset.category;
                
                // 更新活跃标签
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // 先隐藏所有分类
                const hidePromises = [];
                categories.forEach(cat => {
                    if (category === 'all' || cat.dataset.category === category) {
                        // 如果是要显示的分类，先确保它们也被隐藏
                        if (cat.classList.contains('fade-in')) {
                            cat.classList.remove('fade-in');
                            const hidePromise = new Promise(resolve => {
                                setTimeout(resolve, 500); // 等待淡出动画完成
                            });
                            hidePromises.push(hidePromise);
                        }
                    } else {
                        // 隐藏不需要显示的分类
                        cat.classList.remove('fade-in');
                        const hidePromise = new Promise(resolve => {
                            setTimeout(() => {
                                cat.style.display = 'none';
                                resolve();
                            }, 500);
                        });
                        hidePromises.push(hidePromise);
                    }
                });
                
                // 等待所有隐藏动画完成后，再显示新的分类
                Promise.all(hidePromises).then(() => {
                    categories.forEach((cat, index) => {
                        if (category === 'all' || cat.dataset.category === category) {
                            cat.style.display = 'block';
                            // 稍微延迟后开始淡入动画，创建更平滑的过渡
                            setTimeout(() => {
                                cat.classList.add('fade-in');
                            }, 50 + index * 100);
                        }
                    });
                });
            });
        });
    }
    
    // 卡片悬停效果增强
    function initCardEffects() {
        resourceCards.forEach(card => {
            // 点击卡片打开链接
            card.addEventListener('click', function(e) {
                if (e.target.closest('.resource-link')) return;
                
                const linkElement = this.querySelector('.resource-link');
                if (linkElement) {
                    window.open(linkElement.href, '_blank');
                }
            });
        });
    }
    
    // 搜索功能
    function initSearch() {
        const searchInput = document.getElementById('resourceSearch');
        const clearBtn = document.getElementById('clearSearch');
        
        if (!searchInput || !clearBtn) return; // 确保元素存在
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            clearBtn.style.display = searchTerm ? 'block' : 'none';
            
            // 如果有搜索词，显示所有分类
            if (searchTerm) {
                categories.forEach(cat => {
                    cat.style.display = 'block';
                });
            }
            
            // 过滤资源卡片
            resourceCards.forEach(card => {
                const name = card.querySelector('.resource-name').textContent.toLowerCase();
                const description = card.querySelector('.resource-description').textContent.toLowerCase();
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
                
                const isMatch = name.includes(searchTerm) || 
                              description.includes(searchTerm) || 
                              tags.some(tag => tag.includes(searchTerm));
                
                if (isMatch) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0.3';
                    card.style.pointerEvents = 'none';
                }
            });
            
            // 如果没有搜索词，恢复标签筛选
            if (!searchTerm) {
                const activeTab = document.querySelector('.tab-item.active');
                if (activeTab) {
                    activeTab.click();
                }
                resourceCards.forEach(card => {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';
                });
            }
        });
        
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
        });
    }
    
    // 滚动显示动画
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        categories.forEach(category => {
            observer.observe(category);
        });
    }
    
    // 添加loading动画
    function initLoadingAnimation() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'resources-loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p>加载资源中...</p>
        `;
        
        document.querySelector('.resources').appendChild(loadingDiv);
        
        setTimeout(() => {
            loadingDiv.style.opacity = '0';
            setTimeout(() => {
                loadingDiv.remove();
            }, 300);
        }, 800);
    }
    
    // 初始化所有功能
    initTabSwitching();
    initCardEffects();
    initSearch();
    initScrollAnimations();
    initLoadingAnimation();
    
    // 初始显示动画
    setTimeout(() => {
        categories.forEach((cat, index) => {
            setTimeout(() => {
                cat.classList.add('fade-in');
            }, index * 200);
        });
    }, 100);
});

// 添加加载动画样式
const loadingStyles = `
<style>
.resources-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.3s ease;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #8bb3dd;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.resources-loading p {
    color: #666;
    font-size: 16px;
    margin: 0;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', loadingStyles);
