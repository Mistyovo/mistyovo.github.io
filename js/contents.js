document.addEventListener('DOMContentLoaded', function () {
    const content = document.querySelector('.post');

    // Create draggable container for TOC
    const tocContainer = document.createElement('div');
    tocContainer.id = 'toc-container';
    tocContainer.classList.add('draggable-toc'); // Add class for styling

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '目录';
    toggleButton.classList.add('toggle-button'); // Add class for styling

    // Create TOC list
    const toc = document.createElement('ul');
    toc.classList.add('toc-list'); // Add class for styling
    tocContainer.appendChild(toggleButton);
    tocContainer.appendChild(toc);
    document.body.appendChild(tocContainer);

    // Add toggle functionality
    let isCollapsed = true; // Default state is collapsed
    toggleButton.addEventListener('click', function () {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            toc.style.maxHeight = '0';
            toggleButton.textContent = '目录';
        } else {
            toc.style.maxHeight = '500px'; // Adjust max height as needed
            toggleButton.textContent = '目录';
        }
    });

    const headers = content.querySelectorAll('h2, h3, h4, h5, h6'); // Select headers

    headers.forEach((header, index) => {
        // Create anchor
        const anchorId = `header-${index}`;
        header.id = anchorId;

        // Create list item
        const listItem = document.createElement('li');
        listItem.classList.add(`header-level-${header.tagName[1]}`); // Add class for indentation

        // Create link
        const link = document.createElement('a');
        link.href = `#${anchorId}`;
        link.textContent = header.textContent;

        // Add smooth scrolling behavior
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default anchor behavior
            const targetElement = document.getElementById(anchorId);
            const offset = 70; // Adjust for navbar height
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth' // Smooth scrolling
            });

            // Automatically collapse the TOC after scrolling
            toc.style.maxHeight = '0';
            toggleButton.textContent = '目录';
            isCollapsed = true;
        });

        listItem.appendChild(link);
        toc.appendChild(listItem);
    });

    // Add IntersectionObserver to highlight visible headers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const targetId = entry.target.id;
            const listItem = toc.querySelector(`a[href="#${targetId}"]`).parentElement;

            if (entry.isIntersecting) {
                listItem.style.color = '#00bbff'; // Highlight the marker
            } else {
                listItem.style.color = '#FFC0CB'; // Reset the marker
            }
        });
    }, {
        root: null,
        threshold: 0.5 // Trigger when 50% of the header is visible
    });

    headers.forEach(header => {
        observer.observe(header);
    });

    // Add drag functionality
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