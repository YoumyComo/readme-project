import * as React from 'react';
import { Select, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { SelectValue } from 'antd/lib/select';

interface Props extends FormComponentProps {
  name: string,
  label: string,
  options: {
    key: string,
    value: string,
  }[],
  initialValue?: string,
  placeholder: string,
  onChange?: (v: string) => void,
}

export class BaseSelect extends React.PureComponent<Props> {
  render() {
    const { form, name, label, options, initialValue, onChange, placeholder } = this.props;
    const elem = form.getFieldDecorator(name, {
      rules: [{ required: true, message: placeholder}],
      initialValue,
    })(
      <Select placeholder={placeholder} onChange={(v: SelectValue) => onChange && onChange(v as string)}>
        {options.map(option => <Select.Option key={option.value} value={option.value}>{option.key}</Select.Option>)}
      </Select>
    );

    return <Form.Item label={label}>{elem}</Form.Item>
  }
}
