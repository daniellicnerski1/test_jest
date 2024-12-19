const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { PASSWORD, GITHUB_USER } = process.env;

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
    it('Should navigate to the login page and login', async () => {
      await page.goto('https://github.com/login', { waitUntil: 'networkidle2' });
      await page.waitForSelector('#login_field', { visible: true });
      await page.type('#login_field', GITHUB_USER || '');
      await page.waitForSelector('#password', { visible: true });
      await page.type('#password', PASSWORD || '');
      await page.click('input[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      const currentUrl = page.url();
      expect(currentUrl).toBe('https://github.com/');
    });

    it('Validate User and Navigate to Profile', async () => {
      await page.waitForSelector('span.Button-label img.avatar', { visible: true, timeout: 10000 });
      await page.click('span.Button-label img.avatar');
      await page.waitForSelector('div[title]', { visible: true, timeout: 10000 });

      const title = await page.$eval('div[title]', el => el.getAttribute('title'));
      expect(title).toBe(GITHUB_USER);

      const profileXpath = "//span[contains(text(), 'Your profile')]";
      const profileElement = await page.waitForXPath(profileXpath, { visible: true });
      await page.evaluate(el => el.click(), profileElement);
    });

    it('Should click on the "Repositories" tab', async () => {
      const selector = '#repositories-tab';

      await page.waitForSelector(selector, { visible: true });
      await page.click(selector);
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      const currentUrl = await page.url();
      expect(currentUrl).toContain('?tab=repositories');
    });

    it('Should create a new repository', async () => {
      const newButtonXPath = '//*[@id="user-profile-frame"]/div/div[1]/div/div/a';
      const newButtonElement = await page.waitForXPath(newButtonXPath, { visible: true });

      await newButtonElement.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      const inputSelector = 'input[data-testid="repository-name-input"]';
      await page.waitForSelector(inputSelector, { visible: true });
      const randomName = `repo-${Math.random().toString(36).substr(2, 9)}`;
      await page.type(inputSelector, randomName);
      await page.waitForTimeout(3000);

      const createButtonXPath = '//button[span/span[text()="Create repository"]]';
      const createButton = await page.waitForXPath(createButtonXPath, { visible: true });
      await createButton.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      const imgDir = path.join(__dirname, '../img');
      const screenshotPath = path.join(imgDir, 'screenshot.png');
      await page.screenshot({ path: screenshotPath });
    });

    it('Should logout and verify', async () => {
      await page.waitForSelector('span.Button-label img.avatar', { visible: true, timeout: 10000 });
      await page.click('span.Button-label img.avatar');
      const logoutXpath = "//span[contains(text(), 'Sign out')]";
      const logoutElement = await page.waitForXPath(logoutXpath, { visible: true });
      await page.evaluate(el => el.click(), logoutElement);
      await page.waitForTimeout(3000);

      const expectedUrl = 'https://github.com/logout';
      const currentUrl = page.url();
      expect(currentUrl).toBe(expectedUrl);
    });
  });
});
