document.addEventListener("DOMContentLoaded", () => {
    const createSnowflake = () => {
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");

        // 随机生成雪花大小
        const size = Math.random() * 10 + 5; // 雪花半径在 5px 到 15px 之间
        snowflake.style.setProperty("--size", `${size}px`);

        // 根据大小设置速度（越大越快）
        const speed = `${Math.max(2, 10 - size / 2)+5}s`; // 大雪花速度更快
        snowflake.style.setProperty("--speed", speed);

        // 根据大小设置振幅（越大振幅越小）
        const amplitude = `${Math.max(10, 30 - size)}px`; // 大雪花振幅更小
        snowflake.style.setProperty("--amplitude", amplitude);

        // 随机水平位置
        snowflake.style.left = `${Math.random() * 100}vw`;

        snowflake.style.zIndex = 9999; // 确保雪花在最前面
        document.body.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove(); // 移除雪花，避免页面堆积
        }, parseFloat(speed) * 1000); // 根据动画持续时间移除雪花
    };

    setInterval(createSnowflake, 300); // 每 300 毫秒生成一个雪花
});