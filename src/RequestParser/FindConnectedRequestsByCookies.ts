import { Main } from "src/Main";

export class FindConnectedRequestsByCookies {
    Main: Main;
    constructor(Main: Main) {
        this.Main = Main
    }
    /**
     * will extract the cookies values from set cookie header
     * @param setCookieHeader set cookie headero f type string 
     * @returns Record of cookies values object 
     */
    extractSetCookies = (setCookieHeader: string): Record<string, string> => {
        const cookies: Record<string, string> = {};
        const cookieArray = setCookieHeader.split(';'); // Split cookies by newlines
        for (let i = 0; i < cookieArray.length; i++) {
            const cookieString = cookieArray[i];
            const [cookieName, cookieValue] = cookieString.split('=');
            if (cookieName && cookieValue) {
                cookies[cookieName.trim()] = cookieValue.trim();
            }
        }
        return cookies;
    };
    /**
     * will extract the request cookies from the cookie header of the request
     * @param cookieHeader cookie header value 
     * @returns array of cookies object 
     */
    extractRequestCookies = (cookieHeader: string): Array<ICookie> => {
        const cookiesArray = cookieHeader.split(';');
        // Iterate over each cookie string and extract the cookie name and value
        const cookies = cookiesArray.map(cookieStr => {
            // Split the cookie string at the first occurrence of ';' to separate the name=value part
            if (cookieStr.includes('=')) {
                const myCookie = cookieStr.split('=')
                const cookie = {
                    cookieName: myCookie[0].trim(),
                    cookieValue: myCookie[1].trim()
                }
                return cookie; // Return only the name=value part, trimming any extra spaces
            }
        });
        return cookies.filter(res => res) as Array<ICookie>;
    };
    /**
     * will track cookies and will log which cookie came from which request
     * @param requests array of request and response data
     */
    trackCookies = (requests: IRequestResponseArray[]) => {
        const cookiesSet: { cookieValue: string, cookieName: string, sourceRequestId: string, sourceRequestIndex: number }[] = [];
        const connectedRequestsByCookies: IConnectedRequestsByCookies[] = []
        requests.forEach((request) => {
            // If the current response has a 'set-cookie' header, store its cookies
            const setCookieHeader = request.responseData.headers['set-cookie'];
            if (setCookieHeader) {
                const setCookies = this.extractSetCookies(setCookieHeader);

                Object.entries(setCookies).forEach(requestCookie => {
                    cookiesSet.push({
                        cookieName: requestCookie[0],
                        cookieValue: requestCookie[1],
                        sourceRequestId: request.requestId,
                        sourceRequestIndex: request.requestIndex,
                    });
                });
            }

            // Check if the next request uses any cookies from the previous responses
            const requestCookiesHeader = request.requestData.headers.cookie;
            if (requestCookiesHeader) {
                const requestCookies = this.extractRequestCookies(requestCookiesHeader);
                requestCookies.forEach((cookieValue: ICookie) => {
                    const cookieOrigin = cookiesSet.find(cookie => cookie.cookieValue === cookieValue.cookieValue);
                    if (cookieOrigin && (request.requestId != cookieOrigin.sourceRequestId) && !this.Main.cookiesToSkipComparing.includes(cookieValue.cookieName.toLowerCase())) {
                        this.Main.log.info(`Cookie "${cookieValue.cookieName}" in request ${request.requestId} (index ${request.requestIndex}) comes from request ${cookieOrigin.sourceRequestId} (index ${cookieOrigin.sourceRequestIndex}).`);
                        const connectedRequestsByCookie: IConnectedRequestsByCookies = {
                            ...cookieValue,
                            requestId: Number(request.requestId),
                            relatedRequestId: cookieOrigin.sourceRequestId,
                            requestIndex: request.requestIndex,
                            relatedRequestIndex: Number(cookieOrigin.sourceRequestIndex)
                        }
                        connectedRequestsByCookies.push(connectedRequestsByCookie);
                    }
                });
            }
        });

    };
}