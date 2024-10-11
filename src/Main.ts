import { PuppeteerMain } from "./Puppeteer/PuppeteerMain";
import { PuppeteerReqInterceptions } from './Puppeteer/PuppeteerReqInterceptions';

(async () => {
    const puppeteerMain = new PuppeteerMain();
    const page = await puppeteerMain.initBrowser('https://example.com');
    const reqInterceptions = new PuppeteerReqInterceptions(page);
    await reqInterceptions.initInterceptions();
})();