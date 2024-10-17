export class GeneralHelpers { 
    sleep(ms : number = 3000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
     shortenKeyIfTooLong(key: string ) : string  {
        if (key.length > 50) {
            const keyLength = key.length
            return key.substring(0, keyLength/4) + "..." + key.substring( keyLength - keyLength/4 , keyLength); // Truncate the key to 100 characters
        }
        return key;
    }
}