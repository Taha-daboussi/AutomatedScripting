
declare global {
  interface IPuppeteerMain {
    initBrowser(url: string): Promise<unknown>;
  }
  interface IRequestData {
    url: string;
    method: string;
    headers: Record<string, string>;
    postData?: string;
  }
  interface IResponseData {
    url: string;
    status: number;
    headers: Record<string, string>;
    data?: string
  }
  interface IRequestsData {
    [key: string]: Array<IRequestResponseArray>
  }
  interface IRequestResponseArray {
    requestData: IRequestData,
    responseData: IResponseData,
    requestIndex: number,
    requestId: string
  }

  interface IConnectedRequestsByPayload {
    requestId: string,
    relatedRequestId: string,
    key: string
    requestIndex: number
  }

  interface IConnectedRequestsByCookies {
    cookieName: string,
    cookieValue: string,
    requestId: number,
    relatedRequestId: string,
    requestIndex: number
    relatedRequestIndex: number
  }

  interface ICookie {cookieName : string , cookieValue : string}
}

export { };
