import {
  activeFilterElement,
  allFilterElement,
  completedFilterElement,
  itemsLeftElement,
  taskList,
} from "./scripts.js/elements";
import {
  currentFilterState,
  initListeners,
  initTaskList,
  selectFilter,
} from "./scripts.js/eventListeners";

export const applyTheme = (isDark) => {
  document.documentElement.classList.toggle("dark", isDark);
};
import checkIcon from "./images/icon-check.svg";
import crossIcon from "./images/icon-cross.svg";

export const toggleDarkMode = () => {
  const isDark = !document.documentElement.classList.contains("dark");
  applyTheme(isDark);
  saveToDataBase("isDark", isDark);
};

export const renderTaskList = (tasks) => {
  let result = ``;
  tasks.forEach((task) => {
    result += `
       <li class="todo-list__item  ${task.isCompleted ? "todo-list__item--completed" : ""}" data-id="${task.taskId}">
            <button class="todo-list__check-btn" aria-label="mark as complete">
              <img
                class="todo-list__check-icon"
                src="${checkIcon}"
                alt=""
              />
            </button>
            <p class="todo-list__task"></p>
            <button class="todo-list__delete-btn" aria-label="delete task">
              <img
                class="todo-list__delete-icon"
                src="${crossIcon}"
                alt=""
              />
            </button>
          </li>
    `;
  });

  taskList.innerHTML = result;
  const paragrahps = taskList.querySelectorAll(".todo-list__task");
  paragrahps.forEach((p, i) => {
    p.textContent = tasks[i].text;
  });
};

export const saveToDataBase = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getData = (key) => {
  let result = localStorage.getItem(key);
  result = JSON.parse(result);
  return result;
};

export let tasks = [];

export const addTask = () => {
  const input = document.querySelector(".form__input");
  if (input.value.trim()) {
    tasks.push({
      isCompleted: false,
      text: input.value.trim(),
      taskId: crypto.randomUUID(),
    });
    input.value = "";
    saveToDataBase("tasks", tasks);

    if (currentFilterState === "active") {
      selectFilter("active");
    } else {
      selectFilter("all");
    }
  } else {
    input.value = "";
  }
};

export const markTaskAsCompleted = (listItem, listItemId) => {
  listItem.classList.toggle("todo-list__item--completed");

  tasks.forEach((task) => {
    if (task.taskId === listItemId) {
      task.isCompleted = !task.isCompleted;
    }
  });

  saveToDataBase("tasks", tasks);
  if (currentFilterState !== "all") {
    selectFilter(currentFilterState);
    return;
  }

  calculateItemsLeft();
};

export const deleteTask = (listItemId) => {
  const wantDelete = confirm("Do you want to delete task?");
  if (wantDelete) {
    tasks.forEach((task) => {
      if (task.taskId === listItemId) {
        const taskIndex = tasks.indexOf(task);
        tasks.splice(taskIndex, 1);
      }
    });

    saveToDataBase("tasks", tasks);
    selectFilter(currentFilterState);
  }
};

export const calculateItemsLeft = () => {
  if (tasks?.length || tasks.length === 0) {
    let countUnCompletedTasks = 0;
    tasks.forEach((task) => {
      !task.isCompleted && countUnCompletedTasks++;
    });
    itemsLeftElement.innerText = countUnCompletedTasks;
  } else {
    return;
  }
};

export const removeSelectedFilterClass = () => {
  if (allFilterElement.classList.contains("list-options__filter-btn--active")) {
    allFilterElement.classList.remove("list-options__filter-btn--active");
  } else if (
    activeFilterElement.classList.contains("list-options__filter-btn--active")
  ) {
    activeFilterElement.classList.remove("list-options__filter-btn--active");
  } else if (
    completedFilterElement.classList.contains(
      "list-options__filter-btn--active",
    )
  ) {
    completedFilterElement.classList.remove("list-options__filter-btn--active");
  }
};

export const clearCompletedTasks = () => {
  tasks = getUnCompletedTasks();
  saveToDataBase("tasks", tasks);
  selectFilter("all");
};

export const getUnCompletedTasks = () => {
  let unCompletedTasks = [];
  tasks.forEach((task) => {
    if (!task.isCompleted) {
      unCompletedTasks.push(task);
    }
  });
  return unCompletedTasks;
};

export const getCompletedTasks = () => {
  let completedTasks = [];
  tasks.forEach((task) => {
    if (task.isCompleted) {
      completedTasks.push(task);
    }
  });
  return completedTasks;
};

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(
    getData("isDark") ?? document.documentElement.classList.contains("dark"),
  );
  tasks = getData("tasks") ?? [];
  initTaskList(tasks);
});
initListeners();
