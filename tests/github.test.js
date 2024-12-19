const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

const { EMAIL, PASSWORD, GITHUB_USER } = process.env;


jest.setTimeout(10000);

describe('GitHub Automation Test Suite', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Login to GitHub', () => {
    it('Should navigate to the login page', async () => {
      await page.goto('https://github.com/login', { waitUntil: 'networkidle2' });
    });

    it('Should fill in the email field', async () => {
      await page.waitForSelector('#login_field', { visible: true });
      await page.type('#login_field', GITHUB_USER || '');
    });

    it('Should fill in the password field', async () => {
      await page.waitForSelector('#password', { visible: true });
      await page.type('#password', PASSWORD || '');
    });

    it('Should submit the login form', async () => {
      await page.click('input[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    });

    it('Should verify the current URL is https://github.com/', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toBe('https://github.com/');
    });
    

    it('Validate User', async () => {
      await page.waitForSelector('span.Button-label img.avatar', { visible: true, timeout: 10000 });
      await page.click('span.Button-label img.avatar');
      await page.waitForSelector('div[title]', { visible: true, timeout: 10000 });

      const title = await page.$eval('div[title]', el => el.getAttribute('title'));
      expect(title).toBe(GITHUB_USER);
    });

    it('Should click on "Your profile"', async () => {
      const xpath = "//span[contains(text(), 'Your profile')]";
      const element = await page.waitForXPath(xpath, { visible: true });
    
      await page.evaluate(el => el.click(), element);
    });

    it('Should click on the "Repositories" tab', async () => {
      const selector = '#repositories-tab';
    
      await page.waitForSelector(selector, { visible: true });
      await page.click(selector);
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
      const currentUrl = await page.url();
      expect(currentUrl).toContain('?tab=repositories');
    });

    it('Should click on the first repository in the list', async () => {
      const firstRepoSelector = '#user-repositories-list ul li:first-child h3 a';
    
      await page.waitForSelector(firstRepoSelector, { visible: true });
      await page.click(firstRepoSelector);
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    });

    it('Should click on the "Pull Requests" tab', async () => {
      const pullRequestsTabSelector = '#pull-requests-tab';

      await page.waitForSelector(pullRequestsTabSelector, { visible: true });
      await page.click(pullRequestsTabSelector);
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

    });

    it('open repositories', async () => {
      await page.waitForSelector('span.Button-label img.avatar', { visible: true, timeout: 10000 });
      await page.click('span.Button-label img.avatar');

      const xpath = "//span[contains(text(), 'Your repositories')]";
      const element = await page.waitForXPath(xpath, { visible: true });

      await page.evaluate(el => el.click(), element);
    });

    it('Create new repository', async () => {
      const newButtonXPath = '//*[@id="user-profile-frame"]/div/div[1]/div/div/a';
      const newButtonElement = await page.waitForXPath(newButtonXPath, { visible: true });

      await newButtonElement.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      const inputSelector = 'input[data-testid="repository-name-input"]';
    
      await page.waitForSelector(inputSelector, { visible: true });
      const randomName = `repo-${Math.random().toString(36).substr(2, 9)}`;
      await page.type(inputSelector, randomName);
      await page.waitForTimeout(3000);
      const buttonXPath = '//button[span/span[text()="Create repository"]]';
      const button = await page.waitForXPath(buttonXPath, { visible: true });

      await button.click();
      
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      await page.waitForTimeout(1000);


      const imgDir = path.join(__dirname, '../img');
      

      const screenshotPath = path.join(imgDir, 'screenshot.png');
      await page.screenshot({ path: screenshotPath });

    });

    
    it('Loggout', async () => {
      await page.waitForSelector('span.Button-label img.avatar', { visible: true, timeout: 10000 });
      await page.click('span.Button-label img.avatar');
      await page.waitForSelector('div[title]', { visible: true, timeout: 10000 });

      const xpath = "//span[contains(text(), 'Sign out')]";
      const element = await page.waitForXPath(xpath, { visible: true });
    
      await page.evaluate(el => el.click(), element);
      await page.waitForTimeout(10000);
    });

  });
});