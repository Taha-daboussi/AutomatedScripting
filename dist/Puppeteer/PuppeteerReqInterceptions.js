"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerReqInterceptions = void 0;
class PuppeteerReqInterceptions {
    constructor(page) {
        this.page = page;
    }
    /**
     * Initializes request and response interception on the page.
     */
    initInterceptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.setRequestInterception(true);
            this.page.on('request', (request) => {
                const requestData = {
                    url: request.url(),
                    method: request.method(),
                    headers: request.headers(),
                    postData: request.postData(),
                };
                console.log('Outgoing Request:', requestData);
                request.continue();
            });
            this.page.on('response', (response) => __awaiter(this, void 0, void 0, function* () {
                const responseData = {
                    url: response.url(),
                    status: response.status(),
                    headers: response.headers(),
                };
                console.log('Incoming Response:', responseData);
            }));
        });
    }
}
exports.PuppeteerReqInterceptions = PuppeteerReqInterceptions;
