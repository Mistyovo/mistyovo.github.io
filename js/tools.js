//回到顶部
function scrollToTop() {

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

//打赏
function reward() {
    if (document.getElementById('rewards').style.display == 'none') {
        console.log("change");
        document.getElementById('rewards').style.display = 'block';
        return;
    }
    if (document.getElementById('rewards').style.display == 'block') {
        console.log("change");
        document.getElementById('rewards').style.display = 'none';
    }
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

document.querySelector('.notice-bar .close-btn').onclick = function () {
    document.getElementById('noticeBar').style.display = 'none';
    document.body.style.paddingTop = '0';
};