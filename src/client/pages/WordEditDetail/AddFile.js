import * as React from 'react';
import { Form, Input ,Input, Button, Upload, Icon, message} from 'antd';
const FormItem = Form.Item;
 class AddFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            audioFileList: []
        }
    }

    handleExampleAudioChange = (info) =>{
        if (info.file.status === 'done') {
            console.log(info.file.status)
            const {handleExampleAudioChange, index} = this.props;
            handleExampleAudioChange(info , index);
        };
        this.setState({ audioFileList: [info.file]});      
    }
    handleExampleAudioRemove = (info) =>{
        const {handleExampleAudioRemove, index} = this.props;
        handleExampleAudioRemove(info , index);
        this.setState({ audioFileList: []});
    }
    componentDidMount() {
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.audioFileList.length && !prevState.audioFileList.length) {
            console.log('prevState',prevState.audioFileList.length)
            console.log('nextProps',nextProps.audioFileList.length)            
            return Object.assign({}, prevState, {audioFileList: nextProps.audioFileList});
        }
         return prevState;
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {index, updeExampleList, initialData,audioFileList,handleExampleAudioChange,handleExampleAudioRemove} = this.props;
        const {sentence, translation, audioURL} = initialData;
        
        return(
            <div className="ADD-File">
                <FormItem
                label="英文">
                {getFieldDecorator(`sentence${index}`, {
                  rules: [{ required: true, message: '请输入例句'}],
                  initialValue: sentence ? sentence : ''
                })(
                  <Input placeholder="请输入例句" style={{ width: '60%', marginRight: 8 }} />
                )}
                </FormItem>
                <FormItem
                label="翻译">
                  {getFieldDecorator(`translation${index}`, {
                  rules: [{ required: true, message: '请输入翻译'}],
                  initialValue: translation ? translation : ''
                })(
                  <Input placeholder="请输入中文翻译" style={{ width: '60%', marginRight: 8 }} />
                )}
                 </FormItem>
                  <FormItem
                    label="上传单词英式发音"
                        >
                            {getFieldDecorator(`audioURL${index}`, {
                                rules: [{ required: true, message: '请上传音频文件'}],
                                // getValueFromEvent: this.getValueFromEvent.bind(this,index)
                            })(
                                <Upload  
                                    action="/api/audios/Sentence" 
                                    listType="text"
                                    fileList = {this.state.audioFileList }
                                    showUploadList={true}
                                    onChange={this.handleExampleAudioChange}
                                    onRemove={this.handleExampleAudioRemove}
                                >
                                    <Button>
                                        <Icon type="upload" /> 点击上传音频
                                    </Button>
                                </Upload> 
                            )}
                 </FormItem>
            </div>
        )
    }
} 
const onValuesChange = (props, values) => {
    debugger
    const{updeExampleList, index} = props;
    updeExampleList(values, index)
 };
 const validateMessages = {
 }
export default  AddFile = Form.create({onValuesChange}, {validateMessages})(AddFile);