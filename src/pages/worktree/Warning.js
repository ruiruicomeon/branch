/**
 * 异常预警首页
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Input, Form, Card, Icon, Row, Col, DatePicker, message, Modal, Empty, Switch, Select, Spin } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import WorningListComponent from './Component/worningListComponent';
import { isNotBlank, deepCopy, proccessObject, deleteCookie, getCookieFrom } from '@/utils/utils';
import { getStorage, setStorage } from '@/utils/localStorageUtils';
import { homeUrl } from '../../../config/baseConfig';
import styles from './warning.less';
import moment from 'moment';
import { stringify, parse } from 'qs';
const { confirm } = Modal;
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
export const RenderModel = Form.create()(props => {
   const {
      form: { getFieldDecorator },
      form,
      previewVisible,
      handleCancel,
      handleSubmit,
   } = props;

   const ResetForm = () => {
      form.resetFields();
   };
   const inquire = () => {
      // 查询按钮
      form.validateFields((error, fieldsValue) => {
         if (!error) {
            handleSubmit(fieldsValue);
         }
      });
   };

   return (
      <Modal
         width={1000}
         visible={previewVisible}
         closeIcon={<Icon type="close" onClick={() => handleCancel()} />}
         footer={
            <>
               <Button type="primary" onClick={inquire}>
                  查询
               </Button>
               <Button type="primary" onClick={ResetForm}>
                  重置
               </Button>
               <Button onClick={() => handleCancel()}>取消</Button>
            </>
         }
      >
         <Row>
            <Col span={12}>
               <FormItem label="基地" labelcol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('siteName', {
                     initialValue: '',
                  })(<Input placeholder="请输入基地" />)}
               </FormItem>
            </Col>
            <Col span={12}>
               <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车间">
                  {form.getFieldDecorator('ScheduleBeginDate', {
                     initialValue: '',
                  })(<RangePicker />)}
               </FormItem>
            </Col>

            <Col span={12}>
               <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车间">
                  {form.getFieldDecorator('deptName', {
                     initialValue: '',
                  })(<Input placeholder="请输入车间" />)}
               </FormItem>
            </Col>
            <Col span={12}>
               <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="一级排产时间">
                  {getFieldDecorator('schedulingtime', {
                     initialValue: '',
                  })(<RangePicker style={{ width: '100%' }} />)}
               </FormItem>
            </Col>
            <Col span={12}>
               <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="品类">
                  {form.getFieldDecorator('buName', {
                     initialValue: '',
                  })(<Input placeholder="请输入品类" />)}
               </FormItem>
            </Col>
            <Col span={12}>
               <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="订单自编号">
                  {form.getFieldDecorator('orderSelfNum', {
                     initialValue: '',
                  })(<TextArea placeholder="批量查询单击分隔" />)}
               </FormItem>
            </Col>
            <Col span={12}>
               <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="二级品类">
                  {form.getFieldDecorator('secondCategoryName', {
                     initialValue: '',
                  })(<Input placeholder="请输入二级品类" />)}
               </FormItem>
            </Col>
            <Col span={12}>
               <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="MSCS订单号">
                  {form.getFieldDecorator('wccNum', {
                     initialValue: '',
                  })(<TextArea placeholder="批量查询  分隔" />)}
               </FormItem>
            </Col>
            <Col span={12}>
               <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="批次号">
                  {form.getFieldDecorator('batchNum', {
                     initialValue: '',
                  })(<Input placeholder="请输入批次号" />)}
               </FormItem>
            </Col>
         </Row>
      </Modal>
   );
});

@connect(({ warning, loading, sysdeptList, sysoffice, communication, user, sysuser }) => ({
   ...warning,
   ...sysoffice,
   ...sysdeptList,
   ...user,
   ...sysuser,
   ...communication,
   loading: loading.models.warning,
   userloading: loading.effects['sysuser/fetch'],
}))
@Form.create()
class WarningList extends PureComponent {
   state = {
      selectedRows: [],
      isWatch: Boolean,
      formValues: {},
      buttonloading: false,
      expandForm: false, // 渲染from组件
      selectArray: [],
      pageSize: 10, // 每页显示多少条数
      previewVisible: false, // 显示弹窗
      checkedList: [], // 多选框
      current: 1, // 当前页码
      Graydata: {
         list: [],
         pagination: {},
      },
      siteCode: '', // 基地code
      sitename: '', // 基地名称
      buname: '', // 品类name
      selfNumArr: [], // 多个自定义id
      wccNumArr: [],

      isCheckAll: '', // 多选
      selectdata: [],
      selectdataoidlist: [],
      selectflag: {},
      zfflag: true,
      zfflag1: true,
      isCheckAllSearch: '',
      personIds: [], // 选择异常创建人
      currentUserData: {},
   };

   componentDidMount() {
      const { dispatch } = this.props;
      if (isNotBlank(getStorage('token'))) {
         let pageSize_cookie = getStorage('pageSize');
         if (isNotBlank(pageSize_cookie)) {
            this.setState({ pageSize: Number(pageSize_cookie) });
         }

         if (isNotBlank(localStorage.getItem('warning'))) {
            const setItemValue = parse(localStorage.getItem('warning'));
            if (isNotBlank(setItemValue.formValues)) {
               dispatch({
                  type: 'warning/fetch',
                  payload: {
                     current: setItemValue.current,
                     pageSize: setItemValue.pageSize,
                     ...setItemValue.formValues,
                  },
                  callback: data => {
                     if (setItemValue.expandForm === 'true') {
                        this.setState({
                           expandForm: true,
                        });
                     } else {
                        this.setState({
                           expandForm: false,
                        });
                     }
                     this.setState({
                        Graydata: data,
                        formValues: setItemValue.formValues,
                        current: setItemValue.current,
                        pageSize: setItemValue.pageSize,
                     });
                     localStorage.removeItem('warning');
                  },
               });
            } else {
               dispatch({
                  type: 'warning/fetch',
                  payload: {
                     current: setItemValue.current,
                     pageSize: setItemValue.pageSize,
                  },
                  callback: data => {
                     if (setItemValue.expandForm === 'true') {
                        this.setState({
                           expandForm: true,
                        });
                     } else {
                        this.setState({
                           expandForm: false,
                        });
                     }
                     this.setState({
                        Graydata: data,
                        current: setItemValue.current,
                        pageSize: setItemValue.pageSize,
                     });
                     localStorage.removeItem('warning');
                  },
               });
            }
         } else {
            dispatch({
               type: 'warning/fetch',
               payload: {
                  current: 1,
                  pageSize: this.state.pageSize,
               },
               callback: data => {
                  this.setState({
                     Graydata: data,
                  });
               },
            });
         }
         dispatch({
            // 品类
            type: 'communication/fetch_buname_wx',
            payload: { current: 1, pageSize: 100 },
            callback: data => {
               this.setState({
                  BUnameList: data,
               });
            },
         });
         dispatch({
            // 基地
            type: 'communication/fetch_basenamelist',
            payload: { current: 1, pageSize: 100 },
         });
         dispatch({
            // 用户选择
            type: 'sysuser/fetch',
            payload: { current: 1, pageSize: 50 },
            callback: data => {
               this.setState({
                  tableData: data,
               });
            },
         });

         dispatch({
            type: 'user/get_wx_config',
            payload: { url: window.location.host },
            callback: data => {
               window.wx.config({
                  beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: data.appId, // 必填，企业微信的corpID
                  timestamp: data.timestamp, // 必填，生成签名的时间戳
                  nonceStr: data.nonceStr, // 必填，生成签名的随机串
                  signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
                  jsApiList: ['selectEnterpriseContact', 'checkJsApi', 'scanQRCode', 'shareAppMessage'], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
               });
               this.setState({
                  Wx_config_data: data,
               });
            },
         });
         wx.ready(function() {
            //配置文件加载完成之后会自动调用ready中的模块
            wx.checkJsApi({
               jsApiList: ['scanQRCode'],
               success: function(res) {},
            });
         });
         wx.error(function(res) {
            Toast.info(res.errMsg, 1);
         });

         dispatch({
            type: `user/fetchCurrent_myself`,
            callback: data => {
               if (isNotBlank(data)) {
                  this.setState({ currentUserData: data });
               }
            },
         });
      }
   }

   editAndDelete = e => {
      e.stopPropagation();
      Modal.confirm({
         title: '删除数据',
         content: '确定删除已选择的数据吗？',
         okText: '确认',
         okType: 'danger',
         cancelText: '取消',
         onOk: () => this.handleDeleteClick(),
      });
   };

   handleSelectRows = rows => {
      this.setState({
         selectedRows: rows,
      });
   };

   toggleForm = () => {
      const { expandForm } = this.state;
      this.setState({
         expandForm: !expandForm,
      });
   };

   componentWillUnmount() {
      const { dispatch, formvalues_warning } = this.props;
      const { formValues, current, pageSize, expandForm } = this.state;
      let setItemValue = {};
      setItemValue.formValues = formValues;
      setItemValue.current = current;
      setItemValue.pageSize = pageSize;
      setItemValue.expandForm = expandForm;
      localStorage.setItem('warning', stringify(setItemValue));
      setStorage('pageSize', pageSize, 7);
   }

   handleSearch(e) {
      // 查询
      const { form, dispatch } = this.props;
      const { location, checkedKeys, checkedList, selfNumArr, wccNumArr, buname, sitename, personIds } = this.state;
      e.preventDefault();

      form.validateFieldsAndScroll((err, values) => {
         if (!err) {
            let value = { ...values };

            if (isNotBlank(value.schedulingtime) && value.schedulingtime.length > 0) {
               value.beginFirstScheduleTime = value.schedulingtime[0];
               value.endFirstScheduleTime = value.schedulingtime[1];
               delete value.schedulingtime;
            } else {
               delete value.schedulingtime;
            }
            if (isNotBlank(value.dueDateFactoy) && value.dueDateFactoy.length > 0) {
               value.beginDueDate = value.dueDateFactoy[0];
               value.endDueDate = value.dueDateFactoy[1];
               delete value.dueDateFactoy;
            } else {
               delete value.dueDateFactoy;
            }
            if (isNotBlank(value.createDate) && value.createDate.length > 0) {
               value.beginCreateDate = value.createDate[0];
               value.endCreateDate = value.createDate[1];
               delete value.createDate;
            } else {
               delete value.createDate;
            }
            if (isNotBlank(value.planBinTime) && value.planBinTime.length > 0) {
               value.beginPlanBinTime = value.planBinTime[0];
               value.endPlanBinTime = value.planBinTime[1];
               delete value.planBinTime;
            } else {
               delete value.planBinTime;
            }

            if (isNotBlank(value.createBy) && value.createBy.length > 0) {
               value.createBy = value.createBy.join(',');
            }
            if (isNotBlank(value.dispatch)) {
               if (value.dispatch == 1) {
                  value.dispatch = true;
               } else {
                  value.dispatch = false;
               }
            }
            Object.keys(value).map(item => {
               if (value[item] instanceof moment) {
                  value[item] = value[item].format('YYYY-MM-DD');
               }
               return item;
            });

            value.orderSelfNum = value.orderSelfNum
               ? value.orderSelfNum
                    .split('\n')
                    .filter(Boolean)
                    .join(',')
               : '';
            value = proccessObject(value);
            this.setState({
               formValues: value,
            });
            dispatch({
               type: 'warning/fetch',
               payload: { ...value, pageSize: this.state.pageSize, current: 1 },
               callback: data => {
                  dispatch({
                     type: 'warning/save_formvalues',
                     payload: {
                        formValues: value,
                        current: 1,
                        pageSize: this.state.pageSize,
                     },
                  });
                  this.setState({
                     Graydata: data,
                     pageSize: this.state.pageSize,
                     current: 1,
                     // expandForm: false
                  });
               },
            });
         }
      });
   }
   selectBunameChange(value, Option) {
      const { dispatch } = this.props;
      const { siteCode } = this.state;
      if (value.length == 0) {
         dispatch({
            type: 'communication/clear_fetch_secondname_wx',
         });
      } else {
         dispatch({
            // 根据品类来筛选二级品类
            type: 'communication/fetch_secondname_wx',
            payload: { buCode: value.join(',') },
         });
         dispatch({
            // 根据基地和品类来筛选 车间
            type: 'communication/fetch_workshop_wx',
            payload: {
               siteCode: siteCode && siteCode.length > 0 ? siteCode.join(',') : '',
               buCode: value.join(','),
            },
         });
      }
   }
   selectSiteNameChange(value, Option) {
      const { dispatch } = this.props;
      if (value.length == 0) {
         dispatch({
            type: 'communication/clear_fetch_workshop_wx',
         });
      } else {
         dispatch({
            // 根据基地来筛选 车间
            type: 'communication/fetch_workshop_wx',
            payload: {
               SiteCode: value.join(','),
            },
         });
      }
      this.setState({ siteCode: value });
   }

   onSelectPersonSearch(value) {
      const { dispatch } = this.props;
      dispatch({
         type: 'sysuser/fetch',
         payload: { current: 1, pageSize: 30, name: value },
         callback: data => {
            this.setState({
               tableData: data,
            });
         },
      });
   }
   handleFormReset() {
      const { form, dispatch } = this.props;
      form.resetFields();
      this.setState({
         formValues: {},
      });
      this.forceUpdate();
      dispatch({
         type: 'warning/fetch',
         payload: {
            current: 1,
            pageSize: this.state.pageSize,
         },
         callback: data => {
            this.setState({
               Graydata: data,
               current: 1,
            });
         },
      });
   }

   postForward = () => {
      const { selectdata, selectdataoidlist } = this.state;
      if (selectdata.length !== 0) {
         let ids = selectdata.join(',');
         const ua = navigator.userAgent.toLowerCase();
         if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            wx.invoke(
               'shareAppMessage',
               {
                  title: '订单协同平台', // 分享标题
                  desc: '', // 分享描述
                  link: `${homeUrl}/#/Warning/ForwardPage?id=${ids}`, // 分享链接
                  imgUrl: '', // 分享封面
               },
               function(res) {
                  if (res.err_msg == 'shareAppMessage:ok') {
                     //  router.push(`/wx/Forward?id=${ids}`)
                     message.success('转发成功!');
                  }
               }
            );
         } else {
            message.warning('请在微信浏览器打开！');
         }
      } else {
         message.warning('至少选择一条异常!');
      }
   };
   renderAdvancedForm() {
      const {
         form: { getFieldDecorator },
         getScondNameList,
         getAllBaseNameList,
         getWorkShopList,
         getbuNamelist,
      } = this.props;
      const { formValues } = this.state;
      const formItemLayout = {
         labelcol: {
            xs: { span: 5 },
            sm: { span: 8, offset: 0 },
         },
         wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
         },
      };
      return (
         <div className={styles.warning_form}>
            <Form
               onSubmit={e => {
                  this.handleSearch(e);
               }}
               layout="inline"
            >
               <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                  <Col md={8} sm={24} span={8}>
                     <FormItem label="订单自编号" {...formItemLayout}>
                        {getFieldDecorator('orderSelfNum', {
                           initialValue: isNotBlank(formValues) && isNotBlank(formValues.orderSelfNum) ? formValues.orderSelfNum : '',
                        })(<TextArea placeholder="请输入订单自编号" rows={4} />)}
                     </FormItem>
                  </Col>

                  <Col md={16} sm={24} span={16}>
                     <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                        <Col md={10} sm={24} span={10}>
                           <FormItem label="批次号" {...formItemLayout}>
                              {getFieldDecorator('batchNum', {
                                 initialValue: isNotBlank(formValues) && isNotBlank(formValues.batchNum) ? formValues.batchNum : '',
                              })(<Input placeholder="请输入批次号" />)}
                           </FormItem>
                        </Col>
                        <Col md={14} sm={24} span={14}>
                           <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="一级排产时间">
                              {getFieldDecorator('schedulingtime', {
                                 initialValue: [
                                    isNotBlank(formValues) && isNotBlank(formValues.beginFirstScheduleTime) ? moment(formValues.beginFirstScheduleTime) : '',
                                    isNotBlank(formValues) && isNotBlank(formValues.endFirstScheduleTime) ? moment(formValues.endFirstScheduleTime) : '',
                                 ],
                              })(<RangePicker style={{ width: '100%' }} />)}
                           </FormItem>
                        </Col>
                     </Row>
                     <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                        <Col md={10} sm={24} span={10}>
                           <FormItem label="异常类型" {...formItemLayout}>
                              {getFieldDecorator('warringType', {
                                 initialValue: isNotBlank(formValues) && isNotBlank(formValues.warringType) ? parseInt(formValues.warringType) : '',
                              })(
                                 <Select placeholder="请选择异常类型" style={{ width: '100%' }}>
                                    <Option key={1} value={1}>
                                       推迟
                                    </Option>
                                    <Option key={2} value={2}>
                                       预警
                                    </Option>
                                 </Select>
                              )}
                           </FormItem>
                        </Col>
                        <Col md={14} sm={24} span={14}>
                           <FormItem className={styles.formicon} labelcol={{ span: 4 }} wrapperCol={{ span: 20 }} label="工厂交期" style={{ padding: 0 }}>
                              {getFieldDecorator('dueDateFactoy', {
                                 initialValue: [
                                    isNotBlank(formValues) && isNotBlank(formValues.beginDueDate) ? moment(formValues.beginDueDate) : '',
                                    isNotBlank(formValues) && isNotBlank(formValues.endDueDate) ? moment(formValues.endDueDate) : '',
                                 ],
                              })(<RangePicker size="default" style={{ width: '100%' }} />)}
                           </FormItem>
                        </Col>
                     </Row>
                     <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                        <Col md={10} sm={24} span={10}>
                           <FormItem className={styles.formicon} labelcol={{ span: 4 }} wrapperCol={{ span: 20 }} label="MSCS订单号" style={{ padding: 0 }}>
                              {getFieldDecorator('wccNum', {
                                 initialValue: isNotBlank(formValues) && isNotBlank(formValues.wccNum) ? formValues.wccNum : '',
                              })(<Input size="default" style={{ width: '100%' }} />)}
                           </FormItem>
                        </Col>

                        <Col md={14} sm={24} span={14} {...formItemLayout}>
                           <FormItem label="派单状态" {...formItemLayout}>
                              {getFieldDecorator('dispatch', {
                                 initialValue: isNotBlank(formValues) && isNotBlank(formValues.dispatch) ? (formValues.dispatch == true ? 1 : 2) : '',
                              })(
                                 <Select placeholder="请选择派单状态" style={{ width: '100%' }}>
                                    <Option key={1} value={1}>
                                       已派单
                                    </Option>
                                    <Option key={2} value={2}>
                                       未派单
                                    </Option>
                                 </Select>
                              )}
                           </FormItem>
                        </Col>
                     </Row>
                     <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                        <Col offset={2}>
                           <Button type="primary" htmlType="submit">
                              查询
                           </Button>
                           <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset()}>
                              重置
                           </Button>
                           <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                              高级筛选 <Icon type="down" />
                           </a>
                        </Col>
                     </Row>
                  </Col>
               </Row>
            </Form>
         </div>
      );
   }

   renderSimpleForm() {
      const {
         form: { getFieldDecorator },
         getScondNameList,
         getAllBaseNameList,
         getWorkShopList,
         getbuNamelist,
         userloading,
      } = this.props;
      const { formValues } = this.state;
      const orderClassList = [
         { name: '零售单', key: 1 },
         { name: '工程单', key: 2 },
         { name: '外贸单', key: 3 },
         { name: '遗留单', key: 4 },
         { name: '内委单', key: 5 },
         { name: '橱柜内委单', key: 6 },
         { name: '衣柜内委单', key: 7 },
         { name: '卫浴内委单', key: 8 },
      ];
      const orderTypeList = [{ name: '普通', key: 1 }, { name: '小样', key: 2 }, { name: '样品', key: 3 }];
      return (
         <Form
            onSubmit={e => {
               this.handleSearch(e);
            }}
            layout="inline"
         >
            <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
               <Col md={8} sm={24} span={8}>
                  <FormItem label="订单自编号">
                     {getFieldDecorator('orderSelfNum', {
                        initialValue: isNotBlank(formValues) && isNotBlank(formValues.orderSelfNum) ? formValues.orderSelfNum : '',
                     })(<TextArea placeholder="请输入订单自编号" rows={10} />)}
                  </FormItem>
               </Col>

               <Col md={16} sm={24} span={16}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                     <Col md={10} sm={24} span={10}>
                        <FormItem label="批次号">
                           {getFieldDecorator('batchNum', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.batchNum) ? formValues.batchNum : '',
                           })(<Input placeholder="请输入批次号" />)}
                        </FormItem>
                     </Col>

                     <Col md={14} sm={24} span={14}>
                        <FormItem labelcol={{ span: 5 }} wrapperCol={{ span: 15 }} label="一级排产时间">
                           {getFieldDecorator('schedulingtime', {
                              initialValue: [
                                 isNotBlank(formValues) && isNotBlank(formValues.beginFirstScheduleTime) ? moment(formValues.beginFirstScheduleTime) : '',
                                 isNotBlank(formValues) && isNotBlank(formValues.endFirstScheduleTime) ? moment(formValues.endFirstScheduleTime) : '',
                              ],
                           })(<RangePicker style={{ width: '100%' }} />)}
                        </FormItem>
                     </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                     <Col md={10} sm={24} span={10}>
                        <FormItem className={styles.formicon} labelcol={{ span: 4 }} wrapperCol={{ span: 20 }} label="MSCS订单号" style={{ padding: 0 }}>
                           {getFieldDecorator('wccNum', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.wccNum) ? formValues.wccNum : '',
                           })(<Input size="default" style={{ width: '100%' }} />)}
                        </FormItem>
                     </Col>
                     <Col md={14} sm={24} span={14}>
                        <FormItem className={styles.formicon} labelcol={{ span: 4 }} wrapperCol={{ span: 20 }} label="工厂交期" style={{ padding: 0 }}>
                           {getFieldDecorator('dueDateFactoy', {
                              initialValue: [
                                 isNotBlank(formValues) && isNotBlank(formValues.beginDueDate) ? moment(formValues.beginDueDate) : '',
                                 isNotBlank(formValues) && isNotBlank(formValues.endDueDate) ? moment(formValues.endDueDate) : '',
                              ],
                           })(<RangePicker size="default" style={{ width: '100%' }} />)}
                        </FormItem>
                     </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                     <Col md={10} sm={24} span={10}>
                        <FormItem label="异常类型">
                           {getFieldDecorator('warringType', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.warringType) ? parseInt(formValues.warringType) : '',
                           })(
                              <Select placeholder="请选择异常类型" style={{ width: '100%' }}>
                                 <Option key={1} value={1}>
                                    推迟
                                 </Option>
                                 <Option key={2} value={2}>
                                    预警
                                 </Option>
                              </Select>
                           )}
                        </FormItem>
                     </Col>
                     <Col md={14} sm={24} span={14}>
                        <FormItem label="基地">
                           {getFieldDecorator('siteCode', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.siteCode) ? formValues.siteCode : [],
                           })(
                              <Select mode="multiple" placeholder="请选择基地名称" style={{ width: '100%' }} onChange={(value, Option) => this.selectSiteNameChange(value, Option)}>
                                 {isNotBlank(getAllBaseNameList) &&
                                    getAllBaseNameList.map(item => {
                                       return (
                                          <Option key={item.id} value={item.code}>
                                             {item.name}
                                          </Option>
                                       );
                                    })}
                              </Select>
                           )}
                        </FormItem>
                     </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                     <Col md={10} sm={24} span={10}>
                        <FormItem label="品类">
                           {getFieldDecorator('buCode', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.buCode) ? formValues.buCode : [],
                           })(
                              <Select mode="multiple" placeholder="请选择品类名称" style={{ width: '100%' }} onChange={(value, option) => this.selectBunameChange(value, option)}>
                                 {isNotBlank(getbuNamelist) &&
                                    getbuNamelist.map(item => {
                                       return (
                                          <Option key={item.id} value={item.code}>
                                             {item.name}
                                          </Option>
                                       );
                                    })}
                              </Select>
                           )}
                        </FormItem>
                     </Col>
                     <Col md={14} sm={24} span={14}>
                        <FormItem label="车间">
                           {getFieldDecorator('deptCode', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.deptCode) ? formValues.deptCode : [],
                           })(
                              <Select mode="multiple" placeholder="请选择车间名称" style={{ width: '100%' }}>
                                 {isNotBlank(getWorkShopList) &&
                                    getWorkShopList.map(item => {
                                       return (
                                          <Option key={item.id} value={item.code}>
                                             {item.name}
                                          </Option>
                                       );
                                    })}
                              </Select>
                           )}
                        </FormItem>
                     </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                     <Col md={10} sm={24} span={10}>
                        <FormItem label="二级品类">
                           {getFieldDecorator('secondCategoryCode', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.secondCategoryCode) ? formValues.secondCategoryCode : [],
                           })(
                              <Select mode="multiple" placeholder="请选择品类名称" style={{ width: '100%' }}>
                                 {isNotBlank(getScondNameList) &&
                                    getScondNameList.map(item => {
                                       return (
                                          <Option key={item.id} value={item.code}>
                                             {item.name}
                                          </Option>
                                       );
                                    })}
                              </Select>
                           )}
                        </FormItem>
                     </Col>

                     <Col md={14} sm={24} span={14}>
                        <FormItem className={styles.formicon} labelcol={{ span: 4 }} wrapperCol={{ span: 20 }} label="异常创建时间" style={{ padding: 0 }}>
                           {getFieldDecorator('createDate', {
                              initialValue: [
                                 isNotBlank(formValues) && isNotBlank(formValues.beginCreateDate) ? moment(formValues.beginCreateDate) : '',
                                 isNotBlank(formValues) && isNotBlank(formValues.endCreateDate) ? moment(formValues.endCreateDate) : '',
                              ],
                           })(<RangePicker size="default" style={{ width: '100%' }} />)}
                        </FormItem>
                     </Col>
                  </Row>

                  <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                     <Col md={10} sm={24} span={10}>
                        <FormItem className={styles.formicon} labelcol={{ span: 4 }} wrapperCol={{ span: 20 }} label="异常创建人" style={{ padding: 0 }}>
                           {getFieldDecorator('createBy', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.createBy) && JSON.stringify(formValues.createBy) !== '[]' ? formValues.createBy.split(',') : [],
                           })(
                              <Select
                                 optionLabelProp="lable"
                                 mode="multiple"
                                 placeholder="请选择创建人"
                                 notFoundContent={userloading ? <Spin size="small" /> : null}
                                 style={{ width: '100%' }}
                                 onSearch={value => this.onSelectPersonSearch(value)}
                              >
                                 {isNotBlank(this.state.tableData) &&
                                    isNotBlank(this.state.tableData.list) &&
                                    this.state.tableData.list.length > 0 &&
                                    this.state.tableData.list.map(item => {
                                       return (
                                          <Option key={item.id} value={item.id} lable={item.name}>
                                             {item.name}
                                          </Option>
                                       );
                                    })}
                              </Select>
                           )}
                        </FormItem>
                     </Col>
                     <Col md={14} sm={24} span={14}>
                        <FormItem className={styles.formicon} labelcol={{ span: 4 }} wrapperCol={{ span: 20 }} label="预计进仓时间" style={{ padding: 0 }}>
                           {getFieldDecorator('planBinTime', {
                              initialValue: [
                                 isNotBlank(formValues) && isNotBlank(formValues.beginPlanBinTime) ? moment(formValues.beginPlanBinTime) : '',
                                 isNotBlank(formValues) && isNotBlank(formValues.endPlanBinTime) ? moment(formValues.endPlanBinTime) : '',
                              ],
                           })(<RangePicker size="default" style={{ width: '100%' }} />)}
                        </FormItem>
                     </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="middle">
                     <Col md={10} sm={24} span={10}>
                        <FormItem className={styles.formicon} labelcol={{ span: 4 }} wrapperCol={{ span: 20 }} label="订单类型" style={{ padding: 0 }}>
                           {getFieldDecorator('orderType', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.orderType) ? formValues.orderType : [],
                           })(
                              <Select mode="multiple" placeholder="请选择订单类型" style={{ width: '100%' }}>
                                 {isNotBlank(orderTypeList) &&
                                    orderTypeList.length > 0 &&
                                    orderTypeList.map(item => {
                                       return (
                                          <Option key={item.key} value={item.name}>
                                             {item.name}
                                          </Option>
                                       );
                                    })}
                              </Select>
                           )}
                        </FormItem>
                     </Col>
                     <Col md={14} sm={24} span={14}>
                        <FormItem className={styles.formicon} labelcol={{ span: 4 }} wrapperCol={{ span: 20 }} label="订单类别" style={{ padding: 0 }}>
                           {getFieldDecorator('orderClass', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.orderClass) ? formValues.orderClass : [],
                           })(
                              <Select mode="multiple" placeholder="请选择订单类型" style={{ width: '100%' }}>
                                 {isNotBlank(orderClassList) &&
                                    orderClassList.length > 0 &&
                                    orderClassList.map(item => {
                                       return (
                                          <Option key={item.key} value={item.name}>
                                             {item.name}
                                          </Option>
                                       );
                                    })}
                              </Select>
                           )}
                        </FormItem>
                     </Col>
                  </Row>
                  <Row>
                     <Col md={10} sm={24} span={10}>
                        <FormItem label="派单状态">
                           {getFieldDecorator('dispatch', {
                              initialValue: isNotBlank(formValues) && isNotBlank(formValues.dispatch) ? (formValues.dispatch == true ? 1 : 2) : '',
                           })(
                              <Select placeholder="请选择派单状态" style={{ width: '100%' }}>
                                 <Option key={1} value={1}>
                                    已派单
                                 </Option>
                                 <Option key={2} value={2}>
                                    未派单
                                 </Option>
                              </Select>
                           )}
                        </FormItem>
                     </Col>
                     <Col md={12} sm={24} span={12} offset={2}>
                        <Button
                           type="primary"
                           htmlType="submit"
                           onClick={() => {
                              this.handleSearch;
                           }}
                        >
                           查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset()}>
                           重置
                        </Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                           收起 <Icon type="up" />
                        </a>
                     </Col>
                  </Row>
               </Col>
            </Row>
         </Form>
      );
   }
   onCheckboxParnodeChange(e, item, index) {
      // id
      const { Graydata } = this.props;
      const { selectdata, selectflag, selectdataoidlist } = this.state;
      if (!isNotBlank(selectflag) || (isNotBlank(selectflag) && JSON.stringify(selectflag) == '{}')) {
         var obj = {};
         obj['i' + index] = true;
         var newdata = selectdata;
         var newoiddata = selectdataoidlist;
         newoiddata.push(item.oid);
         for (var i = 0; i < item.exceptionList.length; i++) {
            if (newdata.indexOf(item.exceptionList[i]) == -1) {
               newdata.push(item.exceptionList[i].id);
            }
         }
         this.setState({
            selectdata: newdata,
            selectflag: obj,
            selectdataoidlist: newoiddata,
         });
      } else {
         if (isNotBlank(selectflag['i' + index])) {
            var obj = selectflag;
            var newdata = selectdata;
            var newoiddata = selectdataoidlist;
            obj['i' + index] = !obj['i' + index];
            if (obj['i' + index] == false) {
               obj['z' + index] = {};
               if (newoiddata.indexOf(item.oid) > -1) {
                  newoiddata.splice(newoiddata.indexOf(item.oid), 1);
               }
               for (var i = 0; i < item.exceptionList.length; i++) {
                  obj['z' + index]['y' + i] = false;
                  if (newdata.indexOf(item.exceptionList[i].id) > -1) {
                     newdata.splice(newdata.indexOf(item.exceptionList[i].id), 1);
                  }
               }
            } else {
               if (newoiddata.indexOf(item.oid) == -1) {
                  newoiddata.push(item.oid);
               }
               for (var i = 0; i < item.exceptionList.length; i++) {
                  if (newdata.indexOf(item.exceptionList[i].id) == -1) {
                     newdata.push(item.exceptionList[i].id);
                  }
               }
            }
            this.setState({
               selectdata: newdata,
               selectflag: obj,
               selectdataoidlist: newoiddata,
            });
            this.forceUpdate();
         } else {
            var obj = selectflag;
            var newdata = selectdata;
            var newoiddata = selectdataoidlist;
            obj['i' + index] = true;
            if (newoiddata.indexOf(item.oid) == -1) {
               newoiddata.push(item.oid);
            }
            for (var i = 0; i < item.exceptionList.length; i++) {
               if (newdata.indexOf(item.exceptionList[i].id) == -1) {
                  newdata.push(item.exceptionList[i].id);
               }
            }
            this.setState({
               selectdata: newdata,
               selectflag: obj,
               selectdataoidlist: newoiddata,
            });
            this.forceUpdate();
         }

         if (selectdata.length > 0) {
            this.setState({
               zfflag1: false,
            });
         } else {
            this.setState({
               zfflag1: true,
            });
         }

         let checkflag = true;
         for (var z = 0; z < Graydata.length; z++) {
            if (!isNotBlank(this.state.selectflag['z' + index]) || this.state.selectflag['z' + index] == false) {
               checkflag = false;
            }
         }
         this.setState({
            isCheckAll: !checkflag,
         });
      }
      this.forceUpdate();
   }
   onCheckboxItemChange(e, item, items, index, indexs) {
      const { selectdata, selectflag, selectdataoidlist } = this.state;
      const { Graydata } = this.props;
      if (!isNotBlank(selectflag) || (isNotBlank(selectflag) && JSON.stringify(selectflag) == '{}')) {
         var obj = {};
         obj['z' + index] = {};
         obj['z' + index]['y' + indexs] = true;
         var newdata = selectdata;
         newdata.push(item.id);
         this.setState({
            selectdata: newdata,
            selectflag: obj,
         });
         this.forceUpdate();
         if (items.exceptionList.length == 1) {
            obj['i' + index] = true;
         }
      } else {
         if (isNotBlank(selectflag['z' + index]) && JSON.stringify(selectflag['z' + index]) != '{}') {
            var obj = selectflag;
            // this.deepClone(selectflag,obj)
            var newdata = selectdata;
            var flag = true;
            // obj['z'+index] = {}
            obj['z' + index]['y' + indexs] = !obj['z' + index]['y' + indexs];
            if (obj['z' + index]['y' + indexs] == false) {
               obj['i' + index] = false;
               newdata.splice(newdata.indexOf(item.id), 1);
            } else {
               if (newdata.indexOf(item.id) == -1) {
                  newdata.push(item.id);
               }
            }
            for (var i = 0; i < items.exceptionList.length; i++) {
               if (!isNotBlank(obj['z' + index]['y' + i]) || obj['z' + index]['y' + i] == false) {
                  flag = false;
               }
            }
            if (flag) {
               obj['i' + index] = true;
            } else {
               obj['i' + index] = false;
            }
            this.setState({
               selectflag: obj,
               selectdata: newdata,
            });
            this.forceUpdate();
         } else {
            // this.deepClone(selectflag,obj)
            var obj = selectflag;
            var newdata = selectdata;
            obj['z' + index] = {};
            obj['z' + index]['y' + indexs] = true;
            if (newdata.indexOf(item.id) == -1) {
               newdata.push(item.id);
            }
            if (items.exceptionList.length == 1) {
               obj['i' + index] = true;
            }
            this.setState({
               selectflag: obj,
               selectdata: newdata,
            });
         }
      }

      if (selectdata.length > 0) {
         this.setState({
            zfflag1: false,
         });
      } else {
         this.setState({
            zfflag1: true,
         });
      }

      let checkflag = true;
      for (var z = 0; z < Graydata.length; z++) {
         if (!isNotBlank(this.state.selectflag['z' + index]) || this.state.selectflag['z' + index] == false) {
            checkflag = false;
         }
      }
      this.setState({
         isCheckAll: !checkflag,
      });
      this.forceUpdate();
   }

   isCheckAllfn(e) {
      // 是否全选
      const { Graydata } = this.props;
      const { isCheckAll } = this.state;
      if (e.target.checked) {
         let newdata = [];
         let obj = {};
         for (var i = 0; i < Graydata.list.length; i++) {
            if (Graydata.list[i].exceptionList.length > 0) {
               for (var j = 0; j < Graydata.list[i].exceptionList.length; j++) {
                  newdata.push(Graydata.list[i].exceptionList[j].id);
                  obj['i' + i] = true;
                  if (!isNotBlank(obj['z' + i])) {
                     obj['z' + i] = {};
                  }
                  obj['z' + i]['y' + j] = true;
               }
            }
         }
         this.setState({
            isCheckAll: true,
            selectdata: newdata,
            selectflag: obj,
         });
      } else {
         let obj = {};
         for (var i = 0; i < Graydata.list.length; i++) {
            if (Graydata.list[i].exceptionList.length > 0) {
               for (var j = 0; j < Graydata.list[i].exceptionList.length; j++) {
                  obj['i' + i] = false;
                  if (!isNotBlank(obj['z' + i])) {
                     obj['z' + i] = {};
                  }
                  obj['z' + i]['y' + j] = false;
               }
            }
         }
         this.setState({
            isCheckAll: false,
            selectdata: [],
            selectflag: obj,
         });
      }
   }
   isCheckAllSearchfn(e) {
      const { Graydata } = this.props;
      if (e.target.checked) {
         this.isCheckAllfn(e);
         this.setState({ isCheckAllSearch: true });
      } else {
         let obj = {};
         for (var i = 0; i < Graydata.list.length; i++) {
            if (Graydata.list[i].exceptionList.length > 0) {
               for (var j = 0; j < Graydata.list[i].exceptionList.length; j++) {
                  obj['i' + i] = false;
                  if (!isNotBlank(obj['z' + i])) {
                     obj['z' + i] = {};
                  }
                  obj['z' + i]['y' + j] = false;
               }
            }
         }
         this.setState({
            isCheckAll: false,
            selectdata: [],
            selectflag: obj,
            isCheckAllSearch: false,
         });
      }
   }

   onPressEnterAndSelfnum(value) {
      const { selfNumArr } = this.state;
      this.setState({
         selfNumArr: value,
      });
   }
   onPressEnterAndwccNum(value) {
      const { wccNumArr } = this.state;
      this.setState({
         wccNumArr: value,
      });
   }
   renderForm() {
      const { expandForm } = this.state;
      return expandForm ? this.renderSimpleForm() : this.renderAdvancedForm();
   }

   handleCancel() {
      // 取消
      this.setState({
         previewVisible: false,
      });
   }

   handleFieldChange(selectArray) {
      // 选择框回调触发事件
      let { Graydata } = this.state;
      let data = [];
      if (selectArray && selectArray.length > 0) {
         data = Graydata.filter(item => {
            return item.content == selectArray[0];
         });
         this.setState({
            Graydata: data,
         });
      }
   }

   onPaginationChange(pagenumber, pageSize) {
      // 分页
      const { dispatch } = this.props;
      this.setState({ current: pagenumber, pageSize: pageSize }, () => {
         const { current } = this.state;
         const { formValues } = this.state;
         if (JSON.stringify(formValues) !== '{}') {
            dispatch({
               type: 'warning/fetch',
               payload: {
                  current: current,
                  pageSize: pageSize,
                  ...formValues,
               },
               callback: data => {
                  this.setState({
                     Graydata: data,
                  });
               },
            });
         } else {
            dispatch({
               type: 'warning/fetch',
               payload: {
                  current: current,
                  pageSize: pageSize,
               },
               callback: data => {
                  this.setState({
                     Graydata: data,
                  });
               },
            });
         }
      });
   }

   onChange = e => {
      // 选择框回调
      let ischecked = e.target.checked;
      let checkedvalue = e.target.value;
      if (ischecked) {
         this.setState(({ checkedList }) => {
            return {
               checkedList: [...checkedList, ...checkedvalue],
            };
         });
      } else {
         const { checkedList } = this.state;
         if (checkedList.indexOf(checkedvalue[0]) > -1) {
            let index = checkedList.indexOf(checkedvalue[0]);

            checkedList.splice(index, 1);
            this.setState({
               checkedList: [...checkedList],
            });
         }
      }
   };

   handlewarning() {
      router.push(`/worktree/abnormal`);
   }

   handleReload() {
      // 未搜索到数据重新加载
      const { dispatch } = this.props;
      this.setState({ buttonloading: true, formValues: {} });
      this.forceUpdate();
      dispatch({
         type: 'warning/fetch',
         payload: {
            current: 1,
            pageSize: this.state.pageSize,
         },
         callback: data => {
            this.setState({
               current: 1,
               Graydata: data,
               buttonloading: false,
            });
         },
      });
   }

   handleWatchOrder(checked, e) {
      // 点击显示关注的订单
      const { dispatch } = this.props;
      const { formValues } = this.state;
      if (checked) {
         dispatch({
            type: 'warning/fetch',
            payload: {
               watch: true,
               pageSize: this.state.pageSize,
               ...formValues,
            },
            callback: data => {
               this.setState({ Graydata: data });
            },
         });
      } else if (!checked) {
         dispatch({
            type: 'warning/fetch',
            payload: {
               watch: false,
               pageSize: this.state.pageSize,
               ...formValues,
            },
            callback: data => {
               this.setState({ Graydata: data });
            },
         });
      }
   }

   handleHasWatchTono(item) {
      const { dispatch } = this.props;
      const { formValues } = this.state;
      dispatch({
         type: 'warning/handleChangeOrderStatus',
         payload: {
            watch: !item.watch,
            oid: item.oid,
         },
         callback: data => {
            this.setState({
               isWatch: data.watch,
            });
            dispatch({
               type: 'warning/fetch',
               payload: {
                  current: this.state.current,
                  pageSize: this.state.pageSize,
                  ...formValues,
               },
            });
         },
      });
   }

   handleUnderWatchToyes(item) {
      const { dispatch } = this.props;
      const { formValues } = this.state;
      dispatch({
         type: 'warning/handleChangeOrderStatus',
         payload: {
            watch: !item.watch,
            oid: item.oid,
         },
         callback: data => {
            this.setState({
               isWatch: data.watch,
            });
            dispatch({
               type: 'warning/fetch',
               payload: {
                  current: this.state.current,
                  pageSize: this.state.pageSize,
                  ...formValues,
               },
            });
         },
      });
   }

   handleBatch() {
      const { selectdata, formValues, isCheckAllSearch } = this.state;
      const { dispatch } = this.props;
      if (selectdata.length == 0) {
         message.warning('请先至少选择一条异常');
      } else if (isCheckAllSearch && JSON.stringify(formValues) == '{}') {
         message.warning('筛选条件不能为空');
      } else {
         confirm({
            title: '批量处理',
            content: '请选择异常处理或者关闭异常',
            okText: '异常处理',
            cancelText: '关闭异常',
            onOk() {
               if (!isCheckAllSearch) {
                  router.push(`/worktree/Batch_dispose?msg=comm`);
                  dispatch({
                     type: 'communication/add_selectdata_comm',
                     payload: { selectdata: selectdata },
                  });
               } else {
                  router.push(`/worktree/Batch_dispose?msg=comm`);
                  dispatch({
                     type: 'communication/add_selectdata_obj',
                     payload: { formValues, isCheckAllSearch },
                  });
               }
            },
            onCancel() {
               if (!isCheckAllSearch) {
                  router.push(`/worktree/Batch_dispose?msg=close`);
                  dispatch({
                     type: 'communication/add_selectdata_comm',
                     payload: { selectdata: selectdata },
                  });
               } else {
                  router.push(`/worktree/Batch_dispose?msg=close`);
                  dispatch({
                     type: 'communication/add_selectdata_obj',
                     payload: { formValues, isCheckAllSearch },
                  });
               }
            },
         });
      }
   }
   onShowSizeChange(current, pageSize_fy) {
      const { pageSize, formValues } = this.state;
      const { dispatch } = this.props;
      this.setState({ pageSize: pageSize_fy });
      dispatch({
         type: 'warning/fetch',
         payload: {
            current: current,
            pageSize: pageSize_fy,
            ...formValues,
         },
         callback: data => {
            this.setState({
               Graydata: data,
            });
         },
      });
   }
   unusual(e, item) {
      const { dispatch } = this.props;
      dispatch({
         type: 'warning/additem',
         payload: item,
      });
      router.push(`/worktree/abnormal?id=${item.oid}`);
   }
   batchExport() {
      const { formValues, currentUserData } = this.state;
      let exportValue = deepCopy(formValues);
      const { dispatch } = this.props;
      if (JSON.stringify(exportValue) !== '{}' && JSON.stringify(currentUserData) !== '{}') {
         exportValue.createBy = currentUserData.id;
         Object.keys(exportValue).forEach(ele => {
            if (Array.isArray(exportValue[ele])) {
               exportValue[ele] = exportValue[ele].join(',');
            }
         });
         let formElement = document.createElement('form');
         formElement.style.display = 'display:none;';
         formElement.method = 'post';
         formElement.action = `${homeUrl}/Api/op/orderException/export`;
         formElement.target = 'callBackTarget';
         for (var key in exportValue) {
            let inputElement = document.createElement('input');
            inputElement.type = 'hidden';
            inputElement.name = key;
            inputElement.value = exportValue[key];
            formElement.appendChild(inputElement);
         }
         document.body.appendChild(formElement);
         formElement.submit();
         document.body.removeChild(formElement);
      } else {
         message.warning('请先选择筛选条件!');
      }
   }
   render() {
      const { selectedRows, todoListState, selectArray, previewVisible, current, isWatch, pageSize } = this.state;

      const { loading, Graydata } = this.props;
      let defaultActiveKey = [];
      if (isNotBlank(Graydata) && isNotBlank(Graydata.list)) {
         defaultActiveKey = Graydata.list.map(item => item.oid);
      }
      const total = isNotBlank(Graydata) && isNotBlank(Graydata.pagination) && Graydata.pagination.total;

      const totalExceptionCount = isNotBlank(Graydata) && isNotBlank(Graydata.pagination) && Graydata.pagination.exceptionCount;
      const currentGrad = isNotBlank(Graydata) && isNotBlank(Graydata.pagination) && Graydata.pagination.current;
      const pageSizeGrad = isNotBlank(Graydata) && isNotBlank(Graydata.pagination) && Graydata.pagination.pageSize;

      const renderModelList = {
         handleCancel: () => {
            this.handleCancel();
         },
         handleSubmit: fieldsValue => {
            this.handleSubmit(fieldsValue);
         },
      };
      const WorningListComponentprops = {
         onChange: this.onChange.bind(this),
         onPaginationChange: this.onPaginationChange.bind(this),
         handleHasWatchTono: this.handleHasWatchTono.bind(this),
         handleUnderWatchToyes: this.handleUnderWatchToyes.bind(this),
         unusual: this.unusual.bind(this),
         current: currentGrad,
         loading,
         pageSize: pageSizeGrad, //每页条数
         isWatch, // 是否关注
         isCheckAllfn: e => this.isCheckAllfn(e),
         onCheckboxParnodeChange: (e, item, index) => this.onCheckboxParnodeChange(e, item, index),
         onCheckboxItemChange: (e, item, items, index, indexs) => this.onCheckboxItemChange(e, item, items, index, indexs),
         selectdata: this.state.selectdata,
         selectflag: this.state.selectflag,
         zfflag: this.state.zfflag,
         zfflag1: this.state.zfflag1,
         isCheckAll: this.state.isCheckAll,
         isCheckAllSearchfn: e => this.isCheckAllSearchfn(e),
         isCheckAllSearch: this.state.isCheckAllSearch,
         onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      };
      return (
         <PageHeaderWrapper>
            <div className={styles.standardList}>
               <Card bordered={false}>
                  <div className={styles.tableList}>
                     <div className={styles.tableListForm}>{this.renderForm()}</div>
                     <div className={styles.tableListOperator}></div>
                  </div>

                  <div>
                     <Switch
                        style={{ width: '80px', height: '23px' }}
                        type="primary"
                        onClick={(checked, e) => {
                           this.handleWatchOrder(checked, e);
                        }}
                        checkedChildren="已关注"
                        unCheckedChildren="所有"
                        defaultChecked={false}
                     >
                        我关注的订单
                     </Switch>
                     <Button
                        type="primary"
                        style={{ marginLeft: '30px' }}
                        onClick={() => {
                           this.handleBatch();
                        }}
                     >
                        批量处理
                     </Button>
                     <Button type="primary" style={{ marginLeft: '30px' }} onClick={() => {}}>
                        批量导入
                     </Button>
                     <Button
                        type="primary"
                        style={{ marginLeft: '30px' }}
                        onClick={() => {
                           this.batchExport();
                        }}
                     >
                        批量导出
                     </Button>
                     <Button type="primary" style={{ marginLeft: '30px' }} onClick={() => this.postForward()}>
                        转发
                     </Button>
                  </div>
               </Card>
            </div>
            {(isNotBlank(Graydata) && isNotBlank(Graydata.list) && Graydata.list.length == 0) || !isNotBlank(Graydata.list) ? (
               <Empty description="抱歉！暂无数据">
                  <Button
                     type="primary"
                     onClick={() => {
                        this.handleReload();
                     }}
                     loading={this.state.buttonloading || loading}
                  >
                     点我重新加载
                  </Button>
               </Empty>
            ) : (
               <WorningListComponent
                  Graydata={Graydata}
                  total={total} // 总共多少条数据
                  totalExceptionCount={totalExceptionCount}
                  // defaultCurrent={this.state.current} // 默人选中第几个
                  isDisabled={false} // 面板是否禁用
                  defaultActiveKey={defaultActiveKey} // 默认展开的所有面板
                  {...WorningListComponentprops}
               />
            )}
            <RenderModel previewVisible={previewVisible} {...renderModelList} />
         </PageHeaderWrapper>
      );
   }
}

export default WarningList;
