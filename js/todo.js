document.querySelectorAll('.task').forEach(function (task) {
    var progressText = task.querySelector('.progress').textContent.trim();
    var parts = progressText.split('/');
    var current = parseInt(parts[0], 10);
    var total = parseInt(parts[1], 10);
    var percent = total > 0 ? (current / total) * 100 : 0;

    var progContainer = document.createElement('div')
    progContainer.className = 'progContainer';
    var progBar = document.createElement('div')
    progBar.className = 'progBar';
    progContainer.appendChild(progBar)
    task.appendChild(progContainer)
    progBar.style.width = percent + '%';
});