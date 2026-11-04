export const header = document.querySelector(".header");
export const taskList = document.querySelector(".todo-list");
export const form = document.querySelector(".form");
export const checkBtns = () =>
  document.querySelectorAll(".todo-list__check-btn");
export const listItems = () => document.querySelectorAll(".todo-list__item");

export const itemsLeftElement = document.querySelector(
  ".list-options__items-left",
);

export const allFilterElement = document.querySelector(".all-filter");
export const activeFilterElement = document.querySelector(".active-filter");
export const completedFilterElement =
  document.querySelector(".completed-filter");
export const clearCompletedBtn = document.querySelector(
  ".list-options__clear-completed-btn",
);
