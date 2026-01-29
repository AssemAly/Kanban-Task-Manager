import { TaskStatus, TaskPriority } from "./Helpers/enums.js";
import * as Helper from "./Helpers/helper.js";
const addTaskBtn = Helper.getElementById("addTaskBtn");
addTaskBtn.addEventListener("click", addTask);
const titleInput = Helper.getElementById("taskTitle");
const descriptionInput = Helper.getElementById("taskDescription");
const prioritySelect = Helper.getElementById("taskPriority");
const dueDateInput = Helper.getElementById("taskDueDate");
const todoContainer = Helper.getElementById("todo-container");
const progressContainer = Helper.getElementById("progress-container");
const completedContainer = Helper.getElementById("completed-container");
let isEditMode = false;
let editingTaskId = null;
renderTasks();
function addTask() {
    if (!titleInput.reportValidity()) {
        return;
    }
    const title = titleInput.value;
    const description = descriptionInput.value;
    const priority = prioritySelect.value;
    const dueDateValue = dueDateInput.value;
    const dueDate = new Date(dueDateValue);
    if (isEditMode && editingTaskId) {
        updateTask(editingTaskId, title, description, priority, dueDate);
    }
    else {
        const newTask = {
            id: crypto.randomUUID(),
            title: title,
            description: description,
            priority: priority,
            status: TaskStatus.Todo,
            dueDate: dueDate,
        };
        Helper.addToStorageList("tasks", newTask);
    }
    clearForm();
    closeModal();
    resetEditMode();
    renderTasks();
    Swal.fire({
        title: "Task Added Successfully",
        icon: "success",
        draggable: true,
    });
}
function updateTask(taskId, title, description, priority, dueDate) {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
        const existingTask = tasks[taskIndex];
        tasks[taskIndex] = {
            id: existingTask.id,
            title: title,
            description: description,
            priority: TaskPriority[priority],
            dueDate: dueDate,
            status: existingTask.status,
        };
        localStorage.setItem("tasks", JSON.stringify(tasks));
        Swal.fire({
            title: "Task Updated Successfully",
            icon: "success",
            draggable: true,
            timer: 1500,
            showConfirmButton: false,
        });
    }
}
function resetEditMode() {
    isEditMode = false;
    editingTaskId = null;
    const modalTitle = document.getElementById("addTaskModalLabel");
    const saveBtn = document.getElementById("addTaskBtn");
    if (modalTitle)
        modalTitle.textContent = "Add New Task";
    if (saveBtn)
        saveBtn.textContent = "Add Task";
}
function clearForm() {
    titleInput.value = "";
    descriptionInput.value = "";
    prioritySelect.value = "";
    dueDateInput.value = "";
}
function closeModal() {
    const modalElement = document.getElementById("addTaskModal");
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal === null || modal === void 0 ? void 0 : modal.hide();
    }
}
function renderTaskActions(taskStatus, taskId) {
    if (taskStatus === TaskStatus.Todo) {
        return `
         <button class="btn-start" data-id="${taskId}">
              <i class="bi bi-play-fill"></i> Start
            </button>
            <button class="btn-complete" data-id="${taskId}">
              <i class="bi bi-check"></i> Complete
            </button>
    `;
    }
    else if (taskStatus === TaskStatus.InProgress) {
        return `
        <button class="btn-complete" data-id="${taskId}">
          <i class="bi bi-check"></i> Complete
        </button>
        <button class="btn-todo" data-id="${taskId}">
          <i class="bi bi-arrow-counterclockwise"></i> To Do
        </button>
    `;
    }
    else {
        return ` 
         <button class="btn-start" data-id="${taskId}">
              <i class="bi bi-play-fill"></i> Start
            </button>
            <button class="btn-todo" data-id="${taskId}">
          <i class="bi bi-arrow-counterclockwise"></i> To Do
        </button>`;
    }
}
function attachEventListeners() {
    document.querySelectorAll(".btn-start").forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = event.currentTarget.getAttribute("data-id");
            updateTaskStatus(taskId, TaskStatus.InProgress);
        });
    });
    document.querySelectorAll(".btn-complete").forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = event.currentTarget.getAttribute("data-id");
            updateTaskStatus(taskId, TaskStatus.Done);
        });
    });
    document.querySelectorAll(".btn-todo").forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = event.currentTarget.getAttribute("data-id");
            updateTaskStatus(taskId, TaskStatus.Todo);
        });
    });
}
function renderTasks() {
    const tasks = Helper.getFromStorage("tasks") || [];
    if (tasks.length === 0) {
        return;
    }
    todoContainer.innerHTML = "";
    progressContainer.innerHTML = "";
    completedContainer.innerHTML = "";
    tasks.forEach((task, index) => {
        const displayId = ("000" + (index + 1)).slice(-3);
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.innerHTML = `
  <div class="task-header">
    <div class="task-id">#${displayId}</div>
    <div class="task-header-actions">
      <button class="icon-button edit-btn" data-task-id="${task.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button class="icon-button delete-btn" data-task-id="${task.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
  <div class="task-title">${task.title}</div>
  <div class="task-description">${task.description || ""}</div>
  <div class="task-priority" style="color: ${Helper.getPriorityColor(task.priority)}; background-color: ${Helper.getPriorityBackgroundColor(task.priority)};">● ${task.priority}</div>
  <div class="task-due-date">⏱ ${Helper.calcTaskDuration(new Date(task.dueDate))}</div>
  <div class="task-actions">
    ${renderTaskActions(task.status, task.id)}
  </div>
`;
        const editBtn = taskCard.querySelector(".edit-btn");
        const deleteBtn = taskCard.querySelector(".delete-btn");
        editBtn === null || editBtn === void 0 ? void 0 : editBtn.addEventListener("click", () => handleEditTask(task.id));
        deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener("click", () => handleDeleteTask(task.id));
        if (task.status === TaskStatus.Todo) {
            todoContainer.appendChild(taskCard);
        }
        else if (task.status === TaskStatus.InProgress) {
            progressContainer.appendChild(taskCard);
        }
        else if (task.status === TaskStatus.Done) {
            completedContainer.appendChild(taskCard);
        }
    });
    renderEmptyStates(tasks);
    updateTasksCount(tasks);
    attachEventListeners();
}
function renderEmptyStates(tasks) {
    const emptyElement = `     <div class="empty-state">
          <i class="bi bi-folder2-open"></i>
          <p>No tasks yet</p>
          <p>Click + to add one</p>
        </div>`;
    if (tasks.filter((task) => task.status === TaskStatus.Todo).length === 0) {
        todoContainer.innerHTML = emptyElement;
    }
    if (tasks.filter((task) => task.status === TaskStatus.InProgress).length === 0) {
        progressContainer.innerHTML = emptyElement;
    }
    if (tasks.filter((task) => task.status === TaskStatus.Done).length === 0) {
        completedContainer.innerHTML = emptyElement;
    }
}
function updateTasksCount(tasks) {
    const todoCount = tasks.filter((task) => task.status === TaskStatus.Todo).length;
    const inProgressCount = tasks.filter((task) => task.status === TaskStatus.InProgress).length;
    const doneCount = tasks.filter((task) => task.status === TaskStatus.Done).length;
    const todoCountElement = Helper.getElementById("todo-count");
    const inProgressCountElement = Helper.getElementById("progress-count");
    const doneCountElement = Helper.getElementById("completed-count");
    todoCountElement.textContent = todoCount.toString();
    inProgressCountElement.textContent = inProgressCount.toString();
    doneCountElement.textContent = doneCount.toString();
}
function handleDeleteTask(taskId) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
    }).then((result) => {
        if (result.isConfirmed) {
            const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
            Swal.fire({
                title: "Deleted!",
                text: "Your task has been deleted.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
            renderTasks();
        }
    });
}
function handleEditTask(taskId) {
    // Get tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const task = tasks.find((t) => t.id === taskId);
    if (!task)
        return;
    isEditMode = true;
    editingTaskId = taskId;
    const modalTitle = document.getElementById("addTaskModalLabel");
    const saveBtn = document.getElementById("addTaskBtn");
    // Update modal title and button text
    modalTitle.textContent = "Edit Task";
    saveBtn.textContent = "Update Task";
    // Fill form with task data
    titleInput.value = task.title;
    prioritySelect.value = task.priority.toString();
    dueDateInput.value = new Date(task.dueDate).toString();
    descriptionInput.value = task.description || "";
    // Open modal
    const modal = new bootstrap.Modal(document.getElementById("addTaskModal"));
    modal.show();
}
function updateTaskStatus(taskId, newStatus) {
    if (!taskId)
        return;
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1 && tasks[taskIndex]) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}
