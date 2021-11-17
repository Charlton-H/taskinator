var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

formEl.addEventListener("submit", taskFormHandler);

function taskFormHandler(event) {
  // Prevent submit from refreshing web page
  event.preventDefault();
  // set input task name to var
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  // set input task type to var
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  // give it a classs name
  taskInfoEl.className = "task-info";
  // add HTML content to div
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskNameInput +
    "</h3><span class='task-type'>" +
    taskTypeInput +
    "</span>";

  // add list type to list item
  listItemEl.appendChild(taskInfoEl);

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);
}
