document.addEventListener('DOMContentLoaded', loadTasks);

const addTaskButton = document.getElementById('add-task-btn');
const taskFormContainer = document.getElementById('task-form-container');
const saveTaskButton = document.getElementById('save-task');
const cancelTaskButton = document.getElementById('cancel-task');
const taskList = document.getElementById('task-list');

// Mostrar o formulário ao clicar em "Adicionar Nova Tarefa"
addTaskButton.addEventListener('click', () => {
    taskFormContainer.classList.remove('hidden');
    addTaskButton.classList.add('hidden');
});

// Cancelar e esconder o formulário
cancelTaskButton.addEventListener('click', () => {
    resetForm();
});

// Salvar tarefa e adicioná-la à lista
saveTaskButton.addEventListener('click', addTask);

function addTask() {
    const taskName = document.getElementById('task-name').value.trim();
    const taskDesc = document.getElementById('task-desc').value.trim();
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const priority = document.getElementById('priority').value;

    if (!taskName || !taskDesc || !startDate || !endDate || !priority) return;

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

    taskInfo.appendChild(taskName);
    taskInfo.appendChild(taskDesc);
    taskInfo.appendChild(taskDates);
    taskInfo.appendChild(taskPriority);

    taskItem.appendChild(taskInfo);

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
            dates: task.querySelector('.task-dates').textContent,
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
            task.dates.split('|')[0].replace('Início: ', ''),
            task.dates.split('|')[1].replace('Fim: ', ''),
            task.priority.replace('task-priority-', '')
        );
        taskList.appendChild(taskItem);
    });
}
