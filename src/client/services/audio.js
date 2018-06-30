import Net from '../lib/Net';
const net = new Net([]);

export default {
    async getAudio(word) {
        const resp = await net.request({
            url: {
                pathname: `/api/audios/${word}`
            }
        });
        return resp.body;
    },
    async putAudio(word) {
        const resp = await net.request({
            url: {
                pathname: `/api/audios/${word}`
            },
            method: 'PUT'
        });
        
    }
}