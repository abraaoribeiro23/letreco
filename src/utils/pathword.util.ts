import { DailyWord } from "../models";
import { getToday } from ".";

var CryptoJS = require("crypto-js");

export function getPathWord(ciphertext: string | null): DailyWord | undefined{
    // Decrypt
    try {
        var words = CryptoJS.enc.Base64url.parse(ciphertext);
        var textString = CryptoJS.enc.Utf8.stringify(words);
        var result : DailyWord = {
            date: getToday(),
            edition: '00',
            word: textString,
        }
        return result;

    } catch (e) {
        return undefined;
    }
}

export function getPathWordEncrypted(word: string): string {
    return CryptoJS.enc.Base64url.stringify(CryptoJS.enc.Utf8.parse(word));
}