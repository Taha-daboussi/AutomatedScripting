export class ScrapingHelpers {
    /**
     * Scrape the request data from the requestResponseArray
     * @param requestsArray - Array of request and response data
     * @param valuesToScrape - Array of values to scrape
     * @returns Array of request and response data
     */
    static findRequestWithValuesToScrape = (requestsArray: IRequestResponseArray[], valuesToScrape: string[]) => {
        return requestsArray.filter((request: IRequestResponseArray) => {
            // Ensure all `valuesToScrape` are found in the request object
            return valuesToScrape.every((valueToScrape: string) => {
                return JSON.stringify(request).includes(valueToScrape);
            });
        });
    };
}