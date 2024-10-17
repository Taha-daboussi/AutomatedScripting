export class ScrapingHelpers {
    /**
     * Scrape the request data from the requestResponseArray
     * @param requestsArray - Array of request and response data
     * @param valuesToScrape - Array of values to scrape
     * @returns Array of request and response data
     */
     findRequestWithValuesToScrape = (requestsArray: IRequestResponseArray[], valuesToScrape: string[]) => {
        return requestsArray.filter((request: IRequestResponseArray) => {
            // Ensure all `valuesToScrape` are found in the request object
            return valuesToScrape.every((valueToScrape: string) => {
                return JSON.stringify(request).includes(valueToScrape);
            });
        });
    };
    /**
     * will check if the value is dynamic or not
     * @param value value to check 
     * @param keysToSkip keys to skip from the check
     * @returns {boolean} will return true if the value is dynamic
     */
    isDynamicValue = (value: string | number , keysToSkip : string[] = []) => {
        const dynamicPattern = /[a-zA-Z0-9;:-]{10,}/; // Example regex for tokens/IDs

        // Check if the value matches the dynamic pattern
        if (typeof value === 'string' && dynamicPattern.test(value)) {
            return true;
        }
        // Check if the value is in the list of known static values
        if (keysToSkip.includes(value as string)) {
            return false;
        }
        // If it's numeric, assume it's dynamic (could be a code like "495171")
        if (!isNaN(value as number)) {
            return true;
        }
        return false;
    };
}