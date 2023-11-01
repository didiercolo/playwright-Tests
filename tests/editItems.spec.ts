/* eslint-disable notice/notice */

import { test, expect, type Locator } from '@playwright/test';
import { ToDos } from '../pages/todos';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  const todos = new ToDos(page);
  await todos.navigateToPage();
});

test.describe('Edit items', () => {

  test('should be able to edit a item text', async ({ page }) => {
    const todos = new ToDos(page);

    // Define Test data
    const todoItem: string = faker.lorem.words({ min: 1, max: 3 })
    const newText: string = faker.lorem.words({ min: 1, max: 3 })

    // Add 1 item to the list
    await todos.addItemToTodoList(todoItem)

    // Get al Todos
    const items: Array<Locator> = await todos.listOfTodos.all()

    // validate Item can be edited
    for (let i = 0; i < items.length; i++) {
      await items[i].dblclick()

      const editInput: Locator = await items[i].locator(todos.inputEdit)
      await expect(editInput).toBeVisible
      await editInput.clear()
      await editInput.fill(newText)
      await editInput.press('Enter');

      // Validate todo was updated
      await expect(items[i]).toHaveText(newText);
    };
  });

});
