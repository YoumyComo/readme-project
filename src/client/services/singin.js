import Net from '../lib/Net';
const net = new Net([]);

export default {
    async signin(username, password) {
        const resp = await net.request({
            method: 'POST',
            json: false,
            url: {
                pathname:  `/api/signin`
            },
            body: {
                username: username,
                password: password
            }
        });
        
    }
}