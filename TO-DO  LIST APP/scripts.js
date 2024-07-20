document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const itemsLeft = document.getElementById("items-left");
    const addTaskBtn = document.getElementById("add-task-btn");
    const filterAll = document.getElementById("filter-all");
    const filterActive = document.getElementById("filter-active");
    const filterCompleted = document.getElementById("filter-completed");
    const clearCompletedBtn = document.getElementById("clear-completed-btn");

    addTaskBtn.addEventListener('click', addTask);
    filterAll.addEventListener('click', () => filterTasks('all'));
    filterActive.addEventListener('click', () => filterTasks('active'));
    filterCompleted.addEventListener('click', () => filterTasks('completed'));
    clearCompletedBtn.addEventListener('click', clearCompleted);

    inputBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    taskList.addEventListener("click", (e) => {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("checked");
            saveData();
            updateItemsLeft();
        } else if (e.target.tagName === "SPAN" || e.target.tagName === "I") {
            removeTask(e.target.closest("li"));
        }
    });

    function addTask() {
        const taskText = inputBox.value.trim();
        if (taskText === '') {
            alert("You must write something!");
        } else {
            const li = document.createElement("li");
            li.textContent = taskText;

            const span = document.createElement("span");
            span.textContent = "x";
            li.appendChild(span);

            taskList.appendChild(li);
            inputBox.value = '';
            saveData();
            updateItemsLeft();
        }
    }

    function removeTask(element) {
        element.remove();
        saveData();
        updateItemsLeft();
    }

    function filterTasks(filter) {
        const tasks = taskList.getElementsByTagName('li');
        for (let task of tasks) {
            switch (filter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'active':
                    if (task.classList.contains('checked')) {
                        task.style.display = 'none';
                    } else {
                        task.style.display = 'flex';
                    }
                    break;
                case 'completed':
                    if (task.classList.contains('checked')) {
                        task.style.display = 'flex';
                    } else {
                        task.style.display = 'none';
                    }
                    break;
            }
        }
        setActiveFilterButton(filter);
    }

    function setActiveFilterButton(filter) {
        filterAll.classList.remove('active');
        filterActive.classList.remove('active');
        filterCompleted.classList.remove('active');
        switch (filter) {
            case 'all':
                filterAll.classList.add('active');
                break;
            case 'active':
                filterActive.classList.add('active');
                break;
            case 'completed':
                filterCompleted.classList.add('active');
                break;
        }
    }

    function clearCompleted() {
        const tasks = taskList.getElementsByTagName('li');
        for (let i = tasks.length - 1; i >= 0; i--) {
            if (tasks[i].classList.contains('checked')) {
                tasks[i].remove();
            }
        }
        saveData();
        updateItemsLeft();
    }

    function updateItemsLeft() {
        const tasks = taskList.getElementsByTagName('li');
        let count = 0;
        for (let task of tasks) {
            if (!task.classList.contains('checked')) {
                count++;
            }
        }
        itemsLeft.textContent = `${count} tasks left`;
    }

    function saveData() {
        localStorage.setItem('tasks', taskList.innerHTML);
    }

    function loadData() {
        const data = localStorage.getItem('tasks');
        if (data) {
            taskList.innerHTML = data;
        }
        updateItemsLeft();
    }

    loadData();
});
