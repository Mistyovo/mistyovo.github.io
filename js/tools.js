//回到顶部
function scrollToTop() {

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

//打赏功能
function reward() {
    const rewardBox = document.getElementById('rewards');
    const overlay = document.getElementById('reward-overlay');
    
    // 如果悬浮窗已经显示，则隐藏
    if (rewardBox.classList.contains('show')) {
        closeReward();
        return;
    }
    
    // 显示悬浮窗
    showReward();
}

function showReward() {
    const rewardBox = document.getElementById('rewards');
    const overlay = document.getElementById('reward-overlay');
    
    // 显示遮罩层和悬浮窗
    rewardBox.style.display = 'block';
    overlay.style.display = 'block';
    
    // 使用setTimeout确保display设置生效后再添加动画类
    setTimeout(() => {
        overlay.classList.add('show');
        rewardBox.classList.add('show');
    }, 10);
    
    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
}

function closeReward() {
    const rewardBox = document.getElementById('rewards');
    const overlay = document.getElementById('reward-overlay');
    
    // 移除动画类
    overlay.classList.remove('show');
    rewardBox.classList.remove('show');
    
    // 延迟隐藏元素，等待动画完成
    setTimeout(() => {
        rewardBox.style.display = 'none';
        overlay.style.display = 'none';
    }, 300);
    
    // 恢复页面滚动
    document.body.style.overflow = '';
}

//图片放大
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.post img, .piclib img').forEach(function (img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.background = 'rgba(0,0,0,0.3)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = 9999;

            // Create enlarged image
            const enlargedImg = document.createElement('img');
            enlargedImg.src = img.src;
            enlargedImg.style.maxWidth = '90vw';
            enlargedImg.style.maxHeight = '90vh';
            enlargedImg.style.boxShadow = '0 0 20px #000';
            enlargedImg.style.borderRadius = '8px';
            enlargedImg.style.background = '#fff';

            overlay.appendChild(enlargedImg);

            // Click overlay to close
            overlay.addEventListener('click', function () {
                document.body.removeChild(overlay);
            });

            document.body.appendChild(overlay);
        });
    });
});

// 离开页面时改变Title
let originalTitle = document.title;

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.title = '别走啊～ (つд⊂) | ' + originalTitle;
    } else {
        document.title = originalTitle;
    }
});
// 监听窗口失去焦点
window.addEventListener('blur', function() {
    document.title = '别走啊～ (つд⊂) | ' + originalTitle;
});
// 监听窗口获得焦点
window.addEventListener('focus', function() {
    document.title = originalTitle;
});
