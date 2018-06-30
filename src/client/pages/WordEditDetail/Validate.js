export default (key) => {
    switch(key)
    {
    case 'word':
    case 'selectedBook':
    case 'selectedChapter':
    case 'phonetics':
    case 'match':
    case 'help':
    case 'analysis':
    case 'imageURL':
    case 'audioAmeURL':
    case 'audioEngURL':
        await this.setState({[key]: item[key]})
        break;
    case 'example':
    case 'translation':
    case 'audioEngUpload':
    case 'audioTranslationUpload':
    default:break 
    }
}