import { createSubtask } from "./factories.js";

export const tasksAndProjects = (function () {
    const taskList = [];
    const projectList = [];

  
    const saveData = () => {
        localStorage.setItem("todo-taskList", JSON.stringify(taskList));
        localStorage.setItem("todo-projectList", JSON.stringify(projectList));
    };


    const loadData = () => {
        const savedTasks = localStorage.getItem("todo-taskList");
        const savedProjects = localStorage.getItem("todo-projectList");

        if (savedTasks && savedProjects) {
      
            taskList.length = 0;
            projectList.length = 0;
            taskList.push(...JSON.parse(savedTasks));
            projectList.push(...JSON.parse(savedProjects));
            return true; 
        }
        return false; 
    };

    const getTaskList = () => taskList;
    const getProjectList = () => projectList;

    const addToTaskList = (task) => {
        taskList.push(task);
        saveData(); 
    };

    const removeFromTaskList = (taskId) => {
        const taskIndex = taskList.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            taskList.splice(taskIndex, 1);
        }
        for (const project of projectList) {
            const idx = project.tasksOfThisProject.indexOf(taskId);
            if (idx !== -1) {
                project.tasksOfThisProject.splice(idx, 1);
            }
        }
        saveData(); 
    };

    const addToProjectList = (project) => {
        projectList.push(project);
        saveData(); 
    };

    const removeFromProjectList = (projectId) => {
        const projectIndex = projectList.findIndex(project => project.id === projectId);
        if (projectIndex !== -1) {
            projectList[projectIndex].tasksOfThisProject = [];
            projectList.splice(projectIndex, 1);
        }
        saveData(); 
    };

    const editProject = (projectId, newName, newDescription) => {
        const project = projectList.find(p => p.id === projectId);
        if (project) {
            project.projectName = newName;
            project.projectDescription = newDescription;
            saveData();
        }
    };

    const assignTaskToProject = (taskId, projectId) => {
        for (const project of projectList) {
            const idx = project.tasksOfThisProject.indexOf(taskId);
            if (idx !== -1) {
                project.tasksOfThisProject.splice(idx, 1);
            }
        }
        if (projectId) {
            const targetProject = projectList.find(p => p.id === projectId);
            if (targetProject && !targetProject.tasksOfThisProject.includes(taskId)) {
                targetProject.tasksOfThisProject.push(taskId);
            }
        }
        saveData(); 
    };

    const editTask = (taskId, completed, title, description, dueDate, priority, notes) => {
        const taskIndex = taskList.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;

        taskList[taskIndex].completed = completed;
        taskList[taskIndex].title = title;
        taskList[taskIndex].description = description;
        taskList[taskIndex].dueDate = dueDate;
        taskList[taskIndex].priority = Number(priority);
        taskList[taskIndex].notes = Array.isArray(notes) ? notes : (notes ? [notes] : []);
        saveData(); 
    };

    const toggleTaskComplete = (taskId) => {
        const task = taskList.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveData(); 
        }
    };

    const editCheckList = (action, taskId, subtaskId = "", completed = false, title = "") => {
        const taskIndex = taskList.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;

        if (action === "add") {
            const newSubtask = createSubtask(title);
            taskList[taskIndex].checkList.push(newSubtask);
        } else if (action === "remove") {
            const subtaskIndex = taskList[taskIndex].checkList.findIndex(subtask => subtask.id === subtaskId);
            if (subtaskIndex !== -1) {
                taskList[taskIndex].checkList.splice(subtaskIndex, 1);
            }
        } else {
            const subtaskIndex = taskList[taskIndex].checkList.findIndex(subtask => subtask.id === subtaskId);
            if (subtaskIndex !== -1) {
                const subtaskToModify = taskList[taskIndex].checkList[subtaskIndex];
                subtaskToModify.completed = completed;
                subtaskToModify.title = title;
            }
        }
        saveData(); 
    };

    return {
        loadData, 
        getTaskList,
        getProjectList,
        addToTaskList,
        addToProjectList,
        removeFromTaskList,
        removeFromProjectList,
        editProject,
        assignTaskToProject,
        editTask,
        toggleTaskComplete,
        editCheckList
    };
})();

export function findTaskIsPartOf(id) {
    const currentProjectList = tasksAndProjects.getProjectList();
    for (const project of currentProjectList) {
        for (const taskId of project.tasksOfThisProject) {
            if (taskId === id) {
                return project.projectName;
            }
        }
    }
    return null;
}

export function findTaskProjectId(id) {
    const currentProjectList = tasksAndProjects.getProjectList();
    for (const project of currentProjectList) {
        if (project.tasksOfThisProject.includes(id)) {
            return project.id;
        }
    }
    return "";
}