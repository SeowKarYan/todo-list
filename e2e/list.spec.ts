import { test, expect } from '@playwright/test';
import { randomUUID } from "node:crypto";

test('login, add, edit, delete list, logout', async ({ page }) => {
    // Redirect Login Page
    await page.goto('/');

    // Login form
    await expect(page.getByRole('textbox', { name: '* Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // Login
    await page.getByRole('textbox', { name: '* Username' }).click();
    await page.getByRole('textbox', { name: '* Username' }).fill('test-account');
    await page.getByRole('textbox', { name: '* Password' }).click();
    await page.getByRole('textbox', { name: '* Password' }).fill('123456');
    await page.getByRole('button', { name: 'Login' }).click();

    // Redirect to list page
    await expect(page).toHaveURL("/list")

    const title = `Title ${randomUUID()}`;
    const description = `Description ${randomUUID()}`;

    // Add List
    await expect(page.getByRole('button', { name: 'Add list' })).toBeVisible();
    await page.getByRole('button', { name: 'Add list' }).click();
    await expect(page.getByRole('textbox', { name: '* Title' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* Description' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();

    // Fill in add list form and submit
    await page.getByRole('textbox', { name: '* Title' }).click();
    await page.getByRole('textbox', { name: '* Title' }).fill(title);
    await page.getByRole('textbox', { name: '* Description' }).click();
    await page.getByRole('textbox', { name: '* Description' }).fill(description);
    await page.getByRole('button', { name: 'Submit' }).click();

    const list = page
        .getByTestId('list-items')
        .filter({
            has: page.getByRole('heading', { name: title }),
        });

    await expect(list).toContainText(description);

    // Edit List
    await expect(list.getByRole("button", { name: "Edit" })).toBeVisible();

    await list.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByRole('textbox', { name: '* Title' })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "* Title" })).toHaveValue(title);
    await expect(page.getByRole('textbox', { name: '* Description' })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "* Description" })).toHaveValue(description);
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();

    // Fill in edit list form and submit
    const editTitle = `Edit Title ${randomUUID()}`;
    const editDescription = `Edit Description ${randomUUID()}`;
    await page.getByRole('textbox', { name: '* Title' }).click();
    await page.getByRole('textbox', { name: '* Title' }).fill(editTitle);
    await page.getByRole('textbox', { name: '* Description' }).click();
    await page.getByRole('textbox', { name: '* Description' }).fill(editDescription);
    await page.getByRole('button', { name: 'Submit' }).click();

    const editedList = page
        .getByTestId("list-items")
        .filter({
            has: page.getByRole("heading", {
                name: editTitle,
            }),
        });
    await expect(editedList).toContainText(editDescription);

    // Delete List
    await editedList.getByRole("button", { name: "Delete" }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(editedList).toHaveCount(0);

    // logout
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL("/")
});

