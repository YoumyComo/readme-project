import * as React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import {
  Form,
  Button,
  Icon,
} from 'antd';

interface Props extends FormComponentProps {
  name: string,
  renderItem: (name: string, remover: React.ReactNode) => React.ReactNode,
  label: string,
  initKeys?: number[],
}

interface State {

}

class IndexedElement extends React.Component<{}, {}> {
  render() {
    return this.props.children;
  }
}

export default class ArrayFields extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  get keyName() {
    const { name } = this.props;
    return `${name}Keys`;
  }

  getItemKey(k: number) {
    const { name } = this.props;
    return `${name}[${k}]`;
  }

  setKeys = (keys: number[]) => {
    this.props.form.setFieldsValue({
      [this.keyName]: keys,
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(this.keyName);
    const nextKeys = keys.concat(Date.now());
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      [this.keyName]: nextKeys,
    });
  }

  remove = (k: number) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(this.keyName) as number[];
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      [this.keyName]: keys.filter(key => key !== k),
    });
  }

  renderRemover(k: number, index: number) {
    if (index === 0) return null;
    return <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.remove(k)}/>
  }

  renderItems() {
    const { renderItem } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator(this.keyName, { initialValue: [] });
    const keys = getFieldValue(this.keyName) as number[];
    return keys.map((k, index) => {
      const elem = renderItem(this.getItemKey(k), this.renderRemover(k, index))
      return <IndexedElement key={k}>{elem}</IndexedElement>
    });
  }

  render() {
    return (
      <>
        {this.renderItems()}
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" />{this.props.label}
          </Button>
        </Form.Item>
      </>
    );
  }
}
