document.addEventListener("DOMContentLoaded", () => {
    const backToTopButton = document.createElement("div");
    backToTopButton.classList.add("back-to-top");
    backToTopButton.innerHTML = '<i class="fa-solid fa-up"></i>'; // 使用 Font Awesome 图标
    document.body.appendChild(backToTopButton);

    // 显示或隐藏按钮
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });

    // 返回顶部功能
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // 平滑滚动
        });
    });
});