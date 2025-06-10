document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.getElementById('avatar');
    let rotation = 0; // 记录当前旋转角度

    avatar.addEventListener('click', () => {
        rotation += 360; // 每次点击增加360度
        avatar.style.transition = 'transform 1s';
        avatar.style.transform = `rotate(${rotation}deg)`;
    });
});