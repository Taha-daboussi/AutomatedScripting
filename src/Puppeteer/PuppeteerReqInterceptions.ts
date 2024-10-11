import { Page } from 'puppeteer';
export class PuppeteerReqInterceptions {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Initializes request and response interception on the page.
     */
    public async initInterceptions(): Promise<void> {
        await this.page.setRequestInterception(true);

        this.page.on('request', (request) => {
            const requestData: IRequestData = {
                url: request.url(),
                method: request.method(),
                headers: request.headers(),
                postData: request.postData(),
            };
            console.log('Outgoing Request:', requestData);
            request.continue();
        });

        this.page.on('response', async (response) => {
            const responseData: IResponseData = {
                url: response.url(),
                status: response.status(),
                headers: response.headers(),
            };
            console.log('Incoming Response:', responseData);
        });
    }
}