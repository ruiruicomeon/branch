import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, Popconfirm, Select, DatePicker, TreeSelect, InputNumber } from 'antd';
import moment from 'moment';
import { isNotBlank } from '@/utils/utils';
import isEqual from 'lodash/isEqual';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      alias: '',
      name: '',
      index: '',
      value: '',
      jdbcType: '',
      queryType: '',
      value2: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;

    const { onChange } = this.props;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      if (fieldName === "value") {
        target.value2 = "";
      }
      this.setState({ data: newData });
      onChange(newData);
    }
  }

  handleIndexFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const { onChange, searchList } = this.props;
    let columnSearchList = [];
    if (isNotBlank(searchList) && isNotBlank(searchList.columnList) && searchList.columnList.length > 0) {
      columnSearchList = searchList.columnList
    }
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      target.name = columnSearchList[e].name;
      target.jdbcType = columnSearchList[e].jdbcType;
      target.alias = columnSearchList[e].alias;
      target.queryType = "等于";
      target.value = null;
      target.value2 = null;
      this.setState({ data: newData });
      onChange(newData);
    }
  }

  handleRangeFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const { onChange } = this.props;

    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (isNotBlank(e) && e.length === 2) {
        target[fieldName] = moment(e[0]).format("YYYY-MM-DD HH:mm");
        target.value2 = moment(e[1]).format("YYYY-MM-DD HH:mm");
      }
      this.setState({ data: newData });
      onChange(newData);
    }
  }


  render() {
    const { searchList } = this.props;
    let columnSearchList = [];
    if (isNotBlank(searchList) && isNotBlank(searchList.columnList) && searchList.columnList.length > 0) {
      columnSearchList = searchList.columnList
    }
    const columns = [
      {
        title: '字段',
        dataIndex: 'index',
        key: 'index',
        width: '20%',
        render: (text, record) => {
          return (
            <Select
              value={text}
              style={{ width: '100%' }}
              placeholder="字段名"
              onChange={e => this.handleIndexFieldChange(e, 'index', record.key)}
            >
              {
                isNotBlank(columnSearchList) && columnSearchList.length > 0 && columnSearchList.map((item, index) => (
                  <Option key={item.name} value={index}>{item.comments}</Option>
                ))
              }
            </Select>
          );
        },
      },
      {
        title: '关系类型',
        dataIndex: 'queryType',
        key: 'queryType',
        width: '20%',
        render: (text, record) => {
          return (
            <Select
              value={isNotBlank(record) && isNotBlank(record.index) ? text : ''}
              disabled={isNotBlank(record) && isNotBlank(record.index) ? false : !false}
              style={{ width: '100%' }}
              placeholder="关系类型"
              onChange={e => this.handleFieldChange(e, 'queryType', record.key)}
            >
              {isNotBlank(record) && isNotBlank(record.index) && isNotBlank(columnSearchList) && columnSearchList.length > 0 &&
                isNotBlank(columnSearchList[record.index]) && isNotBlank(columnSearchList[record.index].listType) && columnSearchList[record.index].listType.length > 0 &&
                columnSearchList[record.index].listType.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))
              }
            </Select>
          );
        },
      },
      {
        title: '值',
        dataIndex: 'value',
        key: 'value',
        width: '40%',
        render: (text, record) => {
          if (isNotBlank(record) && isNotBlank(record.index)) {
            if (isNotBlank(record.jdbcType) && record.jdbcType.indexOf("datetime") > -1) {
              if (isNotBlank(record.queryType) && record.queryType.indexOf("区间") > -1) {
                return (
                  <RangePicker
                    value={isNotBlank(record) && isNotBlank(record.index) && isNotBlank(text) && isNotBlank(record.value2) ? [moment(text, "YYYY-MM-DD HH:mm"), moment(record.value2, "YYYY-MM-DD HH:mm")] : []}
                    disabled={isNotBlank(record) && isNotBlank(record.index) ? false : !false}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY/MM/DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                    style={{ width: '100%' }}
                    ranges={{
                      今日: [moment().startOf('day'), moment().endOf('day')],
                      本周: [moment().startOf('week'), moment().endOf('week')],
                      本月: [moment().startOf('month'), moment().endOf('month')],
                      全年: [moment().startOf('year'), moment().endOf('year')],
                    }}
                    onChange={e => this.handleRangeFieldChange(e, 'value', record.key)}
                  />
                )
              }
              // 是时间选择
              return (
                <DatePicker
                  defaultValue={isNotBlank(record) && isNotBlank(record.index) && isNotBlank(text) ? moment(text, "YYYY-MM-DD HH:mm") : null}
                  disabled={isNotBlank(record) && isNotBlank(record.index) ? false : !false}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择时间"
                  onChange={e => this.handleFieldChange(moment(e).format("YYYY-MM-DD HH:mm"), 'value', record.key)}
                />
              )
            }
            if (isNotBlank(record) && isNotBlank(record.index) && isNotBlank(columnSearchList) && columnSearchList.length > 0 &&
              isNotBlank(columnSearchList[record.index]) && isNotBlank(columnSearchList[record.index].list) && columnSearchList[record.index].list.length > 0) {
              return (
                <TreeSelect
                  style={{ width: 300 }}
                  value={isNotBlank(record) && isNotBlank(record.index) && isNotBlank(text) ? text : ''}
                  disabled={isNotBlank(record) && isNotBlank(record.index) ? false : !false}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={columnSearchList[record.index].list}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  onChange={e => this.handleFieldChange(e, 'value', record.key)}
                />
              )
            }
            if (isNotBlank(record.jdbcType) && record.jdbcType.indexOf("int") > -1) {
              return (
                <InputNumber
                  min={0}
                  disabled={isNotBlank(record) && isNotBlank(record.index) ? false : !false}
                  value={isNotBlank(record) && isNotBlank(record.index) && isNotBlank(text) ? text : ''}
                  onChange={e => this.handleFieldChange(e, 'value', record.key)}
                  placeholder="值"
                />
              )
            }
          }

          return (
            <Input
              disabled={isNotBlank(record) && isNotBlank(record.index) ? false : !false}
              value={isNotBlank(record) && isNotBlank(record.index) ? text : ''}
              onChange={e => this.handleFieldChange(e.target.value, 'value', record.key)}
              placeholder="值"
            />
          );

        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          return (
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          bordered
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增过滤
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
