import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import {
   Button,
   Input,
   InputNumber,
   Form,
   Card,
   Popconfirm,
   Icon,
   Row,
   Col,
   Select,
   DatePicker,
   Divider,
   Tag,
   Avatar,
   message,
   Modal,
   List,
   Radio,
   Collapse,
   Transfer,
   Table,
   Badge,
   Menu,
   Dropdown,
   Pagination,
   Checkbox,
   Spin,
} from 'antd';
import { isNotBlank, getFullUrl } from '@/utils/utils';
import monment from 'moment';
import { routerRedux } from 'dva/router';
import styles from './worningListComponent.less';
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

import notattention from '../../../assets/notattention.png'; // Icon
import attention from '../../../assets/attention.png';
import warning from '../../../assets/Warning.png';
import warningone from '../../../assets/warningone.png';
import warningtwo from '../../../assets/waring_new_two.png';
import wraningnewone from '../../../assets/wraning_new_one.png';

@connect(({ communication, loading }) => ({
   ...communication,
   communicationLoading: loading.models.communication,
}))
class WorningListComponent extends React.Component {
   state = {
      isCheckAll: '',
      selectdata: [],
      selectflag: {},
      zfflag: true,
      zfflag1: true,
   };

   showTotal(total) {
      let GraydataAll = this.props.Graydata.pagination;
      if (isNotBlank(total)) {
         return `总共${total}条记录,当前${isNotBlank(GraydataAll) ? GraydataAll.current : ''}页`;
      }
   }

   warningDateil(e, idself) {
      // 跳转详情
      e.preventDefault();
      router.push(`/worktree/exception?id=${idself}`);
   }

   watchAll(item) {
      const { dispatch } = this.props;
      dispatch({
         type: 'communication/AddOnerecord',
         payload: { AddOnerecord: item },
      });
      router.push(`/worktree/Communication?id=${item.id}`);
   }

   warningDispose() {}

   componentWillUnmount() {}

   warningBatch() {
      const { selectdata } = this.state;
      if (selectdata && selectdata.length == 0) {
         message.warning('请至少选择一条异常信息');
      } else {
      }
   }
   render() {
      const {
         Graydata,
         onPaginationChange,
         total,
         totalExceptionCount,
         isDisabled,
         defaultCurrent,
         defaultActiveKey,
         onChange,
         current,
         loading,
         pageSize,
         handleHasWatchTono,
         handleUnderWatchToyes,
         isWatch,
         unusual,
         selectdata,
         selectflag,
         zfflag,
         zfflag1,
         isCheckAll,
         isCheckAllfn,
         onCheckboxParnodeChange,
         onCheckboxItemChange,
         isCheckAllSearch,
         isCheckAllSearchfn,
         onShowSizeChange,
      } = this.props;

      return (
         <Spin size="large" spinning={loading} className={styles.worningList}>
            <Card>
               <div className={styles.allselect}>
                  <div data-show="true" className="ant-alert ant-alert-info">
                     <span
                        style={{
                           whiteSpace: 'nowrap',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                        }}
                     >
                        <Checkbox checked={isCheckAll} onChange={e => isCheckAllfn(e)} />
                        &nbsp;&nbsp;选择本页
                     </span>
                     <span style={{ display: 'inline-block', marginLeft: '10px' }}>
                        <Checkbox checked={isCheckAllSearch} onChange={e => isCheckAllSearchfn(e)} />
                        &nbsp;&nbsp;选择所有查询结果
                     </span>
                     <span className="ant-alert-message" style={{ marginLeft: '12px' }}>
                        已选择 <a style={{ fontWeight: 600 }}>{isCheckAllSearch ? '全部查询结果' : `${selectdata.length}条异常`}</a>
                     </span>
                     &nbsp;&nbsp;&nbsp;&nbsp;
                     <span className="ant-alert-description"></span>
                     <span className="ant-alert-message">
                        共<a style={{ fontWeight: 600 }}>{total}</a> 条订单/
                        <a style={{ fontWeight: 600 }}>{totalExceptionCount}</a>
                        条异常&nbsp;&nbsp;&nbsp;&nbsp;
                     </span>
                     <span className="ant-alert-description"></span>
                     {/* <span className="ant-alert-message">
                                今天新增 <a style={{ fontWeight: 600 }}>0</a> 条订单
                                <a style={{ fontWeight: 600 }}>0</a>条异常&nbsp;&nbsp;&nbsp;&nbsp;
                            </span> */}
                  </div>
               </div>
               <Collapse defaultActiveKey={defaultActiveKey} activeKey={defaultActiveKey} className={styles.rowstyle1}>
                  {isNotBlank(Graydata) &&
                     isNotBlank(Graydata.list) &&
                     Graydata.list.map((item, index) => {
                        return (
                           <Panel
                              disabled={isDisabled}
                              showArrow={false}
                              // key={index}
                              key={item.oid}
                              header={
                                 <Row>
                                    <Col
                                       span={1}
                                       style={{
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                       }}
                                    >
                                       <Checkbox
                                          checked={isCheckAll || selectflag['i' + index]}
                                          className={styles.checkbox_style}
                                          style={{ marginLeft: '4px' }}
                                          key={item.oid}
                                          onChange={e => onCheckboxParnodeChange(e, item, index)}
                                          disabled={!isNotBlank(item.exceptionList)}
                                       />
                                    </Col>
                                    <Col span={4} className={styles.yiguanz}>
                                       {item.watch == true ? ( // 已关注
                                          <div>
                                             <img src={attention} style={{ marginBottom: '4px' }} />
                                             <a
                                                style={{
                                                   textDecoration: 'underline',
                                                   color: '#333',
                                                }}
                                                onClick={() => {
                                                   handleHasWatchTono(item);
                                                }}
                                             >
                                                <span
                                                   style={{
                                                      marginLeft: '5px',
                                                      marginBottom: '2px',
                                                   }}
                                                >
                                                   已关注
                                                </span>
                                             </a>
                                          </div>
                                       ) : (
                                          <div>
                                             <img src={notattention} style={{ marginBottom: '4px' }} />
                                             <a
                                                style={{
                                                   textDecoration: 'underline',
                                                   color: 'bule',
                                                   marginLeft: '5px',
                                                }}
                                                onClick={() => {
                                                   handleUnderWatchToyes(item);
                                                }}
                                             >
                                                未关注
                                             </a>
                                          </div>
                                       )}
                                    </Col>
                                    <Col
                                       span={12}
                                       style={{
                                          fontWeight: 600,
                                          fontSize: 16,
                                          textDecoration: 'underline',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          color: '#40a9ff',
                                       }}
                                    >
                                       <a
                                          style={{
                                             fontWeight: 600,
                                             fontSize: 16,
                                             textDecoration: 'underline',
                                          }}
                                          onClick={e => {
                                             this.warningDateil(e, item.oid);
                                          }}
                                       >
                                          {item.orderSelfNum}
                                       </a>
                                    </Col>
                                    <Col span={5}></Col>
                                    <Col span={2} style={{ textAlign: 'center' }}>
                                       {isNotBlank(item.exceptionList) && item.exceptionList.length > 0 ? (
                                          <span
                                             style={{
                                                width: '16px',
                                                height: '16px',
                                                display: 'inline-block',
                                                borderRadius: '50%',
                                                border: '1px  solid  red',
                                                lineHeight: '16px',
                                                textAlign: 'center',
                                                color: 'red',
                                             }}
                                          >
                                             {item.exceptionList ? item.exceptionList.length : ''}
                                          </span>
                                       ) : null}
                                    </Col>
                                 </Row>
                              }
                           >
                              {isNotBlank(item.exceptionList) &&
                                 item.exceptionList.length > 0 &&
                                 item.exceptionList.map((items, indexs) => {
                                    return (
                                       <Row
                                          justify="space-between"
                                          type="flex"
                                          gutter={[{ xs: 8, sm: 16, md: 24 }, 16]}
                                          key={items.id}
                                          style={{
                                             height: '60px',
                                             borderBottom: '1px solid #ccc',
                                             lineHeight: '60px',
                                          }}
                                       >
                                          <Col
                                             span={1}
                                             style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '60px',
                                                lineHeight: '60px',
                                             }}
                                          >
                                             <Checkbox
                                                checked={
                                                   isCheckAll ||
                                                   ((isNotBlank(selectflag['i' + index]) && selectflag['i' + index]) ||
                                                      (isNotBlank(selectflag['z' + index]) && isNotBlank(selectflag['z' + index]['y' + indexs]) && selectflag['z' + index]['y' + indexs]))
                                                }
                                                className={styles.checkbox_scond}
                                                key={items.id}
                                                onChange={e => onCheckboxItemChange(e, items, item, index, indexs)}
                                             />
                                          </Col>
                                          <Col
                                             span={1}
                                             style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '60px',
                                                lineHeight: '60px',
                                             }}
                                          >
                                             {isNotBlank(items.warringType) && (items.warringType === 1 || items.warringType === '1') ? (
                                                <img
                                                   src={wraningnewone}
                                                   style={{
                                                      width: '18px',
                                                      height: '18px',
                                                   }}
                                                />
                                             ) : null}
                                             {isNotBlank(items.warringType) && (items.warringType === 2 || items.warringType === '2') ? (
                                                <img
                                                   src={warningtwo}
                                                   style={{
                                                      width: '18px',
                                                      height: '18px',
                                                   }}
                                                />
                                             ) : null}
                                          </Col>
                                          <Col
                                             span={3}
                                             style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '60px',
                                                lineHeight: '60px',
                                             }}
                                          >
                                             {items.secondCategoryName}
                                          </Col>
                                          <Col
                                             span={4}
                                             style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '60px',
                                                lineHeight: '60px',
                                             }}
                                          >
                                             {items.deptName}
                                          </Col>
                                          <Col
                                             span={4}
                                             style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '60px',
                                                lineHeight: '60px',
                                             }}
                                          >
                                             预计进仓：
                                             {items.planBinTime ? monment(items.planBinTime).format('YYYY-MM-DD') : ''}
                                          </Col>
                                          <Col
                                             span={4}
                                             style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '60px',
                                                lineHeight: '60px',
                                             }}
                                          >
                                             工厂交期： {items.dueDate ? monment(items.dueDate).format('YYYY-MM-DD') : ''}
                                          </Col>
                                          <Col
                                             span={5}
                                             style={{
                                                height: '60px',
                                                lineHeight: '60px',
                                             }}
                                          >
                                             <div>
                                                <p
                                                   style={{
                                                      whiteSpace: 'nowrap',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      maxWidth: '160px',
                                                      marginBottom: 0,
                                                      display: 'inline-block',
                                                   }}
                                                >
                                                   评论：{items.updateInfo}
                                                </p>

                                                <a
                                                   style={{
                                                      display: 'inline-block',
                                                      verticalAlign: 'top',
                                                      marginLeft: '5px',
                                                   }}
                                                   onClick={() => {
                                                      this.watchAll(items);
                                                   }}
                                                >
                                                   {' '}
                                                   >>{items.commentCount}
                                                </a>
                                             </div>
                                          </Col>
                                          <Col
                                             span={2}
                                             style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '60px',
                                                lineHeight: '60px',
                                                textAlign: 'center',
                                             }}
                                          >
                                             <a
                                                style={{
                                                   textDecoration: 'underline',
                                                }}
                                                onClick={() => {
                                                   this.watchAll(items);
                                                }}
                                             >
                                                异常处理
                                             </a>
                                          </Col>
                                       </Row>
                                    );
                                 })}
                           </Panel>
                        );
                     })}
               </Collapse>
               <Pagination // 分页
                  style={{ padding: '10px 0 0 50px ' }}
                  showQuickJumper
                  // defaultCurrent={defaultCurrent} // 默认选中
                  total={total} //总共页数
                  current={current} // 当前页
                  pageSize={pageSize}
                  onChange={(pagenumber, pageSize) => {
                     onPaginationChange(pagenumber, pageSize);
                  }}
                  showSizeChanger
                  onShowSizeChange={(current, pageSize) => onShowSizeChange(current, pageSize)}
                  showTotal={this.showTotal.bind(this)}
                  pageSizeOptions={['10', '50', '100', '200', '500']}
               />
            </Card>
         </Spin>
      );
   }
}

export default WorningListComponent;
