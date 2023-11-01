/* eslint-disable notice/notice */

import { test, expect, type Locator } from '@playwright/test';
import { ToDos } from '../pages/todos';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  const todos = new ToDos(page);
  await todos.navigateToPage();
});

test.describe('Unmark items', () => {

  test('should be able to unmark a item', async ({ page }) => {
    const todos = new ToDos(page);

    // Add 1 item to the list
    const todoItem: string = faker.lorem.words({ min: 1, max: 3 })
    await todos.addItemToTodoList(todoItem)

    const items: Array<Locator> = await todos.listOfTodos.all()

    // Complete all todos
    await todos.toggleAll.click()

    // Assert all elements are toogled
    for (let i = 0; i < items.length; i++) {
      expect(items[i].locator('.toggle')).toBeChecked();
    };

    const item = await todos.findTodoByName(todoItem)

    // check the item
    if (item) {
      await item.locator('.toggle').uncheck();
      // Assert no more items are left
     await expect(item.locator('.toggle')).not.toBeChecked();
    }
  });

});
