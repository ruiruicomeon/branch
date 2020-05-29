import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button , Tree, Card } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank ,getLocation} from '@/utils/utils';
// import Moment from 'moment
const { TreeNode } = Tree;
const FormItem = Form.Item;

@connect(({ loading, sysrole }) => ({
  ...sysrole,
  submitting: loading.effects['sysrole/add'],
  // formData: sysrole.formData.role,
  officeList: sysrole.formData.officeList,
  menuList: sysrole.formData.menuList,
  dictsData: sysrole.dicts,
}))
@Form.create()
class SysRoleFrom extends PureComponent {
  constructor(props) {
    super(props);
    // if (props.location.data != null && typeof props.location.data !== 'undefined') {
    //   this.state.data = props.location.data;
    // }
    this.state = {
      // data: {},
      checkedKeys: [],
      defaultExpandAll: true,
      location: getLocation(),
    };
  }

  // state = {
  //   data: {},
  //   checkedKeys: [],
  //   defaultExpandAll: true,
  // };

  componentDidMount() {
    const { dispatch } = this.props;
    const {location} = this.state
    // form.resetFields();
    dispatch({
      type: 'sysrole/form_data'
    });

    if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
      dispatch({
        type: 'sysrole/form_data',
        payload: { id: location.query.id },
        callback: response => {
          // if (
          //   response != null &&
          //   response !== 'undefined' &&
          //   response.data != null &&
          //   response.data !== 'undefined' &&
          //   response.data.role != null &&
          //   response.data.role !== 'undefined' &&
          //   response.data.role.menuIdList != null &&
          //   response.data.role.menuIdList !== 'undefined' &&
          //   response.data.role.menuIdList.length > 0
          // ) {
          // this.state.checkedKeys=response.data.role.menuIdList;
          this.setState({
            checkedKeys: response.data.role.menuIdList,
          });
          // }
        },
      });
    }
  }

       // 关闭页面清除数据
       componentWillUnmount() {
        const { dispatch, form } = this.props;
        form.resetFields();
        dispatch({
          type: 'sysrole/clear',
        });
      }
  

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  handleSubmit = e => {
    const {form,dispatch} = this.props
    const {location,checkedKeys} = this.state
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = { ...values,id: location.query.id};
        // const addfileList={...this.state.addfileList}
        const { formData } = this.props;
        let oldName = '';
        if (isNotBlank(formData)&&isNotBlank(formData.role.name)
        ) {
          oldName = formData.role.name;
        }
        value.oldName = oldName;
        let oldEnname = '';
        if (
          isNotBlank(formData)&&isNotBlank(formData.role.enname)
        ) {
          oldEnname = formData.role.enname;
        }
        value.oldEnname = oldEnname;

        value.menuIds = checkedKeys;

        dispatch({
          type: 'sysrole/add_role',
          payload: value,
          callback: () => {
            setTimeout(
              this.setState(() => {
                // this.props.form.resetFields();
                return {
                  location: {},
                  checkedKeys: [],
                };
              }),
              2000
            );
            dispatch(routerRedux.push('/system/role_list'));
          },
        });
        // 清除from数据
      }
    });
  };

  renderTreeNodes = data => (
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} />;
    })
  );

  render() {
    const { submitting, dispatch, formData, menuList ,form} = this.props;
    const { getFieldDecorator } = form;
    const { checkedKeys ,defaultExpandAll} = this.state;


    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const onCancelCancel = () => {
      dispatch(routerRedux.push('/system/role_list'));
    };


    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>

            <FormItem {...formItemLayout} label="角色名称">
              {getFieldDecorator('name', {
                initialValue:isNotBlank(formData)&&isNotBlank(formData.role)&&isNotBlank(formData.role.name)? formData.role.name: '',
                // 必填字段输入提示
                rules: [
                  {
                    required: true,
                    message: '角色名称',
                  },
                ],
              })(<Input placeholder="角色名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="英文名称">
              {getFieldDecorator('enname', {
                initialValue:isNotBlank(formData)&&isNotBlank(formData.role)&&isNotBlank(formData.role.enname)? formData.role.enname: '',
                // 必填字段输入提示
                rules: [
                  {
                    required: true,
                    message: '英文名称',
                  },
                ],
              })(<Input placeholder="英文名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="角色授权">
              {getFieldDecorator('menuIds', {
                initialValue:isNotBlank(formData)&&isNotBlank(formData.role)&&isNotBlank(formData.role.menuIds)? formData.menuIds: '',
              })(
                <Tree
                  checkable
                  defaultExpandAll={defaultExpandAll}
                  onCheck={this.onCheck}
                  checkedKeys={checkedKeys}
                >
                  {this.renderTreeNodes(
                    isNotBlank(menuList)? menuList: []
                  )}
                </Tree>
              )}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button onClick={onCancelCancel} style={{ marginLeft: 8 }}>
                取消{' '}
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default SysRoleFrom;
