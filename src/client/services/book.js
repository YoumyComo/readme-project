import Net from '../lib/Net';
const net = new Net([]);

export default {
    async getBook(spell) {
        const resp = await net.request({
            url: {
                pathname: `/api/books`
            }
        });
        return resp.body;
    },

    async getChapterBybookName(bookName) {
        const resp = await net.request({
            url: {
                pathname: `/api/books/${bookName}`
            }
        });
        return resp.body;
    },

   async getInfoByBookNameAndChapterName(bookName,chapterName) {
        const resp = await net.request({
            url: {
                pathname: `/api/books/${bookName}/${chapterName}`
            }
        });
        return resp.body;
    },   

    async createBook(bookName) {
        const resp = await net.request({
            json: false,
            method: 'POST',
            url: {
                pathname: `/api/books/${bookName}`,
 
            }
        });
        
    },

    async createChapter(currentBook,chapterName) {
        const resp = await net.request({
            json: false,
            method: 'POST',
            url: {
                pathname: `/api/books/${currentBook}/${chapterName}`,
 
            },
            body: {
                    "words": [],
                    "qrcode":  `${Date.now()}`
            }
        });
        
    },

    async removeBook(bookName) {
        const resp = await net.request({
            json: false,
            method: 'DELETE',
            url: {
                pathname: `/api/books/${bookName}`,
 
            }
        });
    },

    async removeChapter(currentBook,chapterName)  {
        const resp = await net.request({
            json: false,
            method: 'DELETE',
            url: {
                pathname: `/api/books/${currentBook}/${chapterName}`,
 
            }
        });
    },

    async removeWord(currentBook, chapterName, word)  {
        const resp = await net.request({
            json: false,
            method: 'DELETE',
            url: {
                pathname: `/api/books/${currentBook}/${chapterName}/${word}`,
 
            }
        });
    }
}