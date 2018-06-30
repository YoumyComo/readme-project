import Net from '../lib/Net';
const net = new Net([]);

export default {
    async getWord(spell) {
        const resp = await net.request({
            url: {
                pathname: `/api/words/${spell}`
            }
        });
        return resp.body;
    },
    async postWord(data, bookName, chapterName) {
        const resp = await net.request({
            json: false,
            method: 'POST',
            url: {
                pathname: `/api/business/${bookName}/${chapterName}`,
            },
            body: data
        });
        
    },
}