import { Main } from '../Main'
import * as fs from 'fs';
import * as path from 'path';
import {Page} from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';

export class PuppeteerReqInterceptions {
    private Main: Main;
    private requestMap: Map<string, IRequestData>;
    private requestResponseArray: Array<IRequestResponseArray>;
    id = 0

    constructor(Main: Main) {
        this.Main = Main;
        this.requestMap = new Map();
        this.requestResponseArray = [];
    }

    public async initInterceptionsForAllPages(): Promise<Array<IRequestResponseArray>> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async resolve => {
    
            this.Main.log.info('Launched My PuppeteerReqInterceptions for all browser pages');
            await this.Main.browser.pages().then(async (pages) => {
                for (const page of pages) {
                    await this.setInterceptionForPage(page); // Set up interception for existing pages
                }
            });
    
            // Listen for new pages (tabs) being opened
            this.Main.browser.on('targetcreated', async target => {
                if (target.type() === 'page') {
                    const newPage = await target.page() as Page;
                    await this.setInterceptionForPage(newPage); // Set up interception for new pages
                }
            });
    
            // Listen for all pages closing and resolve when done
            this.Main.browser.on('targetdestroyed', async() => {
                if ((await this.Main.browser.pages()).length === 0) {
                    this.Main.log.info('All browser pages closed');
                    this.handleInterceptedData();
                    resolve(this.requestResponseArray);
                }
            });
        });
    }
    
    // Separate method to set request/response interception for each page
    private async setInterceptionForPage(page: Page): Promise<void> {
        await page.setRequestInterception(true);
    
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        page.on('request', (request: { url: () => string; method: () => any; headers: () => any; postData: () => any; continue: () => void; }) => {
            const url = request.url();
            const requestData: IRequestData = {
                url: url,
                method: request.method(),
                headers: request.headers(),
                postData: request.postData(),
            };
    
            // TODO add this as a configuration ?
            if (this.requestsToSkip(url)) {
                this.requestMap.set(request.url(), requestData); // Store request data
            }
            request.continue();
        });
    
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        page.on('response', async (response) => {
            const url = response.url();
            const method = response.request().method();
            if (method === 'OPTIONS') {
                // Skip processing for preflight or no-content responses
                this.Main.log.warn(`Skipping response for ${method} request or status ${response.status()} for URL: ${url}`);
                return;
              }
          
            try {
                const text = await response.text();
                const responseData: IResponseData = {
                    url: url,
                    status: response.status(),
                    headers: response.headers(),
                    data: text
                };
    
                const requestData = this.requestMap.get(url); // Retrieve request data
                const requestId = uuidv4()
                if (requestData) {
                    const dataToWrite = { requestData, responseData, requestIndex: this.id++ , requestId };
                    this.requestResponseArray.push(dataToWrite); // Push to array
                    this.requestMap.delete(url); // Clean up the map
                }
            } catch (err) {
                this.Main.log.fatal('Failed to log the response data URL: ' + url + err);
            }
        });
    
        // Listen for the 'close' event on the page
        page.on('close', () => {
            this.Main.log.info('Page closed: ' + page.url());
            this.handleInterceptedData();
        });
    }
    
    /**
     * will write the request and response intercepted by pupeteer to a database 
     * @param myInterceptionData is my already save intercepted Data
     * @returns {void}
     */
    public writeDataToFile(myInterceptionData: Array<IRequestsData>): void {
        const dirPath = path.join(__dirname, '../Database');
        const filePath = path.join(dirPath, 'requestResponseData.json');
        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        // Write the entire array to the file
        fs.writeFileSync(filePath, JSON.stringify(myInterceptionData, null, 2), 'utf8');
    }
    /**
     * will read the request and response intercepted by pupeteer from a database
     * @returns {Array<IRequestData>} will reutrn the data read from the file
     */
    private readDataFromFile(): Array<IRequestsData> {
        this.Main.log.info('Reading data from file');
        const filePath = path.join(__dirname, '../Database/requestResponseData.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            return parsedData;
        }
        this.Main.log.fatal('No data found in file:', filePath);
        return this.readDataFromFile();
    }
    /**
     * run the handleInterceptedData function to read/write the data to the file
     * @returns {void}
     */
    public handleInterceptedData(): void {
        const myInterceptionData = this.readDataFromFile();
        this.writeDataToFile(myInterceptionData)
    }
    /**
     * skip some requests so i dont log useless requests
     * @param url url to check 
     * @returns {boolean} will return true if the request should be skipped
     */
    private requestsToSkip(url: string): boolean {
        const requestsToSkip = ["png", "css", "jpg", "jpeg", "m4s", "ico", "js", "svg", "m3u8", "mp4", "ttf", "woff2"];
        return !requestsToSkip.some(extension => url.endsWith(`.${extension}`));
    }
}


