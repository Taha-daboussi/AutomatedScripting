export class ScrapingHelpers {
    /**
     * Scrape the request data from the requestResponseArray
     * @param requestsArray - Array of request and response data
     * @param valuesToScrape - Array of values to scrape
     * @returns Array of request and response data
     */
    static findRequestWithValuesToScrape = (requestsArray: IRequestResponseArray[], valuesToScrape: string[]) => {
        return requestsArray.filter((request: IRequestResponseArray) => {
            return valuesToScrape.some((valueToScrape: string) => JSON.stringify(request).includes(valueToScrape))
        });
    };
}