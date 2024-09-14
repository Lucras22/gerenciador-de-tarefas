document.addEventListener('DOMContentLoaded', loadTasks);

const addTaskButton = document.getElementById('add-task');
const taskInput = document.getElementById('new-task');
const taskPrioritySelect = document.getElementById('task-priority'); // Captura o seletor de prioridade
const taskList = document.getElementById('task-list');
const completedTasks = document.getElementById('completed-tasks');

addTaskButton.addEventListener('click', addTask);
taskList.addEventListener('click', manageTask);
completedTasks.addEventListener('click', removeCompletedTask);

function addTask() {
    const taskText = taskInput.value.trim();
    const taskPriority = taskPrioritySelect.value; // Obtém o valor da prioridade

    if (taskText === '') return;

    const currentDateTime = new Date();
    const taskItem = createTaskElement(taskText, taskPriority, currentDateTime.toLocaleString(), currentDateTime.getTime());

    taskList.appendChild(taskItem);
    saveTasks();

    taskInput.value = '';
    taskPrioritySelect.value = 'media'; // Reseta o seletor para a prioridade padrão
}

function createTaskElement(text, priority, date, timestamp) {
    const taskItem = document.createElement('li');
    taskItem.classList.add(priority); // Adiciona a classe com base na prioridade

    const taskInfo = document.createElement('div');
    taskInfo.classList.add('task-info');

    const taskText = document.createElement('span');
    taskText.textContent = text;

    const taskPriority = document.createElement('span');
    taskPriority.classList.add('task-priority');
    taskPriority.textContent = `Prioridade: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`;

    const taskDate = document.createElement('span');
    taskDate.classList.add('task-date');
    taskDate.textContent = `Adicionado em: ${date}`;
    taskDate.setAttribute('data-timestamp', timestamp);

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Concluída';
    completeButton.classList.add('complete-task');

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';

    taskInfo.appendChild(taskText);
    taskInfo.appendChild(taskPriority); // Exibe a prioridade da tarefa
    taskInfo.appendChild(taskDate);
    taskItem.appendChild(taskInfo);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(removeButton);

    return taskItem;
}

function manageTask(event) {
    const item = event.target;

    if (item.classList.contains('complete-task')) {
        const taskItem = item.parentElement;
        const taskDateElem = taskItem.querySelector('.task-date');
        const addedTimestamp = parseInt(taskDateElem.getAttribute('data-timestamp'));
        const completionDate = new Date();
        const completionTimestamp = completionDate.getTime();

        const timeTaken = calculateTimeTaken(addedTimestamp, completionTimestamp);

        taskItem.classList.add('completed');
        taskItem.querySelector('.task-date').textContent += ` | Concluído em: ${completionDate.toLocaleString()}`;

        const timeTakenElem = document.createElement('div');
        timeTakenElem.classList.add('time-taken');
        timeTakenElem.textContent = `Tempo levado: ${timeTaken}`;
        taskItem.appendChild(timeTakenElem);

        completedTasks.appendChild(taskItem);

        item.remove(); // Remove o botão "Concluída" após a conclusão
    } else if (item.tagName === 'BUTTON' && !item.classList.contains('complete-task')) {
        const taskItem = item.parentElement;
        taskItem.remove();
    }

    saveTasks();
}

function removeCompletedTask(event) {
    const item = event.target;
    if (item.tagName === 'BUTTON') {
        const taskItem = item.parentElement;
        taskItem.remove();
        saveTasks();
    }
}

function calculateTimeTaken(addedTimestamp, completionTimestamp) {
    const milliseconds = completionTimestamp - addedTimestamp;
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeTaken = '';
    if (days > 0) timeTaken += `${days} dias `;
    if (hours % 24 > 0) timeTaken += `${hours % 24} horas `;
    if (minutes % 60 > 0) timeTaken += `${minutes % 60} minutos `;
    if (seconds % 60 > 0) timeTaken += `${seconds % 60} segundos`;

    return timeTaken.trim();
}

function saveTasks() {
    const tasks = [];
    const completed = [];

    taskList.querySelectorAll('li').forEach(task => {
        tasks.push({
            text: task.querySelector('.task-info span').textContent,
            priority: task.className, // Salva a prioridade da tarefa
            date: task.querySelector('.task-date').textContent,
            timestamp: task.querySelector('.task-date').getAttribute('data-timestamp')
        });
    });

    completedTasks.querySelectorAll('li').forEach(task => {
        completed.push({
            text: task.querySelector('.task-info span').textContent,
            priority: task.className, // Salva a prioridade da tarefa concluída
            date: task.querySelector('.task-date').textContent,
            timestamp: task.querySelector('.task-date').getAttribute('data-timestamp'),
            timeTaken: task.querySelector('.time-taken').textContent
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completed));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completed = JSON.parse(localStorage.getItem('completedTasks')) || [];

    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.priority, task.date, task.timestamp);
        taskList.appendChild(taskItem);
    });

    completed.forEach(task => {
        const taskItem = createTaskElement(task.text, task.priority, task.date, task.timestamp);
        taskItem.classList.add('completed');

        const timeTakenElem = document.createElement('div');
        timeTakenElem.classList.add('time-taken');
        timeTakenElem.textContent = task.timeTaken;
        taskItem.appendChild(timeTakenElem);

        taskItem.querySelector('.complete-task').remove();
        completedTasks.appendChild(taskItem);
    });
}
