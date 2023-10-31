import { expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class ToDos {
    readonly page: Page;
    readonly todoInput: Locator;
    readonly listOfTodos: Locator;
    readonly todoCount: Locator;
    readonly pageTitle: Locator;
    readonly clearCompletedButton: Locator;
    readonly completedTab: Locator;

    constructor(page: Page) {
        this.page = page;
        this.todoInput = page.getByPlaceholder('What needs to be done?');
        this.listOfTodos = page.locator('ul.todo-list li');
        this.todoCount = page.locator('.todo-count strong');
        this.pageTitle = page.locator('h1');
        this.clearCompletedButton = page.locator('button.clear-completed');
        this.completedTab = page.getByRole('link', { name: 'Completed' })
    }

    async navigateToPage() {
        await this.page.goto('./');
        await expect(this.todoInput).toBeEmpty();
        await expect(this.pageTitle).toHaveText('todos', { timeout: 10000 });
    }

    async addItemToTodoList(item: string) {
        await this.todoInput.fill(item);
        await this.todoInput.press('Enter');
        await expect(this.todoInput).toBeEmpty();
    }

    async generateRandomTodoItems() {
        // Number of items
        const numberOfItems: number = Math.floor(Math.random() * 5) + 2;
        let values: Array<string> = []

        for (let i = 0; i < numberOfItems; i++) {
            values.push(faker.lorem.words({ min: 1, max: 3 }))
        }

        // Values for the items
        for (let i = 0; i < numberOfItems; i++) {
            await this.addItemToTodoList(values[i])
        }
    }

    async getAllTodoItems() {
        return await this.listOfTodos.all()
    }

    async completeTodoItems() {
        const items: Array<Locator> = await this.listOfTodos.all()
        for (let i = 0; i < items.length; i++) {
            // Click if element with text found
            await items[i].locator('.toggle').check();
        }
    }

    async findTodoByName(itemText: string) {
        const items: Array<Locator> = await this.listOfTodos.all()
    
        for (let i = 0; i < items.length; i++) {
            if (await items[i].textContent() === itemText) {

                // Click if element with text found
                return await items[i]
            }
        }
    }
}