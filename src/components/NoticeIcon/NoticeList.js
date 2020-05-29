import React from 'react';
import { Avatar, List ,Tag} from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';

export default function NoticeList({
  data = [],
  onClick,
  onClear,
  title,
  locale,
  emptyText,
  emptyImage,
  onViewMore = null,
  showClear = true,
  showViewMore = false,
}) {
   console.log("数据--->>,",data)
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar className={styles.avatar} src={item.avatar} />
            ) : (
              <span className={styles.iconElement}>{item.avatar}</span>
            )
          ) : null;

          return (
            <List.Item className={itemCls} key={item.id || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {item.orderSelfNum}  
                    <div className={styles.extra}>
                      {item.warringType == '1' ? <Tag color="#f50">一级预警</Tag> : item.warringType == '2' ? <Tag color="orange">延迟</Tag> : ''}
                    </div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description} title={item.description}>
                      车间:&nbsp;  {item.deptName}
                    </div>
                    <div className={styles.description}>
                      二级品类:&nbsp; {item.secondCategoryName } 
                     </div>
                    <div className={styles.datetime}>{item.createDate}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      {/* <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {locale.clear} {locale[title] || title}
          </div>
        ) : null}
        {showViewMore ? <div onClick={onViewMore}>{locale.viewMore}</div> : null}
      </div> */}
    </div>
  );
}
