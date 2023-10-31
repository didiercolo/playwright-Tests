/* eslint-disable notice/notice */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ToDos } from '../pages/todos';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  const todos = new ToDos(page);
  await todos.navigateToPage();
});

const items = [
  faker.lorem.words({ min: 1, max: 3 }),
  faker.lorem.words({ min: 1, max: 3 }),
  faker.lorem.words({ min: 1, max: 3 })
];

test.describe('New Todo', () => {
  test('should be able to add todo items', async ({ page }) => {
    const todos = new ToDos(page);

    // Add 1st item to the ToDo list.
    todos.addItemToTodoList(items[0])

    // Make sure the list only has one todo item.
    await expect(todos.listOfTodos.first()).toHaveText([
      items[0]
    ]);

    // Create 2nd item to the ToDo list.
    todos.addItemToTodoList(items[1])
    
    // Make sure the list only has one todo item.
    await expect(todos.listOfTodos.last()).toHaveText([
      items[1]
    ]);

    // Create 3rd item to the ToDo list.
    todos.addItemToTodoList(items[2])

    // Make sure the list now has all todo items.
    await expect(todos.listOfTodos).toHaveText([
      items[0],
      items[1],
      items[2],
    ]);
  });

  test('should the input be cleared after entering any todo', async ({ page }) => {
    const todos = new ToDos(page);

    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Add 1st item to the ToDo list.
    todos.addItemToTodoList(items[0])

    // Check that input is empty.
    await expect(todos.todoInput).toBeEmpty();
  });

  test('todo Count must be increased every time an item is added', async ({ page }) => {
    const todos = new ToDos(page);

    await expect(todos.todoCount).toBeHidden()

    todos.addItemToTodoList(items[0])
    await expect(todos.todoCount).toHaveText(['1']);

    todos.addItemToTodoList(items[1])
    await expect(todos.todoCount).toHaveText(['2']);
  });
});
