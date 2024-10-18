import { Helpers } from "../../src/helpers/Helpers";
import { Main } from "src/Main";
const keysToSkip = ['username', 'password', 'email', 'user', 'pass', 'name', 'screen_name', "next_link", "LoginTwoFactorAuthChallenge"]

export class LinkedRequestFinder {
    Main: Main;
    data!: IRequestResponseArray[];
    constructor(Main: Main) {
        this.Main = Main
    }
    /**
     * 
     * @param initialPair 
     * @param data 
     */
    run(initialPair: IRequestResponseArray, data: Array<IRequestResponseArray>):IMappedRelatedRequests[] {
        this.data = data
        return this.findRelatedRequests(initialPair)
    }
    /**
     * will map through intercepted requests and find related requests to the initial request 
     * @param initialPair initial pair to start maping from 
     * @returns {void}
     */
    findRelatedRequests = (initialPair: IRequestResponseArray, mappedRelatedRequests: IMappedRelatedRequests[] = []): IMappedRelatedRequests[] => {
        const requestData = initialPair.requestData;
        if (initialPair && initialPair.requestId !== null) {
            let requestDataPostData: Record<string, string> = {};
            if (typeof requestData.postData === 'string' && requestData.postData.includes('&')) {
                const searchParams = new URLSearchParams(requestData.postData);
                requestDataPostData = {};
                searchParams.forEach((value, key) => {
                    requestDataPostData[key] = value;
                });
            } else {
                try {
                    requestDataPostData = JSON.parse(requestData.postData as string) as Record<string, string>;
                } catch (e: unknown) {
                    this.Main.log.error('Invalid JSON format in postData: ' + e, requestData.postData);
                    return mappedRelatedRequests;
                }
            }
            const dynamicDataToLookFor = this.scrapePostData(requestDataPostData);
            const foundResponses = [] as IRequestResponseArray[];
            dynamicDataToLookFor.forEach((key) => {
                const foundData = this.data.filter(res => JSON.stringify(res.responseData).includes(key))[0];
                if (foundData && foundData.requestId && (foundData.requestId != initialPair.requestId) && key.length > 3) {
                    this.Main.log.info("Request ID Request : " + initialPair.requestId + " Response Comes From Request ID  : " + foundData.requestId + " Resposne " + " For Value: " + Helpers.GeneralHelpers.shortenKeyIfTooLong(key));
                    mappedRelatedRequests.push({
                        requestId: initialPair.requestId,
                        relatedRequestId: foundData.requestId,
                        key: key,
                        requestIndex : initialPair.requestIndex
                    });
                    foundResponses.push(foundData);
                } else {
                    if (key.length > 3) {
                        if (Helpers.ScrapingHelpers.isDynamicValue(key)) {
                            this.Main.log.trace("Dynamic Value " + Helpers.GeneralHelpers.shortenKeyIfTooLong(key) + " Might Be Javascript Generated Or User Input");
                        } else {
                            this.Main.log.warn("No Related Request Found for Request ID " + initialPair.requestId + " and Value: " + Helpers.GeneralHelpers.shortenKeyIfTooLong(key));
                        }
                    }
                }
            });
            if (foundResponses.length > 0) {
                foundResponses.forEach(response => {
                    this.findRelatedRequests(response, mappedRelatedRequests); // Recursively handle each found response
                });
            } else {
                this.Main.log.warn('Not all related requests were found for Request ID ' + initialPair.requestId);
            }
        }
        return mappedRelatedRequests;
    };
    
    /**
     * @description will scrape dynamic Data to scrape and look for from requests
     * @param dataObject data to Look From  
     * @param dynamicDataToScrape stored dynamic data To scrape
     * @returns dyname data to scrape
     */
    scrapePostData = (dataObject: Record<string, string>, dynamicDataToScrape: string[] = []) => {
        for (const key in dataObject) {
            if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
                const value = dataObject[key]; // Access the value for each key

                // Check if the value is an array
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        // If the array contains objects, loop through them
                        if (typeof item === 'object' && item !== null) {
                            Object.keys(item).forEach((subKey) => {
                                if (typeof item[subKey] === 'object') {
                                    this.scrapePostData(item[subKey], dynamicDataToScrape); // Recursively pass dynamicDataToScrape
                                }
                            });
                        }
                    });
                }
                // Check if the value is an object
                else if (typeof value === 'object' && value !== null) {
                    Object.keys(value).forEach((subKey) => {
                        this.scrapePostData(value[subKey], dynamicDataToScrape); // Recursively pass dynamicDataToScrape
                    });
                }
                // Otherwise, it is a primitive (string, number, etc.)
                else {
                    if (Helpers.ScrapingHelpers.isDynamicValue(value , keysToSkip) && !keysToSkip.includes(key.toLowerCase())) {
                        dynamicDataToScrape.push(value); // Add to local dynamicDataToScrape
                    }
                }
            }
        }
        return dynamicDataToScrape; // Return the accumulated data
    };

}