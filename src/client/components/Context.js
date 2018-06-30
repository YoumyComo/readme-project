import * as React from 'react';
export const BookContext = React.createContext({
    books: null,
    updateBooks: () => {},
});
export const WordFormContext = React.createContext({
    word: null,
    audio: {
        Eng: '',
        Ame: ''
    },
    image: '',
    translation: '',
    example: [],
    match: '',
    help: '',
    redirectLink: '',
    onSubmitHandler: () => {},
    updateItem: () => {}
  });
