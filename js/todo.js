document.addEventListener('DOMContentLoaded', function () {
    const todoContainer = document.querySelector('.todo');
    const tasks = Array.from(todoContainer.children);

    tasks.sort((a, b) => {
        // 处理可能被链接包装的任务
        const taskA = a.classList.contains('task-link') ? a.querySelector('.task, .task-finish, .task-stopped') : a;
        const taskB = b.classList.contains('task-link') ? b.querySelector('.task, .task-finish, .task-stopped') : b;
        
        const aProgress = taskA.querySelector('.progress').textContent.split('/').map(Number);
        const bProgress = taskB.querySelector('.progress').textContent.split('/').map(Number);
        const aRatio = aProgress[0] / aProgress[1];
        const bRatio = bProgress[0] / bProgress[1];
        return bRatio - aRatio;
    });

    tasks.forEach(task => todoContainer.appendChild(task));
});
document.querySelectorAll('.task, .task-finish, .task-stopped').forEach(function (task) {
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