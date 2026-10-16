
export function createTask(title, description = "", dueDate = "", priority = 4, notes = [], checkList = []) {
    const id = crypto.randomUUID();
    const completed = false;
    const normalizedNotes = Array.isArray(notes) ? notes : (notes ? [notes] : []);

    return { id, completed, title, description, dueDate, priority: Number(priority), notes: normalizedNotes, checkList };
}

export function createProject(projectName, projectDescription = "") {
    const id = crypto.randomUUID();
    const tasksOfThisProject = [];
    return { id, projectName, projectDescription, tasksOfThisProject };
}

export function createSubtask(title) {
    const id = crypto.randomUUID();
    const completed = false;
    return { id, completed, title };
}