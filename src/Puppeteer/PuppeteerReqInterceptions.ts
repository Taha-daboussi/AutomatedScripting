import { Main } from '../Main'
import * as fs from 'fs';
import * as path from 'path';

export class PuppeteerReqInterceptions {
    private Main: Main;
    private requestMap: Map<string, IRequestData>;
    private requestResponseArray: Array<IRequestResponseArray>;

    constructor(Main: Main) {
        this.Main = Main;
        this.requestMap = new Map();
        this.requestResponseArray = [];
    }

    /**
     * Initializes request and response interception on the page.
     * @returns {void}
     */
    public async initInterceptions(): Promise<void> {
        this.Main.log.info('Launched My PuppeteerReqInterceptions');
        await this.Main.page.setRequestInterception(true);
        this.Main.page.on('request', (request) => {
            const requestData: IRequestData = {
                url: request.url(),
                method: request.method(),
                headers: request.headers(),
                postData: request.postData(),
            };
            this.requestMap.set(request.url(), requestData); // Store request data
            request.continue();
        });

        this.Main.page.on('response', async (response) => {
            const responseData: IResponseData = {
                url: response.url(),
                status: response.status(),
                headers: response.headers(),
            };

            const requestData = this.requestMap.get(response.url()); // Retrieve request data
            if (requestData) {
                const dataToWrite = { requestData, responseData };
                this.requestResponseArray.push(dataToWrite); // Push to array
                this.requestMap.delete(response.url()); // Clean up the map
            } else {
                this.Main.log.warn("Response without matching request:", responseData);
            }
        });

        // Listen for the 'close' event on the page
        this.Main.page.on('close', () => {
            this.Main.log.info('Browser page closed');
            this.handleInterceptedData()
        });
    }
    /**
     * will write the request and response intercepted by pupeteer to a database 
     * @param myInterceptionData is my already save intercepted Data
     * @returns {void}
     */
    private writeDataToFile(myInterceptionData: Array<IRequestsData>): void {
        const dirPath = path.join(__dirname, '../Database');
        const filePath = path.join(dirPath, 'requestResponseData.json');
        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const pageUrl = this.Main.page.url()
        myInterceptionData.push({ [pageUrl]: this.requestResponseArray });
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
            this.Main.log.debug('Read data from file:', parsedData);
            return parsedData;
        }
        this.Main.log.fatal('No data found in file:', filePath);
        return this.readDataFromFile();
    }
    /**
     * run the handleInterceptedData function to read/write the data to the file
     * @returns {void}
     */
    private handleInterceptedData(): void {
        const myInterceptionData = this.readDataFromFile();
        this.writeDataToFile(myInterceptionData)
    }

}