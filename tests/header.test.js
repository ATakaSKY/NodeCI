
const Page = require('./helpers/page');

let page = null;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
})

afterEach(async () => {
    await page.close();
}) 

test('if header is allright', async () => {
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toBe('Blogster');
})

test('click login to assert auth flow', async () => {
    await page.click('.right a');

    const url = await page.url();
    expect(url).toMatch('accounts.google.com');
})

test('when signed in, shows logout button', async () => {
    await page.login();

    const text = await page.getContentsOf('a[href="/auth/logout"]');

    expect(text).toBe('Logout');

})