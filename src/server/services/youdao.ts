import fetch from 'node-fetch';
import * as URL from 'url';
import * as MD5 from 'md5';
const appKey = '72085995d3118292';
const appSecret = 'I5lFYwIu01jDpqxFfWA83p5F4yseJcXB';

export type TranslateResp = {
    tSpeakUrl: string,
    web: { value: string[], key: string }[],
    query: string,
    translation: string[],
    errorCode: string,
    dict: {
        url: string,
    },
    webdict: { url: string },
    basic: {
        'us-phonetic': string,
        phonetic: string,
        'uk-phonetic': string,
        'uk-speech': string,
        explains: string[],
        'us-speech': string,
    },
    l: string,
    speakUrl: string
}

export default class Youdao {
    getSign(word: string, salt: string): string {
        return MD5(`${appKey}${word}${salt}${appSecret}`)
    }

    async translate(word: string) {
        const salt = String(Date.now());
        const sign = this.getSign(word, salt);
        const url = URL.format({
            protocol: 'http',
            host: 'openapi.youdao.com',
            pathname: '/api',
            query: {
                q: word,
                from: 'EN',
                to: 'zh_CHS',
                appKey,
                salt,
                sign,
            }
        });

        const resp = await fetch(url);
        const data: TranslateResp = await resp.json();
        return data;
    }
}
