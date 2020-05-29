import React, { PureComponent } from 'react';
import { List, NavBar, Icon, Toast } from 'antd-mobile';
import router from 'umi/router';
import { Input, Button, Mentions } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { isNotBlank, getFullUrl, getLocation, judgeLen } from '@/utils/utils';
import styles from './DisposeWeUi.less';
import classnames from 'classnames';
const fileImg = require('../../assets/file_img.png');
const moreFile = require('../../assets/more_file.png');
const comm_img = require('../../assets/huifu.png');
const down_img = require('../../assets/down.png');
@connect(({ communication, loading }) => ({
    ...communication,
    loading: loading.models.communication,
}))
class DisposeWeUi extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            replyUserId: '',
            replyUserName: '',
            replyItem: {},
            replyInfo: '',
            exceptionId: '',
            replyOfClick: '',
            parentId: '',
            isShowClickInput: '', //input框是否显示
            isShowClickInputTWO: '', //二级评论的input框是否显示
            replyOfClickTWO: '', //二级评论input value
            initShowInput: true, //初始显示取消
            initShowInputTWO: true,
            presentTab: '',
            showcommAll: false,
            mentionsNameArray: [],
            mentionsIdArray: [],
            isdisplaycomm: false,
            isdisplaycommson: false,
            showmorecomm: 3, // 展示的长度
            flagId: [], // 控制展示id
        };
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        if (
            isNotBlank(location) &&
            isNotBlank(location.query) &&
            isNotBlank(location.query.presentTab)
        ) {
            this.setState({ presentTab: location.query.presentTab });
        }
        if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
            dispatch({
                type: 'communication/fetch',
                payload: {
                    exceptionId: location.query.id,
                },
            });
            this.setState({ exceptionId: location.query.id });
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

        const ua = navigator.userAgent.toLowerCase();
        // if (ua.indexOf('micromessenger') !== -1)  {
        //     // 是微信浏览器
        //     if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
        //         if( ua.indexOf('mobile') === -1){
        //             router.push(`/worktree/Communication?id=${location.query.id}`);
        //         }else{
        //             dispatch({
        //                 type: 'communication/fetch',
        //                 payload: {
        //                     exceptionId: location.query.id,
        //                 },
        //             });
        //         }
        //     }
        // } else   if (
        //     isNotBlank(location) &&
        //     isNotBlank(location.query) &&
        //     isNotBlank(location.query.id)
        // ) {
        //     router.push(`/worktree/Communication?id=${location.query.id}`);
        // }
    }

    onReplyClick = (e, item) => {
        e.preventDefault();
        if (
            isNotBlank(item) &&
            isNotBlank(item.createBy) &&
            isNotBlank(item.createBy.id) &&
            isNotBlank(item.createBy.name)
        ) {
            this.setState({
                replyUserId: item.createBy.id,
                replyUserName: `@${item.createBy.name}`,
                replyItem: item,
                parentId: item.id,
                isShowClickInput: item.id,
            });
        } else {
            this.setState({
                replyItem: item,
                isShowClickInput: item.id,
            });
        }
    };
    onClickReply() {
        const { replyOfClick, parentId, replyItem } = this.state;
        const { dispatch } = this.props;
        if (isNotBlank(replyOfClick)) {
            dispatch({
                type: 'communication/addcommrecoed',
                payload: {
                    exceptionId: replyItem.exceptionId,
                    commInfo: replyOfClick,
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
                        replyOfClick: '',
                        isShowClickInput: '',
                    });
                },
            });
        } else {
            Toast.info('请输入评论内容', 1);
        }
    }

    onReplyClickTWO = (e, item) => {
        e.preventDefault();
        if (
            isNotBlank(item) &&
            isNotBlank(item.createBy) &&
            isNotBlank(item.createBy.id) &&
            isNotBlank(item.createBy.name)
        ) {
            this.setState({
                replyUserIdTWO: item.createBy.id,
                replyUserNameTWO: `@${item.createBy.name}`,
                replyOfClickTWO: `@${item.createBy.name}`,
                replyItemTWO: item,
                isShowClickInputTWO: item.id,
                parentId: item.parentId,
            });
        }
    };
    confirmAddcommun = () => {
        //  直接提交评论@人员
        const { dispatch } = this.props;
        const { replyInfo, mentionsNameArray, mentionsIdArray, exceptionId } = this.state;
        if (isNotBlank(replyInfo)) {
            let mentionsIdArr = [];
            let mentions = '';
            if (isNotBlank(mentionsIdArray) && mentionsIdArray.length > 0) {
                for (
                    let i = 0;
                    mentionsNameArray.length > 0 && i < mentionsNameArray.length;
                    i += 1
                ) {
                    if (
                        isNotBlank(mentionsNameArray[i]) &&
                        replyInfo.indexOf(mentionsNameArray[i]) > -1
                    ) {
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
            Toast.info('请输入评论内容', 1);
        }
    };

    onClickFile = file => {
        window.open(getFullUrl(file));
    };

    handleComm = msg => {
        const { location } = this.props;
        if (isNotBlank(location) && isNotBlank(location.query) && isNotBlank(location.query.id)) {
            router.push(`/wx/dispose_form?msg=${msg}&id=${location.query.id}`);
        }
    };

    onChangeOfClick(e) {
        let value = e.target.value;
        this.setState({
            replyOfClick: e.target.value,
            initShowInput: false,
        });
        if (!value) {
            this.setState({
                initShowInput: true,
            });
        }
    }
    onChangeOfClickTWO(e) {
        let valueTWO = e.target.value;
        this.setState({
            replyOfClickTWO: e.target.value,
            initShowInputTWO: false,
        });
        if (!valueTWO) {
            this.setState({
                initShowInputTWO: true,
            });
        }
    }
    onClickReplyTWO() {
        // 二级评论
        const { dispatch } = this.props;
        const { replyOfClickTWO, replyItemTWO, replyUserIdTWO, parentId } = this.state;
        if (isNotBlank(replyOfClickTWO)) {
            dispatch({
                type: 'communication/addcommrecoed',
                payload: {
                    exceptionId: replyItemTWO.exceptionId,
                    commInfo: replyOfClickTWO,
                    mentions: replyUserIdTWO,
                    parentId: parentId,
                },
                callback: () => {
                    dispatch({
                        type: 'communication/fetch',
                        payload: { exceptionId: replyItemTWO.exceptionId },
                    });
                    this.setState({
                        replyUserId: '',
                        replyUserName: '',
                        replyItemTWO: {},
                        replyOfClickTWO: '',
                        isShowClickInputTWO: '',
                        parentId: '',
                    });
                },
            });
        } else {
            Toast.info('请输入评论内容', 1);
        }
    }
    handleCancla() {
        this.setState({
            isShowClickInput: '',
        });
    }
    handleCanclaTWO() {
        this.setState({
            isShowClickInputTWO: '',
        });
    }
    handleMentionsTextAreachange(value) {
        // 文本框内容变化回调
        this.setState({
            replyInfo: value,
        });
    }
    onMentionsSelect = option => {
        const { mentionsNameArray, mentionsIdArray } = this.state;
        this.setState({
            mentionsNameArray: [...mentionsNameArray, `@${option.value}`],
            mentionsIdArray: [...mentionsIdArray, option.id],
        });
    };
    click_down() {
        const { isdisplaycomm } = this.state;
        this.setState({
            isdisplaycomm: true,
        });
    }
    click_up() {
        const { isdisplaycomm } = this.state;
        this.setState({
            isdisplaycomm: false,
        });
    }
    click_down_son() {
        this.setState({
            isdisplaycommson: true,
        });
    }
    click_up_son() {
        this.setState({
            isdisplaycommson: false,
        });
    }
    deepcopytwo(obj) {
        var newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        }
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ? this.deepcopytwo(obj[i]) : obj[i];
        }
        return newobj;
    }
    handleShowAllcomm(length, id) {
        const { flagId } = this.state;
        let newarr = this.deepcopytwo(flagId);
        if (newarr.indexOf(id) > -1) {
        } else {
            newarr.push(id);
        }
        this.setState({ showmorecomm: length, flagId: newarr });
        this.forceUpdate();
    }

    handleClosecomm(length, item) {
        const { flagId } = this.state;
        let id = item.id;
        let newarr = this.deepcopytwo(flagId);
        newarr.splice(flagId.indexOf(id), 1);
        this.setState({ showmorecomm: 3, flagId: newarr });
        this.forceUpdate();
    }

    render() {
        const { loading, communicationData } = this.props;
        const {
            replyInfo,
            replyOfClick,
            isShowClickInput,
            isShowClickInputTWO,
            replyOfClickTWO,
            initShowInput,
            initShowInputTWO,
            showcommAll,
            isdisplaycomm,
            isdisplaycommson,
            showmorecomm,
            flagId,
        } = this.state;

        return (
            <div className={styles.page}>
                <div className={styles.imputMsg}>
                    <Mentions
                        className={styles.header_search}
                        value={replyInfo}
                        onChange={e => this.handleMentionsTextAreachange(e)}
                        rows="1"
                        onSelect={this.onMentionsSelect}
                        placeholder="请输入信息,使用@圈出人员"
                    >
                        {isNotBlank(this.state.tableData) &&
                            isNotBlank(this.state.tableData.list) &&
                            this.state.tableData.list.map(item => (
                                <Option
                                    value={`${item.name}(${item.mobile})`}
                                    key={item.id}
                                    id={item.id}
                                >
                                    {`${item.name}(${item.mobile})`}
                                </Option>
                            ))}
                    </Mentions>
                    <div className={styles.reply_button} onClick={() => this.confirmAddcommun()}>
                        快速回复
                    </div>
                </div>
                <div style={{ paddingTop: '56px' }}>
                    <List className={styles.my_list}>
                        {isNotBlank(communicationData) &&
                            communicationData.length > 0 &&
                            communicationData.map((item, index) => (
                                <div className={styles.item_laytout} key={index}>
                                    <div className={styles.item_info_laytout}>
                                        <div className={styles.item_user_layout}>
                                            <img
                                                src={
                                                    isNotBlank(item) &&
                                                    isNotBlank(item.createBy) &&
                                                    isNotBlank(item.createBy.photo)
                                                        ? getFullUrl(item.createBy.photo)
                                                        : ''
                                                }
                                                alt=""
                                                style={{
                                                    height: '26px',
                                                    width: '26px',
                                                    borderRadius: '2px',
                                                    margin: 'auto',
                                                    marginRight: '13px',
                                                }}
                                            />
                                            <div className={styles.info_msg_layout}>
                                                <div className={styles.user_name}>
                                                    {isNotBlank(item) &&
                                                    isNotBlank(item.createBy) &&
                                                    isNotBlank(item.createBy.name)
                                                        ? item.createBy.name
                                                        : ''}
                                                </div>
                                                <div className={styles.user_time}>
                                                    {isNotBlank(item.createDate)
                                                        ? moment(item.createDate).format(
                                                              'YYYY-MM-DD   HH:mm:ss'
                                                          )
                                                        : ''}
                                                </div>
                                            </div>
                                            <img
                                                src={comm_img}
                                                alt=""
                                                style={{
                                                    height: '26px',
                                                    width: '26px',
                                                    margin: 'auto',
                                                }}
                                                onClick={e => this.onReplyClick(e, item)}
                                            />
                                        </div>

                                        {isNotBlank(item.commInfo) && (
                                            <>
                                                <div
                                                    className={
                                                        isdisplaycomm
                                                            ? classnames(styles.isdisplaynone)
                                                            : ''
                                                    }
                                                >
                                                    <span className={styles.info_msg_other_all}>
                                                        {item.commInfo}
                                                    </span>
                                                    {judgeLen(item.commInfo) > 34 ? (
                                                        <a
                                                            onClick={() => this.click_down()}
                                                            className={styles.downcss}
                                                        >
                                                            展开
                                                        </a>
                                                    ) : null}
                                                </div>
                                                <div
                                                    className={
                                                        isdisplaycomm
                                                            ? classnames(styles.info_msg_other)
                                                            : classnames(
                                                                  styles.info_msg_other,
                                                                  styles.isdisplaynone
                                                              )
                                                    }
                                                >
                                                    {item.commInfo}
                                                    {judgeLen(item.commInfo) > 34 ? (
                                                        <a
                                                            onClick={() => this.click_up()}
                                                            className={styles.upcss}
                                                        >
                                                            收起
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </>
                                        )}

                                        {isNotBlank(item.respType) && (
                                            <div className={styles.info_msg_other}>
                                                责任分类：&nbsp; {item.respType}
                                            </div>
                                        )}
                                        {isNotBlank(item.respDept) && (
                                            <div className={styles.info_msg_other}>
                                                责任部门：&nbsp; {item.respDept}
                                            </div>
                                        )}
                                        {isNotBlank(item.followDept) && (
                                            <div className={styles.info_msg_other}>
                                                跟进部门：&nbsp; {item.followDept}
                                            </div>
                                        )}
                                        {isNotBlank(item.estiCompTime) && (
                                            <div className={styles.info_msg_other}>
                                                预计完成：&nbsp;{' '}
                                                {moment(item.estiCompTime).format('YYYY-MM-DD')}
                                            </div>
                                        )}

                                        {isNotBlank(item) &&
                                        isNotBlank(item.accessorys) &&
                                        item.accessorys.length > 0 ? (
                                            <div className={styles.file_list_layout}>
                                                {item.accessorys.map(file => (
                                                    <div
                                                        className={styles.file_item}
                                                        onClick={() => this.onClickFile(file.path)}
                                                    >
                                                        <img
                                                            src={fileImg}
                                                            alt=""
                                                            className={styles.item_file_img}
                                                        />
                                                        <div className={styles.item_path}>
                                                            {isNotBlank(file.path)
                                                                ? file.path.substring(
                                                                      file.path.lastIndexOf('/') + 1
                                                                  )
                                                                : ''}
                                                        </div>
                                                        <img
                                                            src={moreFile}
                                                            alt=""
                                                            style={{
                                                                height: '16px',
                                                                width: '12px',
                                                                margin: 'auto',
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {isShowClickInput == item.id ? (
                                            <div className={styles.imputMsg_click}>
                                                <Input
                                                    value={replyOfClick}
                                                    placeholder="请输入回复内容"
                                                    className={styles.header_search}
                                                    onChange={e => {
                                                        this.onChangeOfClick(e);
                                                    }}
                                                />
                                                {
                                                    <>
                                                        {initShowInput ? (
                                                            <div
                                                                className={styles.reply_button}
                                                                onClick={() => this.handleCancla()}
                                                            >
                                                                取消
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className={styles.reply_button}
                                                                onClick={() => this.onClickReply()}
                                                            >
                                                                提交
                                                            </div>
                                                        )}
                                                    </>
                                                }
                                            </div>
                                        ) : (
                                            ''
                                        )}

                                        {isNotBlank(item) &&
                                        isNotBlank(item.children) &&
                                        item.children.length > 0
                                            ? item.children.map((items, childrenIndex) => {
                                                  let length_comm = 3;
                                                  if (
                                                      item.children.length > 3 &&
                                                      this.state.flagId.indexOf(item.id) > -1
                                                  ) {
                                                      length_comm = item.children.length;
                                                  }
                                                  if (childrenIndex < length_comm) {
                                                      return (
                                                          <div
                                                              className={styles.reply_object}
                                                              key={childrenIndex}
                                                          >
                                                              <div
                                                                  className={
                                                                      styles.item_user_layout
                                                                  }
                                                              >
                                                                  <div>
                                                                      <img
                                                                          src={
                                                                              isNotBlank(items) &&
                                                                              isNotBlank(
                                                                                  items.createBy
                                                                              ) &&
                                                                              isNotBlank(
                                                                                  items.createBy
                                                                                      .photo
                                                                              )
                                                                                  ? getFullUrl(
                                                                                        items
                                                                                            .createBy
                                                                                            .photo
                                                                                    )
                                                                                  : ''
                                                                          }
                                                                          alt=""
                                                                          style={{
                                                                              height: '30px',
                                                                              width: '30px',
                                                                              borderRadius: '2px',
                                                                              margin: 'auto',
                                                                              marginRight: '13px',
                                                                          }}
                                                                          onClick={e => {
                                                                              this.onReplyClickTWO(
                                                                                  e,
                                                                                  items
                                                                              );
                                                                          }}
                                                                      />
                                                                  </div>
                                                                  <div className={styles.right_son}>
                                                                      <div
                                                                          className={
                                                                              styles.info_msg_layout_son
                                                                          }
                                                                      >
                                                                          <div
                                                                              className={
                                                                                  styles.user_name_quteinfo
                                                                              }
                                                                          >
                                                                              {isNotBlank(items) &&
                                                                              isNotBlank(items) &&
                                                                              isNotBlank(
                                                                                  items.createBy
                                                                              ) &&
                                                                              isNotBlank(
                                                                                  items.createBy
                                                                                      .name
                                                                              )
                                                                                  ? items.createBy
                                                                                        .name
                                                                                  : ''}
                                                                          </div>
                                                                          <div
                                                                              className={
                                                                                  styles.user_time
                                                                              }
                                                                          >
                                                                              {isNotBlank(items) &&
                                                                              isNotBlank(
                                                                                  items.createDate
                                                                              )
                                                                                  ? moment(
                                                                                        items.createDate
                                                                                    ).format(
                                                                                        'YYYY-MM-DD  HH:mm:ss'
                                                                                    )
                                                                                  : ''}
                                                                          </div>
                                                                      </div>

                                                                      <div
                                                                          className={
                                                                              isdisplaycommson
                                                                                  ? classnames(
                                                                                        styles.isdisplaynone,
                                                                                        styles.info_con
                                                                                    )
                                                                                  : classnames(
                                                                                        styles.info_con
                                                                                    )
                                                                          }
                                                                      >
                                                                          <span
                                                                              className={classnames(
                                                                                  styles.info_msg
                                                                              )}
                                                                          >
                                                                              {isNotBlank(items) &&
                                                                              isNotBlank(
                                                                                  items.commInfo
                                                                              )
                                                                                  ? items.commInfo
                                                                                  : ''}
                                                                          </span>
                                                                          {judgeLen(
                                                                              items.commInfo
                                                                          ) > 20 ? (
                                                                              <a
                                                                                  onClick={() =>
                                                                                      this.click_down_son()
                                                                                  }
                                                                                  className={
                                                                                      styles.downcss_son
                                                                                  }
                                                                              >
                                                                                  展开
                                                                              </a>
                                                                          ) : null}
                                                                      </div>
                                                                      <div
                                                                          className={
                                                                              isdisplaycommson
                                                                                  ? classnames(
                                                                                        styles.info_msg_son
                                                                                    )
                                                                                  : classnames(
                                                                                        styles.info_msg_son,
                                                                                        styles.isdisplaynone
                                                                                    )
                                                                          }
                                                                      >
                                                                          <span
                                                                              className={classnames(
                                                                                  styles.info_msg_son
                                                                              )}
                                                                          >
                                                                              {isNotBlank(items) &&
                                                                              isNotBlank(
                                                                                  items.commInfo
                                                                              )
                                                                                  ? items.commInfo
                                                                                  : ''}
                                                                          </span>
                                                                          {judgeLen(
                                                                              items.commInfo
                                                                          ) > 20 ? (
                                                                              <a
                                                                                  onClick={() =>
                                                                                      this.click_up_son()
                                                                                  }
                                                                                  className={
                                                                                      styles.upcss
                                                                                  }
                                                                              >
                                                                                  收起
                                                                              </a>
                                                                          ) : null}
                                                                      </div>
                                                                  </div>
                                                              </div>

                                                              {isShowClickInputTWO == items.id ? (
                                                                  <div
                                                                      className={
                                                                          styles.imputMsg_click
                                                                      }
                                                                  >
                                                                      <Input
                                                                          value={replyOfClickTWO}
                                                                          placeholder="请输入回复内容"
                                                                          className={
                                                                              styles.header_search
                                                                          }
                                                                          onChange={e => {
                                                                              this.onChangeOfClickTWO(
                                                                                  e
                                                                              );
                                                                          }}
                                                                      />
                                                                      {initShowInputTWO ? (
                                                                          <div
                                                                              className={
                                                                                  styles.reply_button
                                                                              }
                                                                              onClick={() =>
                                                                                  this.handleCanclaTWO()
                                                                              }
                                                                          >
                                                                              取消
                                                                          </div>
                                                                      ) : (
                                                                          <div
                                                                              className={
                                                                                  styles.reply_button
                                                                              }
                                                                              onClick={() =>
                                                                                  this.onClickReplyTWO()
                                                                              }
                                                                          >
                                                                              提交
                                                                          </div>
                                                                      )}
                                                                  </div>
                                                              ) : (
                                                                  ''
                                                              )}
                                                          </div>
                                                      );
                                                  }
                                              })
                                            : null}

                                        {isNotBlank(item) &&
                                        isNotBlank(item.children) &&
                                        item.children.length > 3 &&
                                        flagId.indexOf(item.id) < 0 ? (
                                            <div style={{ width: '100%', height: '100%' }}>
                                                <div className={styles.comm_box}>
                                                    <a
                                                        onClick={() =>
                                                            this.handleShowAllcomm(
                                                                item.children.length,
                                                                item.id
                                                            )
                                                        }
                                                        className={styles.showmorecomm_box}
                                                    >
                                                        展示所有评论
                                                    </a>
                                                    <img
                                                        src={down_img}
                                                        className={styles.down_img_css}
                                                    />
                                                </div>
                                            </div>
                                        ) : isNotBlank(item) &&
                                          isNotBlank(item.children) &&
                                          item.children.length > 3 &&
                                          flagId.indexOf(item.id) > -1 ? (
                                            <div style={{ textAlign: 'center' }}>
                                                <a
                                                    onClick={() =>
                                                        this.handleClosecomm(
                                                            item.children.length,
                                                            item
                                                        )
                                                    }
                                                >
                                                    收起
                                                </a>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className={styles.division} />
                                </div>
                            ))}
                        <div className={styles.button_layout}>
                            <Button
                                type="primary"
                                className={styles.button_item}
                                onClick={() => {
                                    this.handleComm('comm');
                                }}
                            >
                                异常处理
                            </Button>
                            <Button
                                type="primary"
                                className={styles.button_item}
                                onClick={() => {
                                    this.handleComm('colse');
                                }}
                            >
                                关闭异常
                            </Button>
                        </div>
                    </List>
                </div>
            </div>
        );
    }
}
export default DisposeWeUi;
