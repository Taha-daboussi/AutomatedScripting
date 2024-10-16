import { ScrapingHelpers } from "./helpers/ScrapingHelpers";
import { PuppeteerMain } from "./Puppeteer/PuppeteerMain";
import { PuppeteerReqInterceptions } from './Puppeteer/PuppeteerReqInterceptions';
import {LinkedRequestFinder} from './RequestParser/LinkedRequestFinder'
import { Page , Browser } from "puppeteer";
import { Logger, ILogObj } from "tslog";

export class Main {
    puppeteerMain  = new PuppeteerMain(this)
    puppeteerReqInterceptions = new PuppeteerReqInterceptions(this);
    linkedRequestFinder = new LinkedRequestFinder(this)
    valuesToScrape = ["ct0","auth_token"]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    page: Page;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    browser: Browser;

    log: Logger<ILogObj> = new Logger();
    url: string = '';


    async run(url : string ) {
        this.url = url
        const { page , browser} = await this.puppeteerMain.initBrowser() ;
        this.page = page;      // Assign the page to this.page
        this.browser = browser;
        const requestResponseArray = await this.puppeteerReqInterceptions.initInterceptionsForAllPages();
        const finalRequest = ScrapingHelpers.findRequestWithValuesToScrape(requestResponseArray,this.valuesToScrape)[0];
        if(!finalRequest) {
            this.log.error('No request found with values to scrape')
            return;
        }
        const finalRequestIndex = requestResponseArray.indexOf(finalRequest);
        const splicedRequestArray = requestResponseArray.splice(1,finalRequestIndex);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.puppeteerReqInterceptions.writeDataToFile(splicedRequestArray as any )
        this.puppeteerReqInterceptions.handleInterceptedData();
        this.linkedRequestFinder.run(finalRequest,splicedRequestArray)
    }

}

new Main().run('https://x.com/i/flow/login');