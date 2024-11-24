import { Main } from "src/Main";
import { FindConnectedRequestsByPayload } from "./FindConnectedRequestsByPayload";
import { FindConnectedRequestsByCookies } from "./FindConnectedRequestsByCookies";

export class LinkedRequestFinder {
    Main: Main;
    data!: IRequestResponseArray[];
    FindConnectedRequestsByPayload: FindConnectedRequestsByPayload
    FindConnectedRequestsByCookies : FindConnectedRequestsByCookies
    constructor(Main: Main) {
        this.Main = Main
        this.FindConnectedRequestsByCookies  = new FindConnectedRequestsByCookies(this.Main)
        this.FindConnectedRequestsByPayload = new FindConnectedRequestsByPayload(this.Main)

    }
    /**
     * 
     * @param initialPair 
     * @param data 
     */
    run(initialPair: IRequestResponseArray, data: Array<IRequestResponseArray>):IConnectedRequestsByPayload[] {
        const connectedRequestsByPayload = this.FindConnectedRequestsByPayload.findConnectedRequestsByPayload(initialPair , [], data)
        const connectedRequestsByCookies = this.FindConnectedRequestsByCookies.trackCookies(data);
        this.Main.log.info(connectedRequestsByCookies)
        return connectedRequestsByPayload
    }

}