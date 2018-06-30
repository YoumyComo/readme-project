import * as React from 'react';
import {WordFormContext} from '../../components/Context';
import BookService from '../../services/book';
import AudioService from '../../services/book';

import AddFile from './AddFile';
import '@client/styles/business.scss';

import {  Layout, Breadcrumb,Form, Select, Input, Button, Upload, Icon, message  } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
let uuid = {example:0, translation:0 };

class initForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageURL: null,
            exampleList: [],
            exampleAudioFileList: [],
            loading: false,
            audioEngFileList: [],
            audioAmeFileList: [],
            allExampleAudioFileList:[]
        }
    }
    getPictureValueFromEvent = (event) => {
        if (event.file.status === 'uploading') {
            return null;
        }
        if (event.file.status === 'done') {
        // Get this url from response in real world.   
        const {url} = event.file.response;
        this.setState({ loading: false, imageURL: url});
        return url;
        }
       
    }
    valitePictureFile = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
          message.error('你只能上传 JPG 文件!');
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片大小必须小于 2MB!');
          return false;
        }
        return true;
    }

    // 处理 英式发音上传 操作   
    handleEngAudioChange = (info,e) => {
        debugger
        if (info.file.status === 'done') {
          // 先判断  fileList中是否已经包含文件，如果包含了将该文件在本地的存储删除，然后将更新FileList
          this.props.handleItemChange({'audioEngURL':info.file.response.url});
          this.props.form.setFieldsValue({'audioEngUpload': info.file.response.url});
        }
        this.setState({ audioEngFileList: [info.file] });
    }
    handleEngAudioRemove = (info) => {
        this.setState({ audioEngFileList: [] });
        this.props.handleItemChange({'audioEngURL':''});
        this.props.form.setFieldsValue({'audioEngUpload': ''});  
    }
    // 处理 美式发音上传 操作         
    handleAmeAudioChange = (info) => {
        if (info.file.status === 'done') {
          this.props.handleItemChange({'audioAmeURL':info.file.response.url});
          this.props.form.setFieldsValue({'audiAmeUpload': info.file.response.url});
          
    }
        this.setState({ audioAmeFileList: [info.file] });
    }
    handleAmeAudioRemove = (info) => {
        this.setState({ audioAmeFileList: [] });
        this.props.handleItemChange({'audioAmeURL':''});
        this.props.form.setFieldsValue({'audiAmeUpload': ''});
        
    }
   // 处理 example 动态添加文件中的 发音列表
    handleExampleAudioChange = (info , index)=> {
        let {exampleAudioFileList, exampleList} = this.state;
            exampleAudioFileList[index] = [info.file]; // 因为只需要一个 mp3文件，所以每次都在第一个位置上修改            
            exampleList[index] = Object.assign({}, exampleList[index] , {'audioURL':info.file.response.url});
            this.setState({exampleAudioFileList, exampleList});
            this.props.updateExampleStore(exampleList[index], index)
    }
    handleExampleAudioRemove = (info , index) => {
        let {exampleAudioFileList, exampleList, allExampleAudioFileList} = this.state;
        exampleAudioFileList[index] = [];    
        exampleList[index] = {'audioURL':''};
        allExampleAudioFileList[index] = [];
        Object.assign(exampleList[index], {audioURL:''})
        this.setState({exampleAudioFileList, exampleList,allExampleAudioFileList});

    }
     valiteAudioFile = (file) => {
        const isJPG = file.type === 'audio/mp3';
        if (!isJPG) {
          message.error('你只能上传 MP3 文件!');
          return false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          message.error('MP3大小必须小于 10MB!');
          return false;
        }
        return true;
    }
    // 动态表单添 加和删除  操作  
    remove = (keyName, k) => {

        const { form } = this.props;     
        const keys = form.getFieldValue(keyName);
        const detailLists = form.getFieldValue(`${keyName}DatailList`)
        form.setFieldsValue({
            [keyName]: keys.filter(key => key !== k),
        });
      }
    
    add = (e) => {
        const keyName = e.target.attributes.keyname.value;
        const { form } = this.props;
        const keys = form.getFieldValue(keyName);
        const nextKeys = keys.concat(uuid[keyName]);
        uuid[keyName]++;
        form.setFieldsValue({
            [keyName]: nextKeys,
        });
      }
    updeExampleList = async(value, index)=> {

        const {exampleList} = this.state;
        const keyIndex = Object.keys(value)[0];
        
        const key = keyIndex.substring(0,keyIndex.indexOf(index.toString()));
        if( key == 'audioURL' ) return; // audioURL 在updateExampleAudioFileList函数里单独处理
        if(exampleList[index]) {
            exampleList[index][key] = value[keyIndex];
        }else{
            exampleList[index] = {};
            exampleList[index][key] = value[keyIndex];
        }
        await this.setState({exampleList})
        this.props.updateExampleStore(exampleList[index], index)

    }


    async componentDidMount() {
        const {translation, example, form, word,help, match, analysis,imageURL,audioEngURL,audioAmeURL} = this.props;
        // translation初始化默认值  
        if(imageURL){
            this.setState({imageURL}),
            form.setFieldsValue({'imageURL': imageURL})
        }
        if(audioEngURL) {
            const audioEngName = audioEngURL.substr(audioEngURL.lastIndexOf('/')+1);
            form.setFieldsValue({'audioEngURL': audioEngURL});
            this.setState({audioEngFileList:[{name:audioEngName, uid:audioEngName}]})
        }
        if(audioAmeURL) {
            const audioAmeName = audioAmeURL.substr(audioAmeURL.lastIndexOf('/')+1);
            form.setFieldsValue({'audioAmeURL': audioAmeURL})
            this.setState({audioAmeFileList:[{name:audioAmeName, uid:audioAmeName}]})
        } 
        if(translation) {
            const initTranslation = translation.map((i, index) => index)
            await form.setFieldsValue({
                translation: initTranslation,
            });
            uuid.translation = translation.length;
        }
        // example初始化默认值
        if(example) {
            // 将已有的也存储下来
            const initExample = example.map((i, index) => index)
            const allExampleAudioFileList = example.map((item, index) => {
                  const {audioURL} = item;
                  const audioName = audioURL.substr(audioURL.lastIndexOf('/')+1);
                  return ([{name:audioName, uid:audioName}])
            })
            await form.setFieldsValue({
                example: initExample,
             });
             uuid.example = example.length;
             this.setState({allExampleAudioFileList})
        }
        // 给fileValue-imageUpload赋值，避免提交时出现错误
      
        this.props.form.setFieldsValue({ word, help, match, analysis})
    }

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const {word,
               translation,
               phonetics, 
               example, 
               help, 
               match, 
               analysis,
               audioEngURL, 
               audioAmeURL, 
               redirectLink,
               bookLists,
               selectedBook, 
               selectedChapter, 
               renderChapterList,
               handleBookSelectChange,
               handlerSubmit} = this.props; 
        const {imageURL} = this.state;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
          };
        const addItemLayout = {
                labelCol: {
                xs: { span: 4 },
                sm: { span: 2 },
                },
                wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
                },
            };
        const formItemLayoutWithOutLabel = {
                wrapperCol: {
                    xs: { span: 24 , offset: 2},
                    sm: { span: 20 , offset: 2},
                },
        };
        getFieldDecorator('example', { initialValue: [] });
        const examKeys = getFieldValue('example');
        const exampleFormItems = examKeys.map((k, index) => {
            return (
                <FormItem
                {...(index === 0 ? addItemLayout : addItemLayout)}
                label='例句'
                required={false}
                key={k}
                className="add-file-wrapper ADD-File-WRAPPER"
                >
                {/* {getFieldDecorator(`exampleDatailList[${k}]`, {
                    rules: [{
                    // required: true,
                    validator: (rule, value, cb) => 
                       {
                        console.log(value)
                        debugger
                        cb(false)
                       }
                    ,
                    whitespace: true,
                    message: "请输入或删除例句.",
                    }],
                    
                })(
                    <AddFile 
                        index = {k} 
                        updeExampleList={this.updeExampleList} 
                        initialData={ example[k] || {} } 
                        audioFileList = {this.state.allExampleAudioFileList[k] || []}  
                        handleExampleAudioChange={this.handleExampleAudioChange}
                        handleExampleAudioRemove = {this.handleExampleAudioRemove}
                    />
                )} */}
                    <AddFile 
                        index = {k} 
                        updeExampleList={this.updeExampleList} 
                        initialData={ example[k] || {} } 
                        audioFileList = {this.state.allExampleAudioFileList[k] || []}  
                        handleExampleAudioChange={this.handleExampleAudioChange}
                        handleExampleAudioRemove = {this.handleExampleAudioRemove}
                    />
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove('example',k)}
                    />          
                </FormItem>
            );
        });
        getFieldDecorator('translation', {
                                         initialValue: translation,
                                         rules: [{ required: true}]});
        const wordTranslation = getFieldValue('translation');
        const translationFormItems = wordTranslation.map((k, index) => {
        return (
            <FormItem
            {...(index === 0 ? addItemLayout : addItemLayout)}
            label='翻译'
            required={false}
            key={k}
            className="add-file-wrapper"
            >
            {getFieldDecorator(`translationDatailList[${k}]`, {
                rules: [{
                required: true,
                message: "请输入或删除例句.",
                }],
                initialValue:(translation[k] || null)
            })(
                <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />
            )}
            
                <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove('translation',k)}
                />
            
            </FormItem>
        );
        });
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
          </div>
          );
        
        return (
                <Form onSubmit = {handlerSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="书籍"
                        >
                        {getFieldDecorator('selectedBook', {
                            rules: [{ required: true, message: '请选择单词所在书籍'}],
                            initialValue: selectedBook
                        })(
                            <Select
                            placeholder="请选择单词所在书籍"                      
                            onChange={handleBookSelectChange}
                            >
                                {Object.keys(bookLists || {}).map(book =><Option value={book} key={book} >{book}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                    label="单元"
                    {...formItemLayout}
                    >
                        {getFieldDecorator('selectedChapter', {
                            rules: [{ required: true, message: '请选择单词所在单元'}],
                            initialValue: selectedChapter  
                        })(
                            <Select
                            placeholder="请选择单词所在单元"
                            >                            
                            {renderChapterList.map((chapter) =>  <Option value={chapter} key={chapter}>{chapter}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                    label="单词"
                    {...formItemLayout}
                    >
                        {getFieldDecorator('word', {
                            rules: [{ required: true, message: '请输入单词!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                    label="音标"
                    {...formItemLayout}
                    >
                        {getFieldDecorator('phonetics', {
                            rules: [{ required: true, message: '请输入音标!' }],
                            initialValue: phonetics
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传图片"
                        >    {getFieldDecorator('imageURL', {
                                rules: [{ required: true, message: '请上传图片'}],
                                valuePropName: 'ImgFileList',
                                getValueFromEvent: this.getPictureValueFromEvent.bind(this),
                            })(
                                // options.getValueFromEvent	可以把 onChange 的参数（如 event）转化为控件的值
                                // options.valuePropName	子节点的值的属性，如 Switch 的是 'checked'
                                <Upload
                                    className="avatar-uploader"
                                    listType="picture-card"
                                    showUploadList={false}
                                    action= {`/api/images`}
                                    beforeUpload={this.valitePictureFile}
                                    // onChange={this.handlePictureChange}
                                >
                                    {imageURL ? <><img src={imageURL} alt="picture"  style={{maxHeight: '200px'}}/><span style={{color: 'red'}}>点击图片可更改文件</span></> : uploadButton}
                            </Upload>
                        )}
                           
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传单词英式发音"
                        >
                            {getFieldDecorator('audioEngURL', {
                                rules: [{ required: true, message: '请上传英式发音'}],
                                valuePropName: 'EngAudioFileList',

                            })(
                                <Upload  
                                    action="/api/audios/ENG" 
                                    listType="text"
                                    fileList={this.state.audioEngFileList}
                                    showUploadList={true}
                                    beforeUpload={this.valiteAudioFile}
                                    onChange={this.handleEngAudioChange}
                                    onRemove={this.handleEngAudioRemove}
                                >
                                    <Button>
                                        <Icon type="upload" /> 点击上传音频
                                    </Button>
                                </Upload> 
                            )}
                           
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传单词美式发音"
                        >
                            {getFieldDecorator('audioAmeURL', {
                                rules: [{ required: true, message: '请上传美式发音'}],                                
                                valuePropName: 'AmeAudioFileList',
                                getValueFromEvent: this.normFile,
                            })(
                                <Upload 
                                    action="/api/audios/AME"  
                                    fileList={this.state.audioAmeFileList}
                                    showUploadList={true}
                                    beforeUpload={this.valiteAudioFile}
                                    onChange={this.handleAmeAudioChange}
                                    onRemove={this.handleAmeAudioRemove}
                                >
                                    <Button>
                                        <Icon type="upload" /> 点击上传音频
                                    </Button>
                                </Upload>
                            )} 
                          
                    </FormItem>
                    <FormItem
                    label="助词"
                    {...formItemLayout}
                    >
                       {getFieldDecorator('help', {
                            rules: [{  message: '请输入助词!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                    label="搭配"
                    {...formItemLayout}
                    >
                       {getFieldDecorator('match', {
                            rules: [{  message: '请输入搭配!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                    label="辨析"
                    {...formItemLayout}
                    >
                       {getFieldDecorator('analysis', {
                            rules: [{  message: '请输入辨析!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayoutWithOutLabel} >
                        {translationFormItems}
                        <Button type="dashed" onClick={this.add} style={{ width: '80%' }} keyname = 'translation'>
                            <Icon type="plus" />添加翻译
                        </Button>
                    </FormItem>
                    <FormItem {...formItemLayoutWithOutLabel} >
                        {exampleFormItems}
                        <Button type="dashed" onClick={this.add}  style={{ width: '80%' }} keyname = 'example'>
                            <Icon type="plus" />添加例句
                        </Button>
                    </FormItem>
                    <FormItem {...formItemLayoutWithOutLabel} >
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                        提交数据
                        </Button>
                    </FormItem>
                    
                </Form>
        )   
    }
}

const onValuesChange = (props, values) => {
   props.handleItemChange(values)
};
const onFieldsChange = (props, values) => {
 
 };
export default  initForm = Form.create({ onValuesChange, onFieldsChange})(initForm);


