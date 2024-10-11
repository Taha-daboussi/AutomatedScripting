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
const PuppeteerMain_1 = require("./Puppeteer/PuppeteerMain");
const PuppeteerReqInterceptions_1 = require("./Puppeteer/PuppeteerReqInterceptions");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const puppeteerMain = new PuppeteerMain_1.PuppeteerMain();
    const page = yield puppeteerMain.initBrowser('https://example.com');
    const reqInterceptions = new PuppeteerReqInterceptions_1.PuppeteerReqInterceptions(page);
    yield reqInterceptions.initInterceptions();
}))();
