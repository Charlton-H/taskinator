var buttonE1 = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");

buttonE1.addEventListener("click", createTaskHandler);

function createTaskHandler() {
  var taskItemEl = document.createElement("li");
  taskItemEl.textContent = "This is a new task.";
  taskItemEl.className = "task-item";
  tasksToDoEl.appendChild(taskItemEl);
}
