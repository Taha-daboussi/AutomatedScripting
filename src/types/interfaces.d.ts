
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
  }
}

export {};
