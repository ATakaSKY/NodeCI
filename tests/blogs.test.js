
const Page = require('./helpers/page');
Number.prototype._called = {};

let page = null;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
})

afterEach(async () => {
    await page.close();
}) 

describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a[href="/blogs/new"]');
    })

    test('able to get blog title', async () => {
        const text = await page.getContentsOf('.title label');
    
        expect(text).toBe('Blog Title');
    })

    describe('When no field input added', async () => {
        beforeEach(async () => {
            await page.click('form button');
        })
    
        test('able to show validation errors', async () => {
            const input = await page.getContentsOf('.title .red-text');
            const content = await page.getContentsOf('.content .red-text');
        
            expect(input).toBe('You must provide a value');
            expect(content).toBe('You must provide a value');
        })
    })

    describe('When field inputs are added', async() => {
        beforeEach(async () => {
            await page.type('.title input', 'Blog Title');
            await page.type('.content input', 'Blog content');
            await page.click('form button');
        })
    
        test('submitting takes user to review screen', async () => {
            const content = await page.getContentsOf('h5');
    
            expect(content).toBe('Please confirm your entries');
        })

        test('submitting and then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
    
            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');
        
            expect(title).toBe('Blog Title');
            expect(content).toBe('Blog content');
        })
    })
})

describe('When user is not logged in', async () => {
    test('displays error messages', async () => {

        const result = await page.evaluate(() => {
            return fetch('/api/blogs',{
                method:'POST',
                credentials:'same-origin',
                headers:{
                    'Content-Type':'application/json'
                },
                data:JSON.stringify({title:'Blog Title', content:'Blog content'})
            }).then(res => res.json())
        });
    
        expect(result.error).toBe('You must log in!');
    })

    test('User cannot see a list of posts', async () => {

        const result = await page.evaluate(() => {
            return fetch('/api/blogs',{
                method:'GET',
                credentials:'same-origin',
                headers:{
                    'Content-Type':'application/json'
                }
            }).then(res => res.json())
        });
    
        expect(result.error).toBe('You must log in!');
    })
})