import puppeteer, { Page  , Browser} from 'puppeteer';
import {Main} from '../Main'
import { Utils } from '../../src/helpers/Utils';
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
  async initBrowser(): Promise<{page : Page , browser : Browser}> {
    const browser = await puppeteer.launch(
      {
        headless: false, //defaults to true 
        defaultViewport: null, //Defaults to an 800x600 viewport
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
                       //by default puppeteer runs Chromium buddled with puppeteer 
        args:['--start-maximized' ,  '--disable-web-security', ]
      });
    const page = await browser.newPage();
    Utils.sleep(5000).then(()=>{
    page.goto('https://x.com/i/flow/login');
  })
    return {page , browser}
  
  }
}
