import { PuppeteerMain } from "./Puppeteer/PuppeteerMain";
import { PuppeteerReqInterceptions } from './Puppeteer/PuppeteerReqInterceptions';
import { Page } from "puppeteer";
import { Logger, ILogObj } from "tslog";

export class Main {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    page: Page;
    log: Logger<ILogObj> = new Logger();

    async run() {
        const puppeteerMain = new PuppeteerMain(this);
        this.page = await puppeteerMain.initBrowser('https://www.google.com') as Page;
        const reqInterceptions = new PuppeteerReqInterceptions(this);
        reqInterceptions.initInterceptions();
    }
}

new Main().run();