document.addEventListener('DOMContentLoaded', () => {
    // 创建回到顶部按钮
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '<i class="fa-solid fa-up"></i>';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.width = '50px'; // 设置宽度
    backToTopButton.style.height = '50px'; // 设置高度
    backToTopButton.style.borderRadius = '50%'; // 圆形按钮
    backToTopButton.style.backgroundColor = '#fff'; // 白色背景
    backToTopButton.style.color = '#333'; // 深色箭头
    backToTopButton.style.border = '1px solid #ccc'; // 添加边框
    backToTopButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // 添加阴影
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.opacity = '0'; // 初始透明
    backToTopButton.style.transition = 'opacity 0.3s ease'; // 添加淡入淡出效果
    backToTopButton.style.zIndex = '1000';
    document.body.appendChild(backToTopButton);

    // 显示或隐藏按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // 滚动超过 300px 时显示按钮
            backToTopButton.style.opacity = '1'; // 淡入
        } else {
            backToTopButton.style.opacity = '0'; // 淡出
        }
    });

    // 点击按钮回到顶部
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动
        });
    });
});