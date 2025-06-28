// 等待DOM内容加载完成
document.addEventListener('DOMContentLoaded', function () {
    const content = document.querySelector('.post'); // 获取文章内容区域

    // 创建可拖拽的目录容器
    const tocContainer = document.createElement('div');
    tocContainer.id = 'toc-container';
    tocContainer.classList.add('draggable-toc'); // 添加样式类

    // 创建目录切换按钮
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '目录';
    toggleButton.classList.add('toggle-button'); // 添加样式类

    // 创建目录列表
    const toc = document.createElement('ul');
    toc.classList.add('toc-list'); // 添加样式类
    tocContainer.appendChild(toggleButton);
    tocContainer.appendChild(toc);
    document.body.appendChild(tocContainer);

    // 添加目录展开/收起功能
    let isCollapsed = false; // 默认收起
    toc.style.maxHeight = '500px';
    toggleButton.addEventListener('click', function () {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            toc.style.maxHeight = '0';
            toggleButton.textContent = '目录';
        } else {
            toc.style.maxHeight = '500px'; // 可根据需要调整最大高度
            toggleButton.textContent = '目录';
        }
    });

    // 获取所有标题（h2~h6）
    const headers = content.querySelectorAll('h2, h3, h4, h5, h6');

    headers.forEach((header, index) => {
        // 创建锚点id
        const anchorId = `header-${index}`;
        header.id = anchorId;

        // 创建目录项
        const listItem = document.createElement('li');
        listItem.classList.add(`header-level-${header.tagName[1]}`); // 根据标题级别添加缩进样式

        // 创建目录链接
        const link = document.createElement('a');
        link.href = `#${anchorId}`;
        link.textContent = header.textContent;

        // 添加平滑滚动行为
        link.addEventListener('click', function (event) {
            event.preventDefault(); // 阻止默认跳转
            const targetElement = document.getElementById(anchorId);
            const offset = 70; // 可根据导航栏高度调整
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth' // 平滑滚动
            });

            // 滚动后自动收起目录
            toc.style.maxHeight = '0';
            toggleButton.textContent = '目录';
            isCollapsed = true;
        });

        listItem.appendChild(link);
        toc.appendChild(listItem);
    });

    // 使用IntersectionObserver高亮当前可见标题
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const targetId = entry.target.id;
            const listItem = toc.querySelector(`a[href="#${targetId}"]`).parentElement;

            if (entry.isIntersecting) {
                listItem.style.color = '#00bbff'; // 高亮当前目录项
            } else {
                listItem.style.color = '#FFC0CB'; // 恢复默认颜色
            }
        });
    }, {
        root: null,
        threshold: 0.5 // 当标题50%可见时触发
    });

    headers.forEach(header => {
        observer.observe(header); // 监听每个标题
    });

    // 添加目录拖拽功能
    let isDragging = false;
    let offsetX, offsetY;

    tocContainer.addEventListener('mousedown', function (event) {
        isDragging = true;
        offsetX = event.clientX - tocContainer.offsetLeft;
        offsetY = event.clientY - tocContainer.offsetTop;
    });

    document.addEventListener('mousemove', function (event) {
        if (isDragging) {
            tocContainer.style.left = `${event.clientX - offsetX}px`;
            tocContainer.style.top = `${event.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });
});