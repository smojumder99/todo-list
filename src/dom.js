import {format} from "date-fns";
import { tasksAndProjects, findTaskIsPartOf, findTaskProjectId } from "./appLogic.js";

let currentView = { type: "all", projectId: null };

export let modalDraftSubtasks = [];
export let modalDraftComments = [];

export function setModalDraftSubtasks(subtasks) {
    modalDraftSubtasks = subtasks;
}

export function createSVGIcon(svgClass, pathData) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", svgClass);
    svg.setAttribute("viewBox", "0 0 24 24");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);

    svg.appendChild(path);
    return svg;
}




export function createTaskCard(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    if (task.completed) {
        taskDiv.classList.add("completed-task");
    }
    taskDiv.setAttribute("data-id", task.id);

    switch (Number(task.priority)) {
        case 1:
            taskDiv.style.backgroundColor = "crimson";
            taskDiv.style.color = "white";
            break;
        case 2:
            taskDiv.style.backgroundColor = "rebeccapurple";
            taskDiv.style.color = "white";
            break;
        case 3:
            taskDiv.style.backgroundColor = "lightgreen";
            break;
        default:
            taskDiv.style.backgroundColor = "wheat";
            break;
    }

    const taskDetails = document.createElement("div");
    taskDetails.classList.add("taskDetails");

    const taskTitle = document.createElement("h4");
    taskTitle.textContent = task.title;

    const taskDueDate = document.createElement("h5");
    
  
    if (task.dueDate) {
      
        const formattedDate = format(new Date(task.dueDate + 'T00:00:00'), "MMM do, yyyy");
        taskDueDate.textContent = `Due: ${formattedDate}`;
    } else {
        taskDueDate.textContent = "No due date";
    }

    taskDetails.appendChild(taskTitle);
    taskDetails.appendChild(taskDueDate);

    const projectName = findTaskIsPartOf(task.id);
    if (projectName) {
        const taskIsPartOf = document.createElement("p");
        taskIsPartOf.textContent = `Part of: ${projectName}`;
        taskDetails.appendChild(taskIsPartOf);
    }

    const taskButtons = document.createElement("div");
    taskButtons.className = "taskButtons";

    const viewDetailsBtn = document.createElement("button");
    viewDetailsBtn.className = "view-details";
    const editSvg = createSVGIcon(
        "task-icons editButton",
        "M19,3A2,2 0 0,1 21,5V19C21,20.11 20.1,21 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M16.7,9.35C16.92,9.14 16.92,8.79 16.7,8.58L15.42,7.3C15.21,7.08 14.86,7.08 14.65,7.3L13.65,8.3L15.7,10.35L16.7,9.35M7,14.94V17H9.06L15.12,10.94L13.06,8.88L7,14.94Z"
    );
    viewDetailsBtn.appendChild(editSvg);
    viewDetailsBtn.appendChild(document.createTextNode(" View/Edit details"));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-task";
    const deleteSvg = createSVGIcon(
        "task-icons deleteButton",
        "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"
    );
    deleteBtn.appendChild(deleteSvg);
    deleteBtn.appendChild(document.createTextNode(" Delete"));

    const completeBtn = document.createElement("button");
    completeBtn.className = "mark-complete";
    const completeSvg = createSVGIcon(
        "task-icons completeButton",
        "M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z"
    );
    completeBtn.appendChild(completeSvg);
    completeBtn.appendChild(document.createTextNode(task.completed ? " Completed" : " Mark complete"));

    taskButtons.appendChild(viewDetailsBtn);
    taskButtons.appendChild(deleteBtn);
    taskButtons.appendChild(completeBtn);

    taskDiv.appendChild(taskDetails);
    taskDiv.appendChild(taskButtons);

    return taskDiv;
}














export function displayAllTasks() {
    currentView = { type: "all", projectId: null };

    const headerElement = document.createElement("h2");
    headerElement.className = "main-content-top-header";
    headerElement.textContent = "All tasks";

    const addTaskBtn = document.createElement("button");
    addTaskBtn.className = "addTaskButton";
    addTaskBtn.textContent = "+ Add new task";
    addTaskBtn.addEventListener("click", () => openTaskModal());

    const mainContentTopDiv = document.querySelector(".main-content-top");
    mainContentTopDiv.textContent = "";
    mainContentTopDiv.appendChild(headerElement);
    mainContentTopDiv.appendChild(addTaskBtn);

    const mainBodyDiv = document.querySelector(".main-content-body");
    mainBodyDiv.textContent = "";

    const currentTaskList = tasksAndProjects.getTaskList();
    for (const task of currentTaskList) {
        mainBodyDiv.appendChild(createTaskCard(task));
    }
}

export function displayCompletedTasks() {
    currentView = { type: "completed", projectId: null };

    const headerElement = document.createElement("h2");
    headerElement.className = "main-content-top-header";
    headerElement.textContent = "Completed tasks";

    const mainContentTopDiv = document.querySelector(".main-content-top");
    mainContentTopDiv.textContent = "";
    mainContentTopDiv.appendChild(headerElement);

    const mainBodyDiv = document.querySelector(".main-content-body");
    mainBodyDiv.textContent = "";

    const currentTaskList = tasksAndProjects.getTaskList();
    for (const task of currentTaskList) {
        if (task.completed === true) {
            mainBodyDiv.appendChild(createTaskCard(task));
        }
    }
}

export function displayTasksInsideThisProject(projectId) {
    currentView = { type: "project", projectId };

    const currentTaskList = tasksAndProjects.getTaskList();
    const currentProjectList = tasksAndProjects.getProjectList();
    const project = currentProjectList.find(p => p.id === projectId);

    if (!project) {
        displayAllProjects();
        return;
    }

    const headerElement = document.createElement("h2");
    headerElement.className = "main-content-top-header";
    headerElement.textContent = project.projectName;

    const addTaskBtn = document.createElement("button");
    addTaskBtn.className = "addTaskButton";
    addTaskBtn.textContent = "+ Add task to project";
    addTaskBtn.addEventListener("click", () => openTaskModal(null, project.id));

    const mainContentTopDiv = document.querySelector(".main-content-top");
    mainContentTopDiv.textContent = "";
    mainContentTopDiv.appendChild(headerElement);
    mainContentTopDiv.appendChild(addTaskBtn);

    const mainBodyDiv = document.querySelector(".main-content-body");
    mainBodyDiv.textContent = "";

    for (const taskId of project.tasksOfThisProject) {
        const task = currentTaskList.find(t => t.id === taskId);
        if (task) {
            mainBodyDiv.appendChild(createTaskCard(task));
        }
    }
}

export function displayAllProjects() {
    currentView = { type: "projects", projectId: null };

    const headerElement = document.createElement("h2");
    headerElement.className = "main-content-top-header";
    headerElement.textContent = "My projects";

    const mainContentTopDiv = document.querySelector(".main-content-top");
    mainContentTopDiv.textContent = "";
    mainContentTopDiv.appendChild(headerElement);

    const mainBodyDiv = document.querySelector(".main-content-body");
    mainBodyDiv.textContent = "";

    const currentProjectList = tasksAndProjects.getProjectList();

    for (const project of currentProjectList) {
        const projectDiv = document.createElement("div");
        projectDiv.className = "projectDiv";
        projectDiv.setAttribute("data-id", project.id);

        const headerContainer = document.createElement("div");
        const h3Element = document.createElement("h3");
        h3Element.className = "project-title-link";
        h3Element.textContent = project.projectName;

        const descElement = document.createElement("p");
        descElement.textContent = project.projectDescription || "No description";

        headerContainer.appendChild(h3Element);
        headerContainer.appendChild(descElement);

        const projectButtons = document.createElement("div");
        projectButtons.className = "projectButtons";

        const viewTasksBtn = document.createElement("button");
        viewTasksBtn.className = "viewTasks";
        viewTasksBtn.textContent = "View Tasks";

        const editProjectBtn = document.createElement("button");
        editProjectBtn.className = "view-details edit-project";
        const editSvg = createSVGIcon(
            "task-icons editButton",
            "M19,3A2,2 0 0,1 21,5V19C21,20.11 20.1,21 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M16.7,9.35C16.92,9.14 16.92,8.79 16.7,8.58L15.42,7.3C15.21,7.08 14.86,7.08 14.65,7.3L13.65,8.3L15.7,10.35L16.7,9.35M7,14.94V17H9.06L15.12,10.94L13.06,8.88L7,14.94Z"
        );
        editProjectBtn.appendChild(editSvg);
        editProjectBtn.appendChild(document.createTextNode(" View/Edit details"));

        const deleteProjectBtn = document.createElement("button");
        deleteProjectBtn.className = "delete-task delete-project";
        const deleteSvg = createSVGIcon(
            "task-icons deleteButton",
            "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"
        );
        deleteProjectBtn.appendChild(deleteSvg);
        deleteProjectBtn.appendChild(document.createTextNode(" Delete"));

        projectButtons.appendChild(viewTasksBtn);
        projectButtons.appendChild(editProjectBtn);
        projectButtons.appendChild(deleteProjectBtn);

        projectDiv.appendChild(headerContainer);
        projectDiv.appendChild(projectButtons);

        mainBodyDiv.appendChild(projectDiv);
    }
}

export function displayAllSubtasks(editingTaskId = "") {
    const subtasksListEl = document.getElementById("subtasks-list");
    subtasksListEl.textContent = "";

    for (const subtask of modalDraftSubtasks) {
        const li = document.createElement("li");

        const leftDiv = document.createElement("div");
        leftDiv.className = "subtask-item-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = subtask.completed;
        checkbox.addEventListener("change", () => {
            subtask.completed = checkbox.checked;
            if (editingTaskId) {
                tasksAndProjects.editCheckList("modify", editingTaskId, subtask.id, subtask.completed, subtask.title);
            }
            displayAllSubtasks(editingTaskId);
        });

        const titleSpan = document.createElement("span");
        titleSpan.textContent = subtask.title;
        if (subtask.completed) {
            titleSpan.classList.add("subtask-done");
        }

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(titleSpan);

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "small-delete-btn";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => {
            modalDraftSubtasks = modalDraftSubtasks.filter(s => s.id !== subtask.id);
            if (editingTaskId) {
                tasksAndProjects.editCheckList("remove", editingTaskId, subtask.id);
            }
            displayAllSubtasks(editingTaskId);
        });

        li.appendChild(leftDiv);
        li.appendChild(delBtn);
        subtasksListEl.appendChild(li);
    }
}

export function displayAllComments() {
    const commentsListEl = document.getElementById("comments-list");
    commentsListEl.textContent = "";

    modalDraftComments.forEach((commentText, index) => {
        const li = document.createElement("li");

        const textSpan = document.createElement("span");
        textSpan.textContent = commentText;

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "small-delete-btn";
        delBtn.textContent = "Remove";
        delBtn.addEventListener("click", () => {
            modalDraftComments.splice(index, 1);
            displayAllComments();
        });

        li.appendChild(textSpan);
        li.appendChild(delBtn);
        commentsListEl.appendChild(li);
    });
}

export function renderSidebarAndDropdownProjects() {
    const sidebarList = document.getElementById("sidebar-project-list");
    const projectSelect = document.getElementById("project");

    sidebarList.textContent = "";
    projectSelect.innerHTML = '<option value="">None</option>';

    const currentProjectList = tasksAndProjects.getProjectList();
    for (const project of currentProjectList) {
        const li = document.createElement("li");
        li.setAttribute("data-project-id", project.id);
        const icon = createSVGIcon(
            "sidebar-icon",
            "M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M7 7H9V9H7V7M7 11H9V13H7V11M7 15H9V17H7V15M17 17H11V15H17V17M17 13H11V11H17V13M17 9H11V7H17V9Z"
        );
        li.appendChild(icon);
        li.appendChild(document.createTextNode(project.projectName));
        sidebarList.appendChild(li);

        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.projectName;
        projectSelect.appendChild(option);
    }
}

export function refreshCurrentView() {
    renderSidebarAndDropdownProjects();
    if (currentView.type === "all") {
        displayAllTasks();
    } else if (currentView.type === "completed") {
        displayCompletedTasks();
    } else if (currentView.type === "projects") {
        displayAllProjects();
    } else if (currentView.type === "project") {
        displayTasksInsideThisProject(currentView.projectId);
    }
}

export function openTaskModal(taskId = null, preselectedProjectId = "") {
    const taskDialog = document.getElementById("new-task-dialog");
    const taskForm = document.getElementById("new-task-form");

    renderSidebarAndDropdownProjects();
    taskForm.reset();

    if (taskId) {
        const task = tasksAndProjects.getTaskList().find(t => t.id === taskId);
        if (!task) return;

        taskForm.setAttribute("data-editing-id", task.id);
        document.getElementById("task-dialog-title").textContent = "View / Edit Task Details";
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-description").value = task.description;
        document.getElementById("dueDate").value = task.dueDate;
        document.getElementById("priority").value = String(task.priority);
        document.getElementById("project").value = findTaskProjectId(task.id);

        modalDraftSubtasks = task.checkList.map(s => ({ ...s }));
        modalDraftComments = [...task.notes];
    } else {
        taskForm.removeAttribute("data-editing-id");
        document.getElementById("task-dialog-title").textContent = "Add New Task";
        document.getElementById("project").value = preselectedProjectId;
        modalDraftSubtasks = [];
        modalDraftComments = [];
    }

    displayAllSubtasks(taskId || "");
    displayAllComments();
    taskDialog.showModal();
}

export function openProjectModal(projectId = null) {
    const projectDialog = document.getElementById("new-project-dialog");
    const projectForm = document.getElementById("new-project-form");

    projectForm.reset();

    if (projectId) {
        const project = tasksAndProjects.getProjectList().find(p => p.id === projectId);
        if (!project) return;

        projectForm.setAttribute("data-editing-id", project.id);
        document.getElementById("project-dialog-title").textContent = "View / Edit Project Details";
        document.getElementById("project-title").value = project.projectName;
        document.getElementById("project-description").value = project.projectDescription;
    } else {
        projectForm.removeAttribute("data-editing-id");
        document.getElementById("project-dialog-title").textContent = "Add New Project";
    }

    projectDialog.showModal();
}