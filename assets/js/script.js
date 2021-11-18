var taskIdCounter = 0;
var tasks = [];
var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

function taskFormHandler(event) {
  // Prevent submit from refreshing web page
  event.preventDefault();
  // set input task name to var
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  // set input task type to var
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");
  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
    // no data attribute, so create object as normal and pass to createTaskEl function
    // package up data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do",
    };

    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
  }

  // // package up data as an object
  // var taskDataObj = {
  //   name: taskNameInput,
  //   type: taskTypeInput,
  // };

  // // send it as an argument to createTaskEl
  // createTaskEl(taskDataObj);
}

function createTaskEl(taskDataObj) {
  // console.log(taskDataObj);
  // console.log(taskDataObj.status);

  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div element to hold task name and type
  var taskInfoEl = document.createElement("div");
  // give it a classs name
  taskInfoEl.className = "task-info";
  // add HTML content to div
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";
  // add list type to list item
  listItemEl.appendChild(taskInfoEl);

  // this adds, element, createTaskActions to list item, after actual task name and type
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  // add list item to element tasksToDo
  // tasksToDoEl.appendChild(listItemEl);

  // the above is strikedout with this switch statement that orders the task status
  // in proper bucket
  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }

  //  add the value of taskId to the array
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);

  saveTasks();

  // increase task counter for next unique id
  taskIdCounter++;
}

function createTaskActions(taskId) {
  // create container to hold elements
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);

  // create dropdown selection options
  var statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className = "select-status";
  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
}

function completeEditTask(taskName, taskType, taskId) {
  // console.log(taskName, taskType, taskId);
  // find the matching task list item
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // set new values to html
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  alert("Task Updated!");
  // loop through tasks array and task object with new content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  // reset the form
  formEl.removeAttribute("data-task-id");
  // update formEl button to go back to saying "Add Task" instead of "Edit Task"
  document.querySelector("#save-task").textContent = "Add Task";
  saveTasks();
}

function taskButtonHandler(event) {
  // console.log(event.target);
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = event.target.getAttribute("data-task-id");
    editTask(taskId);
  } else if (event.target.matches(".delete-btn")) {
    // delete button was clicked
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
}

function taskStatusChangeHandler(event) {
  // console.log(event.target);
  // console.log(event.target.value);
  // console.log(event.target.getAttribute("data-task-id"));

  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");
  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update task's in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
    // console.log(tasks);
  }

  saveTasks();
}

function editTask(taskId) {
  // console.log("editing task #" + taskId);
  // get task list item element
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";

  formEl.setAttribute("data-task-id", taskId);
}

function deleteTask(taskId) {
  // console.log(taskId);
  // find task list element with taskId value and remove it
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  // console.log(taskSelected);
  taskSelected.remove();

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  //reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;
  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  // Retrieve Tasks from localStorage
  var savedTasks = localStorage.getItem("tasks");
  // console.log(tasks);

  if (!savedTasks) {
    return false;
  }
  console.log("Saved tasks found!");
  // else, load up saved tasks

  // Get the Tasks into an Object Array
  savedTasks = JSON.parse(savedTasks);
  //  // console.log(tasks)

  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the 'createTaskEl()' function
    createTaskEl(savedTasks[i]);
  }

  // Print Task Items to the Page
  // for (var i = 0; i < tasks.length; i++) {
  //   // console.log(tasks[i]);
  //   taskIdCounter = tasks[i].id;
  //   var listItemEl = document.createElement("li");
  //   listItemEl.className = "task-item";
  //   listItemEl.setAttribute("data-task-id", taskIdCounter);

  //   var taskInfoEl = document.createElement("div");
  //   taskInfoEl.className = "task-info";
  //   taskInfoEl.innerHTML =
  //     "<h3 class='task-name'>" +
  //     tasks[i].name +
  //     "</h3><span class='task-type'>" +
  //     tasks[i].type +
  //     "</span>";

  //   listItemEl.appendChild(taskInfoEl);

  //   taskActionsEl = createTaskActions(tasks[i].id);
  //   listItemEl.appendChild(taskActionsEl);
  //   // console.log(listItemEl);

  //   if (tasks[i].status === "to do") {
  //     listItemEl.querySelector(
  //       "select[name='status-change']"
  //     ).selectedIndex = 0;
  //     listItemEl.appendChild(tasksToDoEl);
  //   } else if (tasks[i].status === "in progress") {
  //     listItemEl.querySelector(
  //       "select[name='status-change']"
  //     ).selectedIndex = 1;
  //     listItemEl.appendChild(tasksInProgressEl);
  //   } else if (tasks[i].status === "completed") {
  //     listItemEl.querySelector(
  //       "select[name='status-change']"
  //     ).selectedIndex = 2;
  //     listItemEl.appendChild(tasksCompletedEl);
  //   }
  //   taskIdCounter++;
  //   console.log(listItemEl);
  // }
}

loadTasks();
