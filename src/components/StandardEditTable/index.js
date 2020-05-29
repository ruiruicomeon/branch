/**
 * 封装可编辑列表
 */

import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Alert,
  InputNumber,
  Input,
  Form,
  Popconfirm,
  Divider,
  Select,
  DatePicker,
} from 'antd';
import styles from './index.less';
import moment from 'moment';
import { isNotBlank } from '@/utils/utils';

const { Option } = Select;

const EditableContext = React.createContext();

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

// 需要替换编辑table框   根据修改状态editing判断改成form编辑
class EditableCell extends React.Component {
  getInput = () => {
    // 判断文本类型  不同的控件
    const { inputType, inputinfo } = this.props;

    if (inputType === 'dateTime') {
      return <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />;
    }
    if (inputType === 'selectMultiple') {
      return (
        <Select style={{ width: '100%' }} mode="multiple">
          {isNotBlank(inputinfo) &&
            inputinfo.length > 0 &&
            inputinfo.map(item => (
              <Option value={item.value || `${item.value}`} key={item.value || `${item.value}`}>
                {item.label}
              </Option>
            ))}
        </Select>
      );
    }
    if (inputType === 'select') {
      return (
        <Select style={{ width: '100%' }}>
          {isNotBlank(inputinfo) &&
            inputinfo.length > 0 &&
            inputinfo.map(item => (
              <Option value={item.value || `${item.value}`} key={item.value || `${item.value}`}>
                {item.label}
              </Option>
            ))}
        </Select>
      );
    }
    if (inputType === 'number') {
      return <InputNumber style={{ width: '100%' }} />;
    }
    return <Input style={{ width: '100%' }} />;
  };

  inputinfo = () => {
    const { inputType, record, dataIndex } = this.props;
    const REdata = record[dataIndex];
    if (inputType === 'dateTime') {
      if (isNotBlank(REdata)) {
        return moment(REdata, 'YYYY-MM-DD HH:mm');
      }
      return null;
    }
    if (inputType === 'selectMultiple') {
      if (isNotBlank(REdata)) {
        return `${REdata}`.split(',');
      }
      return [];
    }
    if (isNotBlank(REdata)) {
      return REdata;
    }
    return '';
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing, // 是否可编辑状态
      dataIndex, // 字段名称  做上传和获取参数
      title, // 名称
      inputType, // 数据类型
      record, // 当前编辑列数据  数组
      inputMust,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: isNotBlank(inputMust) && inputMust === false ? false : !false,
                  message: `请输入${title}!`,
                },
              ],
              initialValue: this.inputinfo(),
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

@Form.create()
class StandardEditTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
      editingKey: '',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (
      isNotBlank(nextProps) &&
      isNotBlank(nextProps.selectedRows) &&
      nextProps.selectedRows.length === 0
    ) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRowKeys);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  isEditing = record => {
    const { editingKey } = this.state;
    if (isNotBlank(record) && isNotBlank(editingKey)) {
      return (record.key || record.id) === editingKey;
    }
    return false;
  };

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save = (form, key) => {
    const { onSaveData } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if (onSaveData) {
        onSaveData(key, row);
      }
      this.setState({ editingKey: '' });
    });
  };

  edit = key => {
    this.setState({ editingKey: key });
  };

  render() {
    const { selectedRowKeys, needTotalList, editingKey } = this.state;
    const { pageSizeFalse, data = {}, rowKey, columns, form, ...rest } = this.props;
    const { list = [], pagination, msg } = data;

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columnsVal = [
      // {
      //   title: '编辑单行',
      //   width: 120,
      //   render: (text, record) => {
      //     const editable = this.isEditing(record);
      //     return editable ? (
      //       <span>
      //         <EditableContext.Consumer>
      //           {() => <a onClick={() => this.save(form, record.id || record.key)}>保存</a>}
      //         </EditableContext.Consumer>
      //         <Divider type="vertical" />
      //         <Popconfirm
      //           title="是否取消修改?"
      //           onConfirm={() => this.cancel(record.id || record.key)}
      //         >
      //           <a>取消</a>
      //         </Popconfirm>
      //       </span>
      //     ) : (
      //       <span>
      //         <a disabled={editingKey !== ''} onClick={() => this.edit(record.id || record.key)}>
      //           编辑
      //         </a>
      //       </span>
      //       );
      //   },
      // },
      ...columns,
    ];

    // 判断类型并且传递数据到编辑组件
    const columnsTable = columnsVal.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record, // 当前列数据
          inputType: col.inputType, // 设置需要的组件类型
          dataIndex: col.dataIndex, // 字段名
          inputinfo: col.inputinfo, // 如果需要选择则有选择的数据源
          inputMust: col.inputMust, // 字段是否必须输入
          title: col.title, // 显示名
          editing: this.isEditing(record), // 是否可编辑
        }),
      };
    });

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '50', '100','200','500'],
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    const map = () => {
      needTotalList.map(item => (
        <span style={{ marginLeft: 8 }} key={item.dataIndex}>
          {item.title}
          总计&nbsp;
          <span style={{ fontWeight: 600 }}>
            {item.render ? item.render(item.total) : item.total}
          </span>
        </span>
      ));
    };

    const tableAlert = (
      <div className={styles.tableAlert}>
        <Alert
          message={
            <Fragment>
              {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? '总条数 ' : null}
              {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? (
                <a style={{ fontWeight: 600 }}>
                  {isNotBlank(paginationProps) &&
                    isNotBlank(paginationProps.total) &&
                    parseInt(paginationProps.total, 10) > 0
                    ? paginationProps.total
                    : '0'}
                </a>
              ) : null}
              {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? ' 条' : null}
              &nbsp;&nbsp;
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll'
                ? '已选择 '
                : null}
              {isNotBlank(rest) &&
                isNotBlank(rest.selectedRows) &&
                rest.selectedRows !== 'nullAll' ? (
                  <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>
                ) : null}
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll'
                ? ' 项 '
                : null}
              &nbsp;&nbsp;
              {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll'
                ? map()
                : null}
              {isNotBlank(msg) &&
                isNotBlank(rest) &&
                isNotBlank(rest.selectedRows) &&
                rest.selectedRows !== 'nullAll'
                ? msg
                : ''}
              {isNotBlank(rest) &&
                isNotBlank(rest.selectedRows) &&
                rest.selectedRows !== 'nullAll' ? (
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                ) : null}
            </Fragment>
          }
          type="info"
          showIcon
        />
      </div>
    );
    return (
      <div className={styles.standardTable}>
        {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? tableAlert : ''}
        <EditableContext.Provider value={form}>
          <Table
            components={components}
            rowKey={rowKey || 'id'}
            rowSelection={
              isNotBlank(rowSelection) &&
                isNotBlank(rest) &&
                isNotBlank(rest.selectedRows) &&
                rest.selectedRows !== 'nullAll'
                ? rowSelection
                : null
            }
            dataSource={list}
            columns={columnsTable || []}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            rowClassName="editable-row"
            {...rest}
          />
        </EditableContext.Provider>
      </div>
    );
  }
}

export default StandardEditTable;
