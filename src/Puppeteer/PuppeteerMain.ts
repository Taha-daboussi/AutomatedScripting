import puppeteer, { Page } from 'puppeteer';
import {Main} from '../Main'
export class PuppeteerMain implements IPuppeteerMain {
  Main : Main
  constructor(Main : Main) {
    this.Main = Main 
  }
  /**
   * will init browser of puppeteer and return its page for later usage 
   * @param url - url to open in the browser
   * @returns - page object of the browser
   */
  async initBrowser(url: string = 'https://www.google.com'): Promise<Page> {
    this.Main.log.info('initializing browser');
    const browser = await puppeteer.launch({executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' , headless : false });
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({width: 1080, height: 1024});
    if(page) this.Main.log.info('browser initialized');
    return page;
  }
}
