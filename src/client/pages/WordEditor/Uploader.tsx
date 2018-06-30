import * as React from 'react';
import { Upload, message, Button, Icon, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';

interface Props extends FormComponentProps {
  name: string,
  label: string,
  placeholder: string,
  extra?: React.ReactNode,
}

export class ImageUploader extends React.Component<Props, { loading: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { loading: false };
  }

  valiteImageFile = (file: RcFile) => {
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

  transform = (event: UploadChangeParam) => {
    let url = undefined;
    switch (event.file.status) {
      case 'uploading':
        this.setState({ loading: true });
        break;
      case 'done':
        url = event.file.response.url;
        this.setState({ loading: false });
        break;
      case 'error':
        this.setState({ loading: false });
        break;
      case 'removed':
        url = undefined;
        this.setState({ loading: false });
    }
    return url;
  }

  renderButton() {
    const { form, name } = this.props;
    const url = form.getFieldValue(name);
    const { loading } = this.state;
    if (url) {
      return (
        <>
          <img src={url} alt="picture"  style={{maxHeight: '200px'}}/>
          <span style={{color: 'red'}}>点击图片可更改文件</span>
        </>
      );
    } else {
      return <Button><Icon type={loading ? 'loading' : 'plus'}/>点击上传图片</Button>;
    }
  }

  render() {
    const { form, name, label, placeholder } = this.props;
    const elem = form.getFieldDecorator(name, {
      rules: [{ required: true, message: placeholder}],
      getValueFromEvent: this.transform,
    })(
      <Upload
        action={'/api/images'}
        beforeUpload={this.valiteImageFile}
      >
        {this.renderButton()}
      </Upload>
    );
    return <Form.Item label={label}>{elem}</Form.Item>
  }
}

export class AudioUploader extends React.PureComponent<Props, { loading: boolean }> {
  valiteAudioFile = (file: RcFile) => {
    const isMp3 = file.type === 'audio/mp3';
    if (!isMp3) {
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

  transform = (event: UploadChangeParam) => {
    let url = undefined;
    switch (event.file.status) {
      case 'uploading':
        this.setState({ loading: true });
        break;
      case 'done':
        url = event.file.response.url;
        this.setState({ loading: false });
        break;
      case 'error':
        this.setState({ loading: false });
        break;
      case 'removed':
        url = undefined;
        this.setState({ loading: false });
    }
    return url;
  }

  render() {
    const { form, label, extra, name} = this.props;
    const elem = form.getFieldDecorator(name, {
      rules: [{ required: true, message: label}],
      getValueFromEvent: this.transform,
    })(
      <Upload
        action={'/api/images'}
        beforeUpload={this.valiteAudioFile}
      >
        <Button><Icon type="upload"/>点击上传音频</Button>
      </Upload>
    );
    return <Form.Item label={label}><>{elem}{extra}</></Form.Item>
  }
}
