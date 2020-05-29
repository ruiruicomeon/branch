import React, { PureComponent, Fragment } from 'react';

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
   Steps,
   Popover,
   Tabs,
   Comment,
   Tooltip,
   Spin,
   Mentions,
} from 'antd';
import router from 'umi/router';
import StandardEditTable from '@/components/StandardEditTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isNotBlank, getFullUrl, getLocation } from '@/utils/utils';
import { homeUrl } from '../../../../config/baseConfig';
import moment from 'moment';
import { Upload } from 'antd-form-mate';
const { TextArea } = Input;
/**
 * @ 异常回复
 */

@connect(({ communication, loading, sysuser }) => ({
   ...communication,
   ...sysuser,
}))
class CommuniCationRecord extends PureComponent {
   state = {
      recordId: '',
      textAreaValue: '',
      replyUserId: '',
      replyUserName: '',
      replyItem: {},
      replyInfo: '',
      isShowSonComm: '',
      isShowSonCommTWO: '',
      SonreplyInfo: '',
      parentId: '',
      mentionsNameArray: [],
      mentionsIdArray: [],
      wenzi: '',
      plshow: false,
   };
   componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
         // 用户选择
         type: 'sysuser/fetch',
         payload: { current: 1, pageSize: 6000 },
         callback: data => {
            this.setState({
               tableData: data,
            });
         },
      });
   }

   addCommentSon(e, item) {
      //son 回复点击事件
      e.preventDefault();
      if (isNotBlank(item) && isNotBlank(item.createBy) && isNotBlank(item.createBy.id) && isNotBlank(item.createBy.name)) {
         this.setState({
            replyUserId: item.createBy.id,
            replyUserName: `@${item.createBy.name}`,
            SonreplyInfo: `@${item.createBy.name} `,
            replyItem: item,
            showflag: true,
            wenzi: '取消',
         });
      }
   }
   addComment(e, item) {
      // 快速回复点击事件
      const { SonreplyInfo } = this.state;
      e.preventDefault();
      if (isNotBlank(item) && isNotBlank(item.createBy) && isNotBlank(item.createBy.id) && isNotBlank(item.createBy.name)) {
         this.setState({
            replyUserId: item.createBy.id,
            replyUserName: `@${item.createBy.name}`,
            replyItem: item,
            parentId: item.id,
            isShowSonComm: item.id,
            wenzi: '取消',
            showflag: true,
         });
      }
   }

   handleTextAreachange(value) {
      // 文本框内容变化回调
      this.setState({
         replyInfo: value,
      });
   }
   handleSonTextAreachange(e) {
      let textAreaValue = e.target.value;
      if (isNotBlank(textAreaValue)) {
         this.setState({
            wenzi: '提交',
         });
      } else {
         this.setState({
            wenzi: '取消',
         });
      }
      this.setState({
         SonreplyInfo: textAreaValue,
      });
   }

   onPreview(file, url) {
      // 文件打开
      window.open(`${homeUrl}/Api${url}`);
   }
   confirmAddcommun = () => {
      // 确定提交评论 直接提交评论
      const { dispatch, exceptionId } = this.props;
      const { replyInfo, mentionsNameArray, mentionsIdArray } = this.state;
      if (isNotBlank(replyInfo)) {
         let mentionsIdArr = [];
         let mentions = '';
         if (isNotBlank(mentionsIdArray) && mentionsIdArray.length > 0) {
            for (let i = 0; mentionsNameArray.length > 0 && i < mentionsNameArray.length; i += 1) {
               if (isNotBlank(mentionsNameArray[i]) && replyInfo.indexOf(mentionsNameArray[i]) > -1) {
                  mentionsIdArr = [...mentionsIdArr, mentionsIdArray[i]];
               }
            }
         }
         if (isNotBlank(mentionsIdArr) && mentionsIdArr.length > 0) {
            const ids = mentionsIdArr.map(item => item).join(',');
            mentions = ids;
         }
         dispatch({
            type: 'communication/addcommrecoed',
            payload: {
               exceptionId: exceptionId,
               commInfo: replyInfo,
               mentions: mentions || '',
            },
            callback: () => {
               dispatch({
                  type: 'communication/fetch',
                  payload: { exceptionId: exceptionId },
               });
               this.setState({
                  replyInfo: '',
                  mentionsIdArray: [],
                  mentionsNameArray: [],
               });
            },
         });
      } else {
         message.warning('请输入评论内容');
      }
   };
   confirmAddSoncommun(e) {
      const { dispatch } = this.props;
      const {
         SonreplyInfo, // 子回复数据
         replyItem,
         replyUserName,
         replyUserId,
         parentId,
      } = this.state;

      if (SonreplyInfo.indexOf(replyUserName) > -1) {
         let mentions = '';
         let info = SonreplyInfo;
         if (SonreplyInfo.indexOf(replyUserName) > -1) {
            mentions = replyUserId;
            info = info.replace(replyUserName, '');
         }
         info = info.replace(/^\s*|\s*$/g, '');

         if (isNotBlank(SonreplyInfo)) {
            dispatch({
               type: 'communication/addcommrecoed',
               payload: {
                  exceptionId: replyItem.exceptionId,
                  commInfo: SonreplyInfo,
                  mentions: mentions || '',
                  parentId: parentId,
               },
               callback: () => {
                  dispatch({
                     type: 'communication/fetch',
                     payload: { exceptionId: replyItem.exceptionId },
                  });
                  this.setState({
                     replyUserId: '',
                     replyUserName: '',
                     replyItem: {},
                     SonreplyInfo: '',
                     isShowSonComm: '',
                     parentId: '',
                     showflag: false,
                  });
               },
            });
         } else {
            message.warning('请输入评论内容');
         }
      } else {
         // 直接回复
         if (isNotBlank(SonreplyInfo)) {
            dispatch({
               type: 'communication/addcommrecoed',
               payload: {
                  exceptionId: replyItem.exceptionId,
                  commInfo: SonreplyInfo,
                  // mentions: mentions || '',
                  parentId: parentId,
               },
               callback: () => {
                  dispatch({
                     type: 'communication/fetch',
                     payload: { exceptionId: replyItem.exceptionId },
                  });
                  this.setState({
                     replyUserId: '',
                     replyUserName: '',
                     replyItem: {},
                     replyInfo: '',
                     SonreplyInfo: '',
                     isShowSonComm: '',
                  });
               },
            });
         } else {
            message.warning('请输入评论内容');
         }
      }
   }

   onMentionsSelect = option => {
      const { mentionsNameArray, mentionsIdArray } = this.state;
      this.setState({
         mentionsNameArray: [...mentionsNameArray, `@${option.value}`],
         mentionsIdArray: [...mentionsIdArray, option.id],
      });
   };

   quxiao = () => {
      this.setState({
         SonreplyInfo: '',
         showflag: false,
      });
   };

   render() {
      const { title, fileList, loading, communicationData } = this.props;
      const { replyInfo, isShowSonComm, SonreplyInfo, isShowSonCommTWO, wenzi, showflag } = this.state;
      return (
         <List
            loading={loading}
            header={
               <div style={{ display: 'flex' }}>
                  <Mentions value={replyInfo} onChange={e => this.handleTextAreachange(e)} rows="1" onSelect={this.onMentionsSelect} placeholder="请输入信息,使用@圈出人员用于提醒">
                     {isNotBlank(this.state.tableData) &&
                        isNotBlank(this.state.tableData.list) &&
                        this.state.tableData.list.map(item => (
                           <Option value={`${item.name}(${item.mobile})`} key={item.id} id={item.id}>
                              {`${item.name}(${item.mobile})`}
                           </Option>
                        ))}
                  </Mentions>
                  <Button
                     type="primary"
                     onClick={() => {
                        this.confirmAddcommun();
                     }}
                  >
                     快速回复
                  </Button>
               </div>
            }
            itemLayout="horizontal"
            dataSource={isNotBlank(communicationData) && communicationData}
            renderItem={item => (
               <li>
                  <Comment
                     actions={[
                        <a
                           style={{ textDecoration: 'underline' }}
                           onClick={e => {
                              this.addComment(e, item);
                           }}
                        >
                           评论
                        </a>,
                     ]}
                     author={isNotBlank(item.createBy) && isNotBlank(item.createBy.name) && item.createBy.name}
                     avatar={<Avatar src={isNotBlank(item.createBy) && isNotBlank(item.createBy.photo) && item.createBy.photo} shape="square" />}
                     datetime={
                        <Tooltip title={isNotBlank(item.createDate) && moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}>
                           <span>{isNotBlank(item.createDate) && moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}</span>
                        </Tooltip>
                     }
                     content={
                        <div>
                           {isNotBlank(item.commInfo) ? <div>&nbsp;{item.commInfo} </div> : ''}
                           <div>
                              {isNotBlank(item.respType) && <div>责任分类：&nbsp; {item.respType}</div>}
                              {isNotBlank(item.respDept) && <div>责任部门：&nbsp; {item.respDept}</div>}
                              {isNotBlank(item.followDept) && <div>跟进部门：&nbsp; {item.followDept}</div>}
                              {isNotBlank(item.estiCompTime) && <div>预计完成：&nbsp; {moment(item.estiCompTime).format('YYYY-MM-DD')}</div>}
                           </div>
                           <div>
                              {isNotBlank(item.accessorys) &&
                                 item.accessorys.map(item => {
                                    return (
                                       <Upload
                                          onPreview={file => {
                                             this.onPreview(file, item.path);
                                          }}
                                          fileList={[
                                             {
                                                uid: isNotBlank(item.id) && item.id,
                                                name: isNotBlank(item.path) ? item.path.substring(item.path.lastIndexOf('/') + 1) : '',
                                                url: isNotBlank(item.path) && item.path,
                                             },
                                          ]}
                                       />
                                    );
                                 })}
                           </div>

                           {isNotBlank(item.children) ? <ExampleComment commInfoData={item.children} confirmReplyComm={this.addCommentSon.bind(this)}></ExampleComment> : ''}
                           {isShowSonComm == item.id && showflag ? (
                              <div style={{ display: 'flex' }}>
                                 <TextArea
                                    style={{ width: '60%' }}
                                    placeholder="请输入评论内容"
                                    autosize
                                    value={SonreplyInfo}
                                    onChange={e => {
                                       this.handleSonTextAreachange(e);
                                    }}
                                 />
                                 <Button
                                    type="primary"
                                    onClick={e => {
                                       {
                                          isNotBlank(wenzi) && wenzi == '提交' ? this.confirmAddSoncommun(e) : this.quxiao();
                                       }
                                    }}
                                 >
                                    {wenzi}
                                 </Button>
                              </div>
                           ) : (
                              ''
                           )}
                           {item.children ? (
                              isShowSonCommTWO == item.children.id ? (
                                 <div style={{ display: 'flex' }}>
                                    <TextArea
                                       style={{ width: '60%' }}
                                       placeholder="请输入评论内容"
                                       autosize
                                       value={SonreplyInfo}
                                       onChange={e => {
                                          this.handleSonTextAreachange(e);
                                       }}
                                    />
                                    <Button
                                       type="primary"
                                       onClick={e => {
                                          {
                                             isNotBlank(wenzi) && wenzi == '提交' ? this.confirmAddSoncommun(e) : this.quxiao();
                                          }
                                          // this.confirmAddSoncommun(e);
                                       }}
                                    >
                                       {wenzi}
                                       {/* 提交 */}
                                    </Button>
                                 </div>
                              ) : (
                                 ''
                              )
                           ) : (
                              ''
                           )}
                        </div>
                     }
                  ></Comment>
               </li>
            )}
         />
      );
   }
}

export default CommuniCationRecord;

class ExampleComment extends PureComponent {
   render() {
      const { children, commInfoData, confirmReplyComm } = this.props;
      return (
         commInfoData &&
         commInfoData.length > 0 &&
         commInfoData.map((item, index) => {
            return (
               <Comment
                  style={{ background: '#F8F9FA', marginBottom: '10px' }}
                  actions={[]}
                  author={<a>{isNotBlank(item) && isNotBlank(item.createBy) && isNotBlank(item.createBy.name) ? item.createBy.name : ' '}</a>}
                  avatar={
                     <Avatar
                        onClick={e => confirmReplyComm(e, item)}
                        size="small"
                        src={isNotBlank(item) && isNotBlank(item.createBy) && isNotBlank(item.createBy.photo) ? item.createBy.photo : ' '}
                        alt="person"
                        shape="square"
                     />
                  }
                  datetime={
                     <Tooltip title={isNotBlank(item.createDate) && moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{isNotBlank(item.createDate) && moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}</span>
                     </Tooltip>
                  }
                  content={
                     <div>
                        <div>
                           <span>{isNotBlank(item) && isNotBlank(item.commInfo) ? item.commInfo : ''}</span>
                        </div>
                        {/* <div>
                                { isShowSonCommTWO == item.id ? 
                                            <div style={{ display: 'flex' }}>
                                                <TextArea
                                                    style={{ width: '60%' }}
                                                    placeholder="请输入评论内容"
                                                    autosize
                                                    value={SonreplyInfo}
                                                    onChange={e => {
                                                        this.handleSonTextAreachange(e);
                                                    }}
                                                />
                                                <Button
                                                    type="primary"
                                                    onClick={e => {
                                                        { isNotBlank(wenzi) && wenzi == '提交' ? this.confirmAddSoncommun(e) : this.quxiao() };
                                                        // this.confirmAddSoncommun(e);
                                                    }}
                                                >
                                                    {wenzi}
                                                </Button>
                                            </div>
                                        : ''
                                     
                                    }
                                </div> */}
                     </div>
                  }
               >
                  {children}
               </Comment>
            );
         })
      );
   }
}
