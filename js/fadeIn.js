document.addEventListener('DOMContentLoaded', () => {
    // 选择 .outer 内的所有后代元素
    const outerElements = document.querySelectorAll('.outer *');

    // 筛选出直接带有文字的元素（textContent 非空且不全是空白）或图片元素
    const fadeElements = Array.from(outerElements).filter(element => {
        return element.textContent.trim().length > 0 || element.tagName === 'IMG';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible'); // 移除 visible 类
            }
        });
    });

    fadeElements.forEach(element => {
        element.classList.add('fade-in'); // 添加 fade-in 类
        observer.observe(element);
    });
});