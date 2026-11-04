import Sortable from "sortablejs";
import {
  addTask,
  calculateItemsLeft,
  clearCompletedTasks,
  deleteTask,
  getCompletedTasks,
  getUnCompletedTasks,
  markTaskAsCompleted,
  removeSelectedFilterClass,
  renderTaskList,
  saveToDataBase,
  tasks,
  toggleDarkMode,
} from "..";
import {
  activeFilterElement,
  allFilterElement,
  clearCompletedBtn,
  completedFilterElement,
  form,
  header,
  listItems,
  taskList,
} from "./elements";

export const makeTaskListSortable = () => {
  return new Sortable(taskList, {
    animation: 150,
    delay: 400,
    delayOnTouchOnly: true,
    ghostClass: "todo-list__item--ghost",
    onEnd(event) {
      if (event.oldIndex === event.newIndex) return;
      const draggedTask = tasks[event.oldIndex];
      tasks.splice(event.oldIndex, 1);
      tasks.splice(event.newIndex, 0, draggedTask);
      saveToDataBase("tasks", tasks);
    },
  });
};

let sortable = makeTaskListSortable();
export let currentFilterState = "all";

export const selectFilter = (name) => {
  removeSelectedFilterClass();

  if (name === "all") {
    allFilterElement.classList.add("list-options__filter-btn--active");
    sortable.option("disabled", false);
    currentFilterState = "all";
    initTaskList(tasks);
  } else if (name === "active") {
    activeFilterElement.classList.add("list-options__filter-btn--active");
    sortable.option("disabled", true);
    currentFilterState = "active";
    const unCompletedTasks = getUnCompletedTasks();
    initTaskList(unCompletedTasks);
  } else if (name === "completed") {
    completedFilterElement.classList.add("list-options__filter-btn--active");
    sortable.option("disabled", true);
    currentFilterState = "completed";
    const completedTasks = getCompletedTasks();
    initTaskList(completedTasks);
  }
};

export const initListeners = () => {
  header.addEventListener("click", (event) => {
    if (event.target.closest(".header__theme-icon")) {
      toggleDarkMode();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask();
  });

  allFilterElement.addEventListener("click", () => selectFilter("all"));

  activeFilterElement.addEventListener("click", () => selectFilter("active"));

  completedFilterElement.addEventListener("click", () =>
    selectFilter("completed"),
  );

  clearCompletedBtn.addEventListener("click", () => {
    const wantDelete = confirm(
      "Are you sure you want to clear the completed tasks?",
    );
    if (wantDelete) {
      clearCompletedTasks();
    }
  });
};

export const initTaskListeners = () => {
  listItems().forEach((listItem) => {
    listItem.addEventListener("click", (event) => {
      const listItemId = listItem.dataset.id;

      if (event.target.closest(".todo-list__check-btn")) {
        markTaskAsCompleted(listItem, listItemId);
      }

      if (event.target.closest(".todo-list__delete-btn")) {
        deleteTask(listItemId);
      }
    });
  });
};

export const initTaskList = (tasks) => {
  renderTaskList(tasks);
  initTaskListeners();
  calculateItemsLeft();
};
