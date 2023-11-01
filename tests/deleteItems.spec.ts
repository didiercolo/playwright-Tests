/* eslint-disable notice/notice */

import { test, expect, type Locator } from '@playwright/test';
import { ToDos } from '../pages/todos';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  const todos = new ToDos(page);
  await todos.navigateToPage();
});

test.describe('Delete items', () => {

  test('should be able to delete a item text', async ({ page }) => {
    const todos = new ToDos(page);

    // Define Test data
    const todoItem: string = faker.lorem.words({ min: 1, max: 3 })

    // Add 1 item to the list
    await todos.addItemToTodoList(todoItem)

    // Get al Todos
    const items: Array<Locator> = await todos.listOfTodos.all()

    // validate Item can be edited
    for (let i = 0; i < items.length; i++) {
      const deleteButton: Locator = await items[i].locator(todos.deleteItem)

      // Hover the element
      await expect(items[i]).toBeVisible
      await items[i].hover()

      // Expect delete button is visible
      await expect(deleteButton).toBeVisible

      // Click on delete
      await deleteButton.click()
      
      // Validate todo is not longer visible
      await expect(items[i]).not.toBeVisible
      await expect(items[i]).toHaveCount(0)
    };
  });
});
