# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW), built as my graduation project for the JavaScript track.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list

Todos and the chosen theme are saved in `localStorage`, so they are still there after a refresh.

### Screenshots

#### Desktop

![Desktop light theme](./design/desktop-light-screenshot.jpeg)
![Desktop dark theme](./design/desktop-dark-screenshot.jpeg)

#### Mobile

![Mobile dark theme](./design/mobile-dark-screenshot.jpeg)
![Mobile light theme](./design/mobile-light-screenshot.jpeg)

### Links

- Solution URL: [https://github.com/Ahmed-Abdul-ghaffar/ToDo-App](https://github.com/Ahmed-Abdul-ghaffar/ToDo-App)
- Live Site URL: [https://ahmed-abdul-ghaffar.github.io/ToDo-App/](https://ahmed-abdul-ghaffar.github.io/ToDo-App/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Sass (SCSS) with the BEM naming convention
- Vanilla JavaScript (ES modules)
- [SortableJS](https://sortablejs.github.io/Sortable/)
- Desktop-first workflow
- Functional and modular programming

### What I learned

I'm very interested in clean structure and accessibility. The icon inside a button has an empty `alt` attribute, but then screen reader users wouldn't know what the button does, so `aria-label` on the button solves that.

```html
<button
  class="header__theme-icon header__theme-icon-moon"
  aria-label="dark theme icon"
>
  <img src="images/icon-moon.svg" alt="" />
</button>
```

This project was a good chance to learn Sass. I learned to divide the styling into files, so it becomes easy to debug later.

```scss
@use "./components/reset";
@use "./components/variables";
@use "./components/header";
@use "./components/form";
@use "./components/todo-list";
@use "./components/list-options";
@use "./components/footer";
```

I learned how useful the BEM naming convention is together with Sass and the `&` parent selector.

```scss
.header {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  &__logo {
    font-family: var(--font-family-josefin);
    font-weight: var(--font-weight-bold);
    color: var(--color-logo);
  }
}
```

**Theming with CSS custom properties:** the raw palette lives in `_variables.scss`, and role-based variables like `--color-bg` and `--color-list-bg` point to it. The dark theme only re-assigns those variables under `html.dark`, so switching themes is a single class toggle on `<html>`, saved in `localStorage`.

**The gradient hover on the check box:** CSS can't put a gradient on a rounded `border`, so I faked it with two pseudo-elements. `::before` is a slightly larger gradient circle, and `::after` is a circle in the list's background color that hollows out its center. On hover both fade in and the real border becomes transparent, which looks like a gradient border. When a task is completed, only `::before` stays visible, so the whole circle is filled with the gradient and the check icon appears on top.

```scss
.todo-list__check-btn {
  position: relative;
  z-index: 0; // keeps the pseudo-elements behind the button, not the page

  &::before {
    content: "";
    position: absolute;
    inset: -0.1rem;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--color-cyan),
      var(--color-magenta)
    );
    opacity: 0;
    z-index: -1;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background-color: var(--color-list-bg);
    opacity: 0;
    z-index: -1;
  }

  @media (hover: hover) {
    &:hover {
      border-color: transparent;

      &::before,
      &::after {
        opacity: 1;
      }
    }
  }
}
```

The `@media (hover: hover)` wrapper stops touch screens from getting a "stuck" hover state after a tap.

**Filter buttons on mobile:** on desktop, the counter, the filters and the "Clear Completed" button sit in one row, because `__summary` uses `display: contents` and its children join the 3-column grid. On mobile the design puts the filters in their own card on a new line, so I did it without changing the HTML: the grid becomes a single column, and `__summary` turns into a flex container with its own background, which makes it the first card. The filters then become the second card below it.

```scss
@media (max-width: 400px) {
  .list-options {
    grid-template-columns: 1fr;
    row-gap: 1rem;
    background-color: transparent;

    &__summary {
      display: flex; // was `display: contents` on desktop
      justify-content: space-between;
      background-color: var(--color-list-bg);
    }

    &__filter-btns {
      background-color: var(--color-list-bg); // its own card on a new line
    }
  }
}
```

It was a good experience to practice my JS skills, and it was very helpful to build the project with functional programming.

```js
export const getUnCompletedTasks = () => {
  let unCompletedTasks = [];
  tasks.forEach((task) => {
    if (!task.isCompleted) {
      unCompletedTasks.push(task);
    }
  });
  return unCompletedTasks;
};
```

I learned about `localStorage` and how to use it.

```js
export const saveToDataBase = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
```

It was also a good chance to learn the `Sortable` library, which makes the task list draggable. Dragging is disabled while the Active or Completed filter is on, because indexes from a filtered list wouldn't match the saved array.

```js
import Sortable from "sortablejs";

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
```

### Continued development

Features and improvements:

- Replace the `confirm()` dialogs with an accessible custom modal
- Add `aria-pressed` to the filter buttons and an `aria-live` region for the items-left counter
- Use `prefers-color-scheme` as the default theme
- Edit a todo in place
- Add unit tests for the task logic

### Useful resources

- [Claude by Anthropic](https://claude.ai) - helped me along the journey of creating the project, and I will keep the chat in case I want to revise something.
- [ChatGPT by OpenAI](https://chatgpt.com)
- [SortableJS documentation](https://sortablejs.github.io/Sortable/)

### AI collaboration

- I used Claude and ChatGPT.
- The instructions in the `AGENTS.md` file made AI a good learning partner: I think and decide, and I know what each piece of code is for. Sometimes it gave suggestions, but my own is better.
- When I wanted to remember something on coding, I asked ChatGPT.
- AI helped me with planning, suggesting ideas, reminding me of topics, and explaining new ones.
- I didn't depend on it completely. It was an assistant, and I wrote most of the code myself.

## Author

- Frontend Mentor - [@Ahmed-Abdul-ghaffar](https://www.frontendmentor.io/profile/Ahmed-Abdul-ghaffar)
- GitHub - [ahmed-abdul-ghaffar](https://github.com/ahmed-abdul-ghaffar)
- LinkedIn - [Ahmed Abdul-ghaffar](https://www.linkedin.com/in/ahmed-abdul-ghaffar-79535b23a/)

## Acknowledgments

Challenge and design by [Frontend Mentor](https://www.frontendmentor.io).
