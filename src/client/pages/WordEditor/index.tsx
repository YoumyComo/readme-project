import * as React from 'react';
import {
  Form,
  Button,
} from 'antd';
import {
  BaseSelect,
} from './SelectFields';
import {
  BaseInput
} from './InputFields';
import {
  ImageUploader,
  AudioUploader,
} from './Uploader';
import WordService from '../../services/word';
import BookService from '../../services/book';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'react-router';
import ArrayFields from './ArrayFields';
export interface Props extends FormComponentProps, RouteComponentProps<{
  bookName: string,
  chapterName: string,
  spell?: string,
}> {

}

type Wordinfo = {
  word: string,
  imageURL: string,
  audioEngURL: string,
  audioAmeURL: string,
  phonetics: string,
  match: string,
  help: string,
  translation: string[],
  example: {
    audioURL: string,
    sentence: string,
    translation: string,
  }[],
}
export interface State {
  books: {[k: string]: string[]},
  chapters: string[],
  bookName: string,
  chapterName: string,
  word?: string,
  wordInfo?: Wordinfo,
}

class WordEditor extends React.Component<Props, State> {
  translations?: ArrayFields;
  examples?: ArrayFields;
  constructor(props: Props) {
    super(props);
    const { match } = props;
    const { bookName, chapterName, spell } = match.params;
    this.state = {
      books: {},
      chapters: [],
      bookName,
      chapterName,
      word: spell,
    };
  }

  get bookOptions() {
    const { books } = this.state;
    return Object.keys(books).map(book => ({ key: book, value: book }));
  }

  get charpterOptions() {
    const { chapters } = this.state;
    return chapters.map(c => ({ key: c, value: c}));
  }

  async componentDidMount() {
    const { word } = this.state;
    const books = await BookService.getBook();
    this.setState({
      books,
      chapters: books[this.state.bookName] || [],
    });

    if (word) {
      const wordInfo = await WordService.getWord(word) as Wordinfo;
      if (this.translations) {
        this.translations.setKeys(wordInfo.translation.map((_, i) => i));
      }
      if (this.examples) {
        this.examples.setKeys(wordInfo.translation.map((_, i) => i));
      }
      this.props.form.setFieldsValue(wordInfo);
    }
  }

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = this.props.form.getFieldsValue();
    console.log(value);
  }

  onBookChange = (book: string) => {
    const { books } = this.state;
    const chapters = books[book];
    this.setState({ chapters });
  }

  renderTranslation = (name: string, remover: React.ReactNode) => {
    const { form } = this.props;
    return <BaseInput form={form} name={name} label="" placeholder="请输入或删除翻译" required extra={remover}/>
  }

  renderExamples = (name: string, remover: React.ReactNode) => {
    const { form } = this.props;
    return (
      <>
        <BaseInput form={form} name={`${name}.sentence`} label="例句" placeholder="请输入例句" required />
        <BaseInput form={form} name={`${name}.translation`} label="例句翻译" placeholder="请输入例句翻译" required/>
        <AudioUploader form={form} name={`${name}.audioURL`} placeholder="请上传例句发音" label="例句"/>
        {remover}
      </>
    );
  }


  render() {
    const { form } = this.props;
    const { bookName, chapterName, } = this.state;

    return (
      <Form onSubmit={this.onSubmit}>
        <BaseSelect form={form} name="selectedBook" label="书籍" placeholder="请选择单词所在书籍" options={this.bookOptions} initialValue={bookName} onChange={this.onBookChange}/>
        <BaseSelect form={form} name="selectedCharpter" label="章节" placeholder="请选择单词所在章节" options={this.charpterOptions} initialValue={chapterName}/>
        <BaseInput form={form} name="word" placeholder="请输入单词" required label="单词"/>
        <BaseInput form={form} name="phonetics" placeholder="请输入音标" required label="音标"/>
        <ImageUploader form={form} name="imageURL" placeholder="请上传图片" label="图片"/>
        <AudioUploader form={form} name="audioEngURL" placeholder="请上传单词英式发音" label="英式发音"/>
        <AudioUploader form={form} name="audioAmeURL" placeholder="请上传单词美式发音" label="美式发音"/>
        <BaseInput form={form} name="help" placeholder="请输入助词" label="助词"/>
        <BaseInput form={form} name="match" placeholder="请输入搭配" label="搭配"/>
        <BaseInput form={form} name="analysis" placeholder="请输入辨析" label="辨析"/>
        <ArrayFields ref={(_: ArrayFields) => this.translations = _}form={form} name="translation" renderItem={this.renderTranslation} label="添加翻译" />
        <ArrayFields ref={(_: ArrayFields) => this.examples = _} form={form} name="example" renderItem={this.renderExamples} label="添加例句"/>
        <Form.Item>
          <Button type="primary" htmlType="submit">提交数据</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(WordEditor);
