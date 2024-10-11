import puppeteer, { Page } from 'puppeteer';

export class PuppeteerMain implements IPuppeteerMain {
  constructor() {
  }
  /**
   * will init browser of puppeteer and return its page for later usage 
   * @param url - url to open in the browser
   * @returns - page object of the browser
   */
  async initBrowser(url: string = 'https://example.com'): Promise<Page> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
  }
}
