import "./styles.css";

import { createTask, createProject, createSubtask } from "./factories.js";
import { tasksAndProjects } from "./appLogic.js";
import { renderSidebarAndDropdownProjects, displayAllTasks } from "./dom.js";
import { initEventListeners } from "./events.js";

(function initApp() {
    initEventListeners();

   
    const hasSavedData = tasksAndProjects.loadData();

   
    if (!hasSavedData) {
        const p1 = createProject("Project 1", "Frontend curriculum projects");
        const p2 = createProject("Project 2", "System & environment setup");
        const p3 = createProject("Project 3", "Personal errands and goals");

        tasksAndProjects.addToProjectList(p1);
        tasksAndProjects.addToProjectList(p2);
        tasksAndProjects.addToProjectList(p3);

        const sampleTask = createTask(
            "This a a sample task's title",
            "Here goes the description",
            "",
            1,
            ["Comment 1", "Comment 2"],
            [createSubtask("subtask 1"), createSubtask("subtask 2")]
        );
        tasksAndProjects.addToTaskList(sampleTask);
        tasksAndProjects.assignTaskToProject(sampleTask.id, p1.id);
    }

    renderSidebarAndDropdownProjects();
    displayAllTasks();
})();