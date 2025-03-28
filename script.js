document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let priority = document.getElementById("priority").value;
    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    let task = createTaskElement(taskText, priority);
    document.getElementById("todo").appendChild(task);
    taskInput.value = "";

    saveTasks();
    updateTaskCount();
}

function createTaskElement(text, priority) {
    let task = document.createElement("div");
    task.className = `task ${priority}`;
    task.draggable = true;
    task.ondragstart = drag;
    task.ondblclick = () => editTask(task);
    task.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn" onclick="deleteTask(this)">X</button>
    `;
    return task;
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
}

function drop(event) {
    event.preventDefault();
    
    let draggingTask = document.querySelector(".dragging");
    if (draggingTask) {
        event.target.appendChild(draggingTask);
        draggingTask.classList.remove("dragging");
    }
    
    saveTasks();
    updateTaskCount();
}

function deleteTask(button) {
    button.parentElement.remove();
    saveTasks();
    updateTaskCount();
}

function editTask(task) {
    let newText = prompt("Edit your task:", task.firstChild.textContent);
    if (newText !== null) {
        task.firstChild.textContent = newText;
        saveTasks();
    }
}

function saveTasks() {
    let tasks = {
        todo: document.getElementById("todo").innerHTML,
        completed: document.getElementById("completed").innerHTML,
    };
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
        document.getElementById("todo").innerHTML = savedTasks.todo;
        document.getElementById("completed").innerHTML = savedTasks.completed;
    }

    // Reapply event listeners after loading from LocalStorage
    document.querySelectorAll(".task").forEach(task => {
        task.draggable = true;
        task.ondragstart = drag;
        task.ondblclick = () => editTask(task);
    });

    updateTaskCount();
}

function updateTaskCount() {
    document.getElementById("todoCount").textContent = document.getElementById("todo").children.length;
    document.getElementById("completedCount").textContent = document.getElementById("completed").children.length;
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}
