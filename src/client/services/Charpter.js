import Net from '../lib/Net';
const net = new Net([]);

export default {
    async getCharpterByQRCode(qrcode) {
        const resp = await net.request({
            url: {
                pathname: `/api/qrcode/${qrcode}`
            }
        });
        return resp.body;
    },
    async getCharpterByID(ChapterID) {
        const resp = await net.request({
            url: {
                pathname: `/api/chapter/${ChapterID}`
            }
        });
        return resp.body;
    }
}