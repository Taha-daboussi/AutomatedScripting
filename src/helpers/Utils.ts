export class Utils { 
    static  sleep(ms : number = 3000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static shortenKeyIfTooLong(key: string ) : string  {
        if (key.length > 50) {
            return key.substring(0, 100); // Truncate the key to 100 characters
        }
        return key;
    }
}