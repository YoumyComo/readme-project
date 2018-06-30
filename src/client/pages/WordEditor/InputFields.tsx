import * as React from 'react';
import { Input, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

interface Props extends FormComponentProps {
  name: string,
  placeholder: string,
  required?: boolean,
  label: string,
  extra?: React.ReactNode
}

export class BaseInput extends React.PureComponent<Props> {
  render() {
    const { form, name, placeholder, required, label, extra } = this.props;
    const elem = form.getFieldDecorator(name, {
      rules: [{ required: !!required, message: placeholder}],
    })(
      <Input placeholder={placeholder}/>
    );
    return <Form.Item label={label}><>{elem}{extra}</></Form.Item>
  }
}
