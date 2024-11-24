import { PuppeteerMain } from "./Puppeteer/PuppeteerMain";
import { PuppeteerReqInterceptions } from './Puppeteer/PuppeteerReqInterceptions';
import {LinkedRequestFinder} from './RequestParser/LinkedRequestFinder'
import { Page , Browser } from "puppeteer";
import { Logger, ILogObj } from "tslog";
import { Helpers } from "./helpers/Helpers";
import * as path from 'path';

import fs from 'fs'
export class Main {
    puppeteerMain  = new PuppeteerMain(this)
    puppeteerReqInterceptions = new PuppeteerReqInterceptions(this);
    linkedRequestFinder = new LinkedRequestFinder(this)
    valuesToScrape = ["ct0=","auth_token="]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    page: Page;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    browser: Browser;

    log: Logger<ILogObj> = new Logger();
    url: string = '';
    keysToSkip = ['username', 'password', 'email', 'user', 'pass', 'name', 'screen_name', "next_link", "LoginTwoFactorAuthChallenge"]
    cookiesToSkipComparing = ["domain","max-age","samesite","secure","httponly","expires","path"]

    async run(url : string ) {
        this.url = url
        const { page , browser} = await this.puppeteerMain.initBrowser() ;
        this.page = page;
        this.browser = browser;

        const requestResponseArray = await this.puppeteerReqInterceptions.initInterceptionsForAllPages();
        const finalRequest = Helpers.ScrapingHelpers.findRequestWithValuesToScrape(requestResponseArray,this.valuesToScrape)[0];

        if(!finalRequest) {
            this.log.error('No request found with values to scrape')
            return;
        }

        const mappedRelatedRequests = this.handleInterceptedData(requestResponseArray , finalRequest);
        this.writeMappedRelatedRequestsToFile(mappedRelatedRequests);
    }

    /**
     * handle interecpted data and process them 
     * @param requestResponseArray interecpted request Data 
     * @param finalRequest final request where the software got the final data to be used 
     * @returns {IConnectedRequestsByPayload[]} mapped related requests and data
     */
    handleInterceptedData = (requestResponseArray  : Array<IRequestResponseArray> , finalRequest : IRequestResponseArray ): IConnectedRequestsByPayload[] => {
        const finalRequestIndex = requestResponseArray.indexOf(finalRequest);
        const splicedRequestArray = requestResponseArray.splice(1,finalRequestIndex);
        const mappedRelatedRequests = this.linkedRequestFinder.run(finalRequest,splicedRequestArray)
        const flattenedArray = mappedRelatedRequests.flatMap((res : IConnectedRequestsByPayload) => [res.requestId, res.relatedRequestId]);
        const relatedRequests = splicedRequestArray.filter(res=> flattenedArray.includes(res.requestId))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.puppeteerReqInterceptions.writeDataToFile(relatedRequests as any )
        return mappedRelatedRequests
    }
    /**
     * will write the mapped related requests to a file
     * @param mappedRelatedRequests mapped related requests and data
     */
    writeMappedRelatedRequestsToFile = (mappedRelatedRequests : IConnectedRequestsByPayload[]) => {
        const dirPath = path.join(__dirname, './Database');
        const filePath = path.join(dirPath, 'mappedRelatedRequests.json');
        fs.writeFileSync(filePath,JSON.stringify(mappedRelatedRequests,null,2))
    }


}

new Main().run('https://x.com/i/flow/login');