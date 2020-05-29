import {stringify, parse } from 'qs';

export function setDateStorage(key, value) {
  localStorage.removeItem(key);
  const isObject = value instanceof Object;
  const  time = new Date(new Date().toLocaleDateString()).getTime();
  const  age = 1 * 24 * 60 * 60 * 1000;
  let values=value;
  // 如果不是对象，新建一个对象把 value 存起来
  if (!isObject) {
    const b = value;
    values = {};
    values.data = b;
  }
  // 加入时间
  values.time = time;
  // 过期时间
  values.age = time + age;
  // 是否一个对象
  values.isObject = isObject;
  localStorage.setItem(key, stringify(values));
}
/**
 * 判断一个 localStorage 是否过期
 * @param key
 * @returns {boolean}
 */
function isExpire(key) {
  let isExpires = true;
  const value = localStorage.getItem(key);
  const  now = new Date().getTime();
  if (value) {
  const values = parse(value);
    // 当前时间是否大于过期时间
    isExpires = now > values.age;
  } else {
    // 没有值也是过期
  }
  return isExpires;
}
/**
 * 获取某个 localStorage 值
 * @param key
 * @returns {*}
 */
export function getDateStorage(key) {
  const isExpires = isExpire(key);
  if (!isExpires) {
    const values = localStorage.getItem(key);
    const val = parse(values);
    if (!val.isObject || val.isObject==="false") {
      return val.data;
    }
  }
  return null;
}
