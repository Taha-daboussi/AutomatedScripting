import { Main } from "src/Main";
const keysToSkip = ['username' , 'password' , 'email' , 'user' , 'pass' , 'name' , 'screen_name' , "next_link", "LoginTwoFactorAuthChallenge"]

export class LinkedRequestFinder {
    Main: Main;
    data!: IRequestResponseArray[];
    constructor(Main: Main) {
        this.Main = Main
    }
    run(initialPair: IRequestResponseArray ,  data : Array<IRequestResponseArray>){
        this.data = data
        this.findRelatedRequests(initialPair)
    }
    findRelatedRequests = (initialPair: IRequestResponseArray) => {
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
                } catch (e : unknown ) {
                    this.Main.log.error('Invalid JSON format in postData: ' + e, requestData.postData);
                    return;
                }
            }
            const dynamicDataToLookFor = this.scrapeBasedOnQuotations(requestDataPostData);
            const foundResponses = [] as IRequestResponseArray[];
            dynamicDataToLookFor.forEach((key) => {
                const foundData = this.data.filter(res => JSON.stringify(res.responseData).includes(key))[0];
                if (foundData && foundData.requestId && (foundData.requestId != initialPair.requestId) && key.length > 3) {
                    this.Main.log.info("Request ID Request : " + initialPair.requestId + " Response Comes From Request ID  : " + foundData.requestId  + " Resposne "+ " For Value: " + key);
                    foundResponses.push(foundData);
                } else {
                    if(key.length > 3){
                    if (this.isDynamicValue(key)) {
                        this.Main.log.info("Dynamic Value " + key + " Not Found in any Request Most Likely Javascript Generated");
                    } else {
                        this.Main.log.warn("No Related Request Found for Request ID " + initialPair.requestId + " and Value: " + key);
                    }
                }
                }
            });
            if (foundResponses.length > 0) {
                foundResponses.forEach(response => {
                    this.Main.log.info('Searching For Request Data For Request ID :  : ', response.requestId);
                    this.findRelatedRequests(response); // Recursively handle each found response
                });
            } else {
                this.Main.log.warn('Not all related requests were found for Request ID ' + initialPair.requestId);
            }
        }
    };

    isDynamicValue = (value : string | number ) => {
        const dynamicPattern = /[a-zA-Z0-9;:-]{10,}/; // Example regex for tokens/IDs

        // Check if the value matches the dynamic pattern
        if (typeof value === 'string' && dynamicPattern.test(value)) {
            return true;
        }
        // Check if the value is in the list of known static values
        if (keysToSkip.includes(value as string )) {
            return false;
        }
        // If it's numeric, assume it's dynamic (could be a code like "495171")
        if (!isNaN(value as number)) {
            return true;
        }
        return false;
    };

    scrapeBasedOnQuotations = (dataObject : Record<string,string>, dynamicDataToScrape : string[] = []) => {
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
                      this.scrapeBasedOnQuotations(item[subKey], dynamicDataToScrape); // Recursively pass dynamicDataToScrape
                    }
                  });
                }
              });
            } 
            // Check if the value is an object
            else if (typeof value === 'object' && value !== null) {
              Object.keys(value).forEach((subKey) => {
                this.scrapeBasedOnQuotations(value[subKey], dynamicDataToScrape); // Recursively pass dynamicDataToScrape
              });
            } 
            // Otherwise, it is a primitive (string, number, etc.)
            else {
              if (this.isDynamicValue(value) && !keysToSkip.includes(key.toLowerCase())) {
                dynamicDataToScrape.push(value); // Add to local dynamicDataToScrape
              }
            }
          }
        }
        return dynamicDataToScrape; // Return the accumulated data
    };

}