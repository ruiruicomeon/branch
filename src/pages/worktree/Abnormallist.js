import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Modal,
  Upload,
  Icon,
  Select,
  Cascader,
  Popconfirm
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank } from '@/utils/utils';
import { stringify } from 'qs';
import { getStorage } from '@/utils/localStorageUtils';
import { RenderModel } from "./Warning";
const FormItem = Form.Item;
const { Option } = Select;
// const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');



@connect(({ dictionaryL, loading, sysdeptList, sysoffice, warning, sysuser }) => ({
    ...dictionaryL,
    sysdeptList,
    sysoffice,
    ...sysuser,
    ...warning,
    loading:loading.models.warning ,
    userloading: loading.models.sysuser,
    submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class SysUserList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    modalImportVisible: false,
    importFileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
        type:"warning/fetch",
        payload:{ 
          current: 1,
          pageSize: 10   },
          callbback:data=>{
            this.setState({
              Graydata:data
            })
          }
      })
      dispatch({
        //责任部门
        type: 'dictionaryL/fetch',
        payload: { type: 'duty' },
    });
    dispatch({
        // 原因分类
        type: 'dictionaryL/fetch',
        payload: {
            type: 'failure',
        },
        callback: data => {
            this.setState({
                departmentFailure: data,
            });
        },
    });
    dispatch({
        //车间
        type: 'sysoffice/fetch',
    });
    dispatch({
        // 品类管理
        type: 'sysdeptList/list',
    });
    dispatch({
        // 用户选择
        type: 'sysuser/fetch',
        callback: data => {
            this.setState({
                tableData: data,
            });
        },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'sysuser/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sysuser/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  removeClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'sysuser/remove',
      payload: {
        id: selectedRows.map(row => row.id).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'sysuser/fetch',
        });
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        current: 1,
        pageSize: 10,
      };
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.no)) {
        values.no = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.name)) {
        values.name = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.office.id)) {
        values.office.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.area.id)) {
        values.area.id = '';
      }
      if (isNotBlank(fieldsValue) && !isNotBlank(fieldsValue.dept)) {
        values.dept = '';
      } else {
        values.dept = values.dept[values.dept.length - 1];
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sysuser/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm = () => {
    const { levellist, levellist2, newdeptlist, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('no')(<Input placeholder="请输入编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属大区">
              {getFieldDecorator('area.id', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} placeholder="请选择所属大区" allowClear>
                  {isNotBlank(levellist) &&
                    isNotBlank(levellist.list) &&
                    levellist.list.length > 0 &&
                    levellist.list.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="所属分公司">
              {getFieldDecorator('office.id', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} placeholder="请选择所属分公司" allowClear>
                  {isNotBlank(levellist2) &&
                    isNotBlank(levellist2.list) &&
                    levellist2.list.length > 0 &&
                    levellist2.list.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属部门">
              {getFieldDecorator('dept', {
                initialValue: '',
              })(
                <Cascader
                  options={newdeptlist}
                  placeholder="请选择所属部门"
                  style={{ width: '100%' }}
                  allowClear
                  fieldNames={{ label: 'name', value: 'id' }}
                />
              )}
            </FormItem>
          </Col>
          <div>
            <span style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </div>
        </Row>
      </Form>
    );
  };

  renderForm = () => {
    return this.renderSimpleForm();
  };

  handleImportVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  UploadFileVisible = flag => {
    this.setState({
      modalImportVisible: !!flag,
      importFileList: [],
    });
  };

  handleFileList = fileData => {
    this.setState({
      importFileList: fileData,
    });
  };

  handleUpldExportClick = type => {
    const userid = { id: getStorage('userid'), isTemplate: type };
    window.open(`/api/Api/sys/user/export?${stringify(userid)}`);
  };

  handleModalChange = record => {
    if (isNotBlank(record) && isNotBlank(record.id)) {
      router.push(`/basic/sys-user/form?id=${record.id}`);
    }
  };
  handleRemoveAbnormalist=id=>{  // 删除异常订单
    const { dispatch  } = this.props
    dispatch({
        type:"warning/delectwarningone",
        payload:{ id },
        callback:()=>{
            dispatch({
            type:"warning/fetch",
            payload:{ 
                current: 1,
                pageSize: 10 },
            })
        }
    }) 
  }

  render() {
   
    const { selectedRows, importFileList, modalImportVisible } = this.state;
  
    const {
        submitting,
        cpAssemblyFormGet,
        sysdeptList,
        departmentList,
        Graydata,
        officeList,
        loading,
        sysoffice: { data },
    } = this.props;
    const dataTree = data.list; // 车间
    const sysdeptdataTree = sysdeptList.data.list; // 品类

    const filtername=(listdata,ids)=>{
        let filterlist = []
         for(let i=0;i<ids.length;i++){
            filterlist= listdata.filter(item=>{
                 if(item.id == ids[i]){
                    return item.name
                 }
             })
         }
         return filterlist;
    }

    const columns = [
      {
        title: '订单自编号',
        dataIndex: 'orderSelfNum',
        width: 150,
        render: (text, record) => <a onClick={() => this.handleModalChange(record)}>{text}</a>,
      },
      {
        title: '是否关注',
        dataIndex: 'category',
        width: 150,
        render: text => {
          if (isNotBlank(text)) {
             return <span>{ text }</span>
          }
          return '';
        },
      },
      {
        title: '二级品类',
        dataIndex: 'workshop',
        width: 150,
        render:text=>{
            return  text
        }
      },
      
      {
        title: '是否异常',
        dataIndex: 'exceptionInfo',
        width: 150,
      },
      {
        title:"异常登记",
        dataIndex:"estiCompTime",
        width:150,
        render:text=>{
            return  text
        }
      },
      {
        title: '责任人',
        dataIndex: 'respUser',
        width: 150,
        render:(text,record)=>{
           if(isNotBlank(text) && isNotBlank(this.state.tableData) && isNotBlank(this.state.tableData.list)){
               let respuserlist = text.split(",")
        //    return   filtername(this.state.tableData.list, respuserlist )  
             
           } else{
               return ""
           }
        }
      },
      {
        title: '操作',
        width: 150,
        render: record => {
          return (
            <Fragment>
            <Link
            to={`/worktree/abnormal?id=${record.id}`}
            >
            修改
          </Link>
          <Popconfirm
            placement="rightTop"
            title="确定删除这条异常记录吗？"
            onConfirm={()=>{ this.handleRemoveAbnormalist(record.id) } }
            okText="确定"
            cancelText="取消"
        >
            <a style={{marginLeft:10}}>删除异常订单</a>
        </Popconfirm>
          </Fragment>
          )
        }
         
      },
    ];

    const onValidateForm = () => {
      router.push(``);
    };

    const parentImportMethods = {
      UploadFileVisible: this.UploadFileVisible,
      handleImportVisible: this.handleImportVisible,
      fileL: importFileList,
      handleFileList: this.handleFileList,
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.tableListOperator}>
        </div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>  
            </div>  
            <StandardTable
              bordered
              scroll={{ x: 1050 }}
              selectedRows={selectedRows}
              loading={loading}
              data={Graydata }
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <RenderModel {...parentImportMethods} modalImportVisible={modalImportVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default SysUserList;
