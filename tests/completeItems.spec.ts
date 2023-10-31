/* eslint-disable notice/notice */

import { test, expect, type Locator } from '@playwright/test';
import { ToDos } from '../pages/todos';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  const todos = new ToDos(page);
  await todos.navigateToPage();
});


test.describe('Mark all as completed', () => {

  test('should allow me to mark all items as completed', async ({ page }) => {
    const todos = new ToDos(page);
    await todos.generateRandomTodoItems()
    const items: Array<Locator> = await todos.listOfTodos.all()

    // Complete all todos
    await todos.completeTodoItems()

    // Assert no more items are left
    await expect(todos.todoCount).toHaveText(['0']);
  });

  test('should allow me to clear the complete state of all items', async ({ page }) => {
    const todos = new ToDos(page);

    // Generate Todos
    await todos.generateRandomTodoItems()

    // Get count of generated todos
    const items: Array<Locator> = await todos.listOfTodos.all()

    // Complete all todos
    await todos.completeTodoItems()

    // Navigate to Completed tab
    await todos.completedTab.click()

    // Get Count of completed todos
    const completedItems: Array<Locator> = await todos.listOfTodos.all()

    await expect(items).toEqual(completedItems)

    // Click on clear all completed
    await todos.clearCompletedButton.click()

    // Assert no more completed items
    const remainingCompletedItems: Array<Locator> = await todos.listOfTodos.all()
    await expect(remainingCompletedItems.length).toEqual(0)
  });

  test('complete 1 item and validate it in completed tab', async ({ page }) => {
    const todos = new ToDos(page);

    // Add 1 item to the list
    const todoItem: string = faker.lorem.words({ min: 1, max: 3 })
    await todos.addItemToTodoList(todoItem)

    // Add more todos
     await todos.generateRandomTodoItems()

    const item = await todos.findTodoByName(todoItem)

    // check the item
    if (item)
      await item.locator('.toggle').check();

    // navigate to completed
    await todos.completedTab.click()

    // validate item is visible
    await expect(todos.listOfTodos.first()).toHaveText([
      todoItem
    ]);
  });
});
