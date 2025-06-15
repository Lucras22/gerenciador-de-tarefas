document.addEventListener('DOMContentLoaded', loadTasks);

const addTaskButton = document.getElementById('add-task-btn');
const taskFormContainer = document.getElementById('task-form-container');
const saveTaskButton = document.getElementById('save-task');
const cancelTaskButton = document.getElementById('cancel-task');
const taskList = document.getElementById('task-list');

addTaskButton.addEventListener('click', () => {
    taskFormContainer.classList.remove('hidden');
    addTaskButton.classList.add('hidden');
});

cancelTaskButton.addEventListener('click', () => {
    resetForm();
});

saveTaskButton.addEventListener('click', addTask);

function addTask() {
    const taskName = document.getElementById('task-name').value.trim();
    const taskDesc = document.getElementById('task-desc').value.trim();
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const priority = document.getElementById('priority').value;

    if (!taskName || !taskDesc || !startDate || !endDate || !priority) return;

    if (new Date(endDate) < new Date(startDate)) {
        alert("A data de fim não pode ser anterior à data de início.");
        return;
    }

    const taskItem = createTaskElement(taskName, taskDesc, startDate, endDate, priority);
    taskList.appendChild(taskItem);

    saveTasks();
    resetForm();
}

function createTaskElement(name, desc, start, end, priority) {
    const taskItem = document.createElement('li');
    taskItem.classList.add(`task-priority-${priority}`);

    const taskInfo = document.createElement('div');
    taskInfo.classList.add('task-info');

    const taskName = document.createElement('span');
    taskName.classList.add('task-name');
    taskName.textContent = `Nome: ${name}`;

    const taskDesc = document.createElement('span');
    taskDesc.classList.add('task-desc');
    taskDesc.textContent = `Descrição: ${desc}`;

    const taskDates = document.createElement('span');
    taskDates.classList.add('task-dates');
    taskDates.textContent = `Início: ${start} | Fim: ${end}`;

    const taskPriority = document.createElement('span');
    taskPriority.classList.add('task-priority');
    taskPriority.textContent = `Prioridade: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('delete-task-btn');
    deleteButton.addEventListener('click', () => {
        taskItem.remove();
        saveTasks();
    });

    taskInfo.appendChild(taskName);
    taskInfo.appendChild(taskDesc);
    taskInfo.appendChild(taskDates);
    taskInfo.appendChild(taskPriority);

    taskItem.appendChild(taskInfo);
    taskItem.appendChild(deleteButton);

    return taskItem;
}

function resetForm() {
    document.getElementById('task-form').reset();
    taskFormContainer.classList.add('hidden');
    addTaskButton.classList.remove('hidden');
}

function saveTasks() {
    const tasks = [];

    taskList.querySelectorAll('li').forEach(task => {
        tasks.push({
            name: task.querySelector('.task-name').textContent.replace('Nome: ', ''),
            desc: task.querySelector('.task-desc').textContent.replace('Descrição: ', ''),
            start: task.querySelector('.task-dates').textContent.split('|')[0].replace('Início: ', '').trim(),
            end: task.querySelector('.task-dates').textContent.split('|')[1].replace('Fim: ', '').trim(),
            priority: task.classList[0]
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        const taskItem = createTaskElement(
            task.name,
            task.desc,
            task.start,
            task.end,
            task.priority.replace('task-priority-', '')
        );
        taskList.appendChild(taskItem);
    });
}

const sortSelect = document.getElementById('sort-tasks');
sortSelect.addEventListener('change', sortTasks);

function sortTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    switch (sortSelect.value) {
        case 'importance':
            tasks.sort((a, b) => {
                const order = { 'task-priority-alta': 1, 'task-priority-media': 2, 'task-priority-baixa': 3 };
                return order[a.priority] - order[b.priority];
            });
            break;

        case 'date-near':
            tasks.sort((a, b) => new Date(a.start) - new Date(b.start));
            break;

        case 'date-far':
            tasks.sort((a, b) => new Date(b.start) - new Date(a.start));
            break;

        default:
            return;
    }

    // Limpa e recria a lista
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = createTaskElement(
            task.name,
            task.desc,
            task.start,
            task.end,
            task.priority.replace('task-priority-', '')
        );
        taskList.appendChild(taskItem);
    });
}
