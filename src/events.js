import { createTask, createProject, createSubtask } from "./factories.js";
import { tasksAndProjects } from "./appLogic.js";
import {
    modalDraftSubtasks,
    modalDraftComments,
    setModalDraftSubtasks,
    displayAllTasks,
    displayCompletedTasks,
    displayTasksInsideThisProject,
    displayAllProjects,
    displayAllSubtasks,
    displayAllComments,
    refreshCurrentView,
    openTaskModal,
    openProjectModal
} from "./dom.js";

export function initEventListeners() {
    const taskDialog = document.getElementById("new-task-dialog");
    const taskForm = document.getElementById("new-task-form");
    const projectDialog = document.getElementById("new-project-dialog");
    const projectForm = document.getElementById("new-project-form");

    
    document.getElementById("add-subtask-btn").addEventListener("click", () => {
        const subtaskInput = document.getElementById("subtask-input");
        const title = subtaskInput.value.trim();
        if (!title) return;

        const editingTaskId = taskForm.getAttribute("data-editing-id");
        if (editingTaskId) {
            tasksAndProjects.editCheckList("add", editingTaskId, "", false, title);
            const updatedTask = tasksAndProjects.getTaskList().find(t => t.id === editingTaskId);
            setModalDraftSubtasks(updatedTask.checkList.map(s => ({ ...s })));
        } else {
            modalDraftSubtasks.push(createSubtask(title));
        }

        subtaskInput.value = "";
        displayAllSubtasks(editingTaskId || "");
    });

   
    document.getElementById("add-comment-btn").addEventListener("click", () => {
        const noteInput = document.getElementById("note");
        const text = noteInput.value.trim();
        if (!text) return;

        modalDraftComments.push(text);
        noteInput.value = "";
        displayAllComments();
    });

   
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const editingTaskId = taskForm.getAttribute("data-editing-id");
        const title = document.getElementById("task-title").value.trim();
        const description = document.getElementById("task-description").value.trim();
        const dueDate = document.getElementById("dueDate").value;
        const priority = Number(document.getElementById("priority").value);
        const selectedProjectId = document.getElementById("project").value;

        const pendingNote = document.getElementById("note").value.trim();
        if (pendingNote) {
            modalDraftComments.push(pendingNote);
        }

        if (editingTaskId) {
            const existingTask = tasksAndProjects.getTaskList().find(t => t.id === editingTaskId);
            tasksAndProjects.editTask(
                editingTaskId,
                existingTask.completed,
                title,
                description,
                dueDate,
                priority,
                modalDraftComments
            );
            tasksAndProjects.assignTaskToProject(editingTaskId, selectedProjectId);
        } else {
            const newTask = createTask(title, description, dueDate, priority, modalDraftComments, modalDraftSubtasks);
            tasksAndProjects.addToTaskList(newTask);
            tasksAndProjects.assignTaskToProject(newTask.id, selectedProjectId);
        }

        taskDialog.close();
        refreshCurrentView();
    });

    
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const editingProjectId = projectForm.getAttribute("data-editing-id");
        const title = document.getElementById("project-title").value.trim();
        const description = document.getElementById("project-description").value.trim();

        if (editingProjectId) {
            tasksAndProjects.editProject(editingProjectId, title, description);
        } else {
            const newProject = createProject(title, description);
            tasksAndProjects.addToProjectList(newProject);
        }

        projectDialog.close();
        refreshCurrentView();
    });

   
    document.getElementById("close-task-dialog-btn").addEventListener("click", () => taskDialog.close());
    document.getElementById("close-project-dialog-btn").addEventListener("click", () => projectDialog.close());
    document.getElementById("open-new-project-btn").addEventListener("click", () => openProjectModal());

   
    document.getElementById("nav-all-tasks").addEventListener("click", displayAllTasks);
    document.getElementById("nav-completed-tasks").addEventListener("click", displayCompletedTasks);
    document.getElementById("nav-my-projects").addEventListener("click", displayAllProjects);

    
    document.getElementById("sidebar-project-list").addEventListener("click", (e) => {
        const li = e.target.closest("li[data-project-id]");
        if (li) {
            displayTasksInsideThisProject(li.getAttribute("data-project-id"));
        }
    });

    
    document.querySelector(".main-content-body").addEventListener("click", (e) => {
        const taskCard = e.target.closest(".task");
        if (taskCard) {
            const taskId = taskCard.getAttribute("data-id");

            if (e.target.closest(".view-details")) {
                openTaskModal(taskId);
            } else if (e.target.closest(".delete-task")) {
                tasksAndProjects.removeFromTaskList(taskId);
                refreshCurrentView();
            } else if (e.target.closest(".mark-complete")) {
                tasksAndProjects.toggleTaskComplete(taskId);
                refreshCurrentView();
            }
            return;
        }

        const projectCard = e.target.closest(".projectDiv");
        if (projectCard) {
            const projectId = projectCard.getAttribute("data-id");

            if (e.target.closest(".viewTasks") || e.target.closest(".project-title-link")) {
                displayTasksInsideThisProject(projectId);
            } else if (e.target.closest(".edit-project")) {
                openProjectModal(projectId);
            } else if (e.target.closest(".delete-project")) {
                tasksAndProjects.removeFromProjectList(projectId);
                refreshCurrentView();
            }
        }
    });
}