// import React, { PureComponent, Fragment } from 'react';
// import { Table, Alert } from 'antd';
// import styles from './index.less';
// import { isNotBlank } from '@/utils/utils';

// function initTotalList(columns) {
//   const totalList = [];
//   columns.forEach(column => {
//     if (column.needTotal) {
//       totalList.push({ ...column, total: 0 });
//     }
//   });
//   return totalList;
// }

// class StandardTable extends PureComponent {
//   constructor(props) {
//     super(props);
//     const { columns } = props;
//     const needTotalList = initTotalList(columns);

//     this.state = {
//       selectedRowKeys: [],
//       needTotalList,
//     };
//   }

//   static getDerivedStateFromProps(nextProps) {
//     // clean state
//     if (
//       isNotBlank(nextProps) &&
//       isNotBlank(nextProps.selectedRows) &&
//       nextProps.selectedRows.length === 0
//     ) {
//       const needTotalList = initTotalList(nextProps.columns);
//       return {
//         selectedRowKeys: [],
//         needTotalList,
//       };
//     }
//     return null;
//   }

//   handleRowSelectChange = (selectedRowKeys, selectedRows) => {
//     let { needTotalList } = this.state;
//     needTotalList = needTotalList.map(item => ({
//       ...item,
//       total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
//     }));
//     const { onSelectRow } = this.props;
//     if (onSelectRow) {
//       onSelectRow(selectedRowKeys);
//     }

//     this.setState({ selectedRowKeys, needTotalList });
//   };

//   handleTableChange = (pagination, filters, sorter) => {
//     const { onChange } = this.props;
//     if (onChange) {
//       onChange(pagination, filters, sorter);
//     }
//   };

//   cleanSelectedKeys = () => {
//     this.handleRowSelectChange([], []);
//   };

//   render() {
//     const { selectedRowKeys, needTotalList } = this.state;
//     const { pageSizeFalse, data = {}, rowKey, ...rest } = this.props;
//     const { list = [], pagination, msg } = data;

//     const paginationProps = {
//       showSizeChanger: true,
//       showQuickJumper: true,
//       pageSizeOptions: ['10', '50', '100'],
//       ...pagination,
//     };

//     const rowSelection = {
//       selectedRowKeys,
//       onChange: this.handleRowSelectChange,
//       getCheckboxProps: record => ({
//         disabled: record.disabled,
//       }),
//     };

//     const map = () => {
//       needTotalList.map(item => (
//         <span style={{ marginLeft: 8 }} key={item.dataIndex}>
//           {item.title}
//           总计&nbsp;
//           <span style={{ fontWeight: 600 }}>
//             {item.render ? item.render(item.total) : item.total}
//           </span>
//         </span>
//       ))
//     }


//     const tableAlert = (
//       <div className={styles.tableAlert}>
//         <Alert
//           message={
//             <Fragment>
//               {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ?
//                 '总条数 ' : null}
//               {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ?
//                 <a style={{ fontWeight: 600 }}>
//                   {isNotBlank(paginationProps) &&
//                     isNotBlank(paginationProps.total) &&
//                     parseInt(paginationProps.total, 10) > 0
//                     ? paginationProps.total
//                     : '0'}
//                 </a> : null}
//               {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ?
//                 ' 条' : null}
//               &nbsp;&nbsp;
//               {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? "已选择 " : null}
//               {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> : null}
//               {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? " 项 " : null}
//               &nbsp;&nbsp;
//               {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ?
//                 map() : null}
//               {isNotBlank(msg) && isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ? msg : ''}
//               {isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll' ?
//                 <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
//                   清空
//                 </a> : null
//               }
//             </Fragment>
//           }
//           type="info"
//           showIcon
//         />
//       </div>
//     );
//     return (
//       <div className={styles.standardTable}>
//         {isNotBlank(rest) && rest.selectedRows !== 'nullAll' ? tableAlert : ''}
//         <Table
//           rowKey={rowKey || 'id'}
//           rowSelection={
//             isNotBlank(rowSelection) && isNotBlank(rest) && isNotBlank(rest.selectedRows) && rest.selectedRows !== 'nullAll'
//               ? rowSelection
//               : null
//           }
//           dataSource={list}
//           pagination={paginationProps}
//           onChange={this.handleTableChange}
//           {...rest}
//         />
//       </div>
//     );
//   }
// }

// export default StandardTable;


import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import { isNotBlank } from '@/utils/utils';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows == null) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: null,
        needTotalList,
      });
    } else if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: [],
        needTotalList,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => {
        if (parseFloat(val[item.dataIndex], 10).toString() === 'NaN') {
          return sum + 0;
        }
        return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
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

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data: { list , pagination },
      data,
      loading,
      columns,
      rowKey,
      scroll,
      size,
      defaultExpandAllRows,
    } = this.props;

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

    const isTotal = (item) =>{
      if(item.render){
          if(!isNotBlank(item.total) || item.total === 'NaN'){
            return item.render(0);
          }
          return item.render(item.total);
      }
      if(!isNotBlank(item.total) || item.total === 'NaN'){
          return 0;
      }
      return item.total;
    }

    const tableAlert = (
      <div className={styles.tableAlert}>
        <Alert
          message={
            <Fragment>
              总条数{' '}
              <a style={{ fontWeight: 600 }}>
                {isNotBlank(paginationProps) && isNotBlank(paginationProps.total) && parseInt(paginationProps.total,10) > 0
                  ? paginationProps.total
                  : '0'}
              </a>条&nbsp;&nbsp;
              已选择{' '}
              <a style={{ fontWeight: 600 }}>
                {selectedRowKeys != null && selectedRowKeys !== 'undefined'
                  ? selectedRowKeys.length
                  : ''}
              </a>{' '}
              项&nbsp;&nbsp;
              {needTotalList.map((item) => (
                <span style={{ marginLeft: 8 }} key={item.title}>
                  {item.title}总计&nbsp;
                  <span style={{ fontWeight: 600 }}>
                    {isTotal(item)}
                  </span>
                </span>
              ))}
              <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                清空
              </a>
            </Fragment>
          }
          type="info"
          showIcon
        />
      </div>
    );

    return (
      <div className={styles.standardTable}>
        {selectedRowKeys != null && selectedRowKeys !== 'undefined' ? tableAlert : null}
        <Table
          size={size}
          bordered
          scroll={scroll}
          loading={loading}
          rowKey={rowKey || 'id'}
          defaultExpandAllRows={defaultExpandAllRows}
          rowSelection={
            selectedRowKeys != null && selectedRowKeys !== 'undefined' ? rowSelection : null
          }
          dataSource={ data ? data.list : { list :[] } }
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
