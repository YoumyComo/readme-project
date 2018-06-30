import Net from '../lib/Net';
const net = new Net([]);

export default {
    async getImage(word) {
        const resp = await net.request({
            url: {
                pathname: `/api/images/${word}`
            }
        });
        return resp.body;
    },
    async postImage() {
        const resp = await net.request({
            json: false,
            method: 'POST',
            url: {
                pathname: `/api/images`
            }
        });
    }
}