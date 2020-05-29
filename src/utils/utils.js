/* eslint-disable array-callback-return */
import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

// const baseUrl = 'https://yuezym-1256524715.cos.ap-guangzhou.myqcloud.com';
// const replaceDocUrl='https://static.yuezym.com';

// const baseUrl = 'https://ddd-1259590172.cos.ap-guangzhou.myqcloud.com';
// const replaceDocUrl = 'https://ddd-1259590172.cos.ap-guangzhou.myqcloud.com';

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export function isNotBlank(val) {
    if (val != null && typeof val !== 'undefined' && val !== '') {
        return true;
    }
    return false;
}

export function jsonToFormData(inJSON, inTestJSON, inFormData, parentKey) {
    const formData = inFormData || new FormData();
    const testJSON = inTestJSON || {};
    for (const key in inJSON) {
        if (inJSON.hasOwnProperty(key)) {
            let constructedKey = key;
            if (parentKey) {
                constructedKey = `${parentKey}.${key}`;
            }
            const value = inJSON[key];
            if (value && value.constructor === {}.constructor) {
                jsonToFormData(value, testJSON, formData, constructedKey);
            } else {
                formData.append(constructedKey, inJSON[key]);
                testJSON[constructedKey] = inJSON[key];
            }
        }
    }
    return formData;
}

export function setPrice(value) {
    let price = 0;
    if (isNotBlank(value) && value > 0) {
        price = Math.round((parseFloat(value) * 100).toFixed(2));
    }
    return price;
}

export function getPrice(value) {
    if (isNotBlank(value) && value > 0) {
        return (value / 100).toFixed(2);
    }
    return value;
}

export function fileToBase64(file) {
    const reader = new FileReader();
    if (isNotBlank(file)) {
        reader.readAsDataURL(file);
        return reader.result;
    }
    return null;
}

// export function getCutOutUrl(value) {
//   if (isNotBlank(value) && value.indexOf(baseUrl) > -1) {
//     return value.replace(baseUrl, '');
//   }
//   return value;
// }

export function getFullUrl(value) {
    if (isNotBlank(value) && value.indexOf('http') < 0 && value.indexOf('https') < 0) {
        return `/api/Api${value}`;
    }
    return value;
}

// export function getReplaceUrl(value) {
//   if (isNotBlank(value) && value.indexOf(baseUrl) > -1) {
//     return value.replace(baseUrl, replaceDocUrl);
//   }
//   return value;
// }

export function getTimeDistance(type) {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === 'today') {
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }

    if (type === 'week') {
        let day = now.getDay();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        if (day === 0) {
            day = 6;
        } else {
            day -= 1;
        }

        const beginTime = now.getTime() - day * oneDay;

        return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
    }

    if (type === 'month') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const nextDate = moment(now).add(1, 'months');
        const nextYear = nextDate.year();
        const nextMonth = nextDate.month();

        return [
            moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
            moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
        ];
    }

    const year = now.getFullYear();
    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

// 去除1数组中包含2数组值返回一个数组
export function getArrDifference(arr1, arr2) {
    return arr1.filter(v => {
        if (isNotBlank(v)) {
            return arr2.indexOf(v) < 0;
        }
        return false;
    });
}

export function getPlainNode(nodeList, parentPath = '') {
    const arr = [];
    nodeList.forEach(node => {
        const item = node;
        item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
        item.exact = true;
        if (item.children && !item.component) {
            arr.push(...getPlainNode(item.children, item.path));
        } else {
            if (item.children && item.component) {
                item.exact = false;
            }
            arr.push(item);
        }
    });
    return arr;
}

export function digitUppercase(n) {
    return nzh.toMoney(n);
}

function getRelation(str1, str2) {
    if (str1 === str2) {
        console.warn('Two path are equal!'); // eslint-disable-line
    }
    const arr1 = str1.split('/');
    const arr2 = str2.split('/');
    if (arr2.every((item, index) => item === arr1[index])) {
        return 1;
    }
    if (arr1.every((item, index) => item === arr2[index])) {
        return 2;
    }
    return 3;
}

function getRenderArr(routes) {
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
        // 去重
        renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
        // 是否包含
        const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
        if (isAdd) {
            renderArr.push(routes[i]);
        }
    }
    return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
    let routes = Object.keys(routerData).filter(
        routePath => routePath.indexOf(path) === 0 && routePath !== path
    );
    // Replace path to '' eg. path='user' /user/name => name
    routes = routes.map(item => item.replace(path, ''));
    // Get the route to be rendered to remove the deep rendering
    const renderArr = getRenderArr(routes);
    // Conversion and stitching parameters
    const renderRoutes = renderArr.map(item => {
        const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
        return {
            exact,
            ...routerData[`${path}${item}`],
            key: `${path}${item}`,
            path: `${path}${item}`,
        };
    });
    return renderRoutes;
}

export function getPageQuery() {
    return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
    const search = stringify(query);
    if (search.length) {
        return `${path}?${search}`;
    }
    return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
    return reg.test(path);
}

export function formatWan(val) {
    const v = val * 1;
    if (!v || Number.isNaN(v)) return '';

    let result = val;
    if (val > 10000) {
        result = Math.floor(val / 10000);
        result = (
            <span>
                {result}
                <span
                    style={{
                        position: 'relative',
                        top: -2,
                        fontSize: 14,
                        fontStyle: 'normal',
                        marginLeft: 2,
                    }}
                >
                    万
                </span>
            </span>
        );
    }
    return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
    return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url, name) =>
    new Promise(resolve => {
        const dom = document.createElement('script');
        dom.src = url;
        dom.type = 'text/javascript';
        dom.onload = () => {
            resolve(window[name]);
        };
        document.head.appendChild(dom);
    });

export const isToday = (time1, time2) => {
    return (
        time1.getFullYear() === time2.getFullYear() &&
        time1.getMonth() === time2.getMonth() &&
        time1.getDate() === time2.getDate()
    );
};

export const isYesterday = (time1, time2) => {
    const prevDate = new Date(time1);
    prevDate.setDate(time1.getDate() - 1);
    return (
        prevDate.getFullYear() === time2.getFullYear() &&
        prevDate.getMonth() === time2.getMonth() &&
        prevDate.getDate() === time2.getDate()
    );
};

export const getHourMinute = time => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

export const getMonthDate = time => {
    return `${time.getMonth() + 1}/${time.getDate()}`;
};

export function getDateTimeStamp(dateStr) {
    return Date.parse(dateStr.replace(/-/gi, '/'));
}

export function getDateDiff(dateStr) {
    const publishTime = getDateTimeStamp(dateStr) / 1000;
    const timeNow = parseInt(new Date().getTime() / 1000, 10);

    const date = new Date(publishTime * 1000);
    const Y = date.getFullYear();
    let M = date.getMonth() + 1;
    let D = date.getDate();
    let H = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    // 小于10的在前面补0
    if (M < 10) {
        M = `0${M}`;
    }
    if (D < 10) {
        D = `0${D}`;
    }
    if (H < 10) {
        H = `0${H}`;
    }
    if (m < 10) {
        m = `0${m}`;
    }
    if (s < 10) {
        s = `0${s}`;
    }

    const d = timeNow - publishTime;
    const Ddays = parseInt(d / 86400, 10);
    const Dhours = parseInt(d / 3600, 10);
    const Dminutes = parseInt(d / 60, 10);
    const Dseconds = parseInt(d, 10);

    if (Ddays > 0 && Ddays < 3) {
        return `${Ddays}天前`;
    }
    if (Ddays <= 0 && Dhours > 0) {
        return `${Dhours}小时前`;
    }
    if (Dhours <= 0 && Dminutes > 0) {
        return `${Dminutes}分钟前`;
    }
    if (Dseconds < 60) {
        if (Dseconds <= 5) {
            return '刚刚';
        }
        return `${Dseconds}秒前`;
    }
    if (Ddays >= 3 && Ddays < 30) {
        return `${M}-${D} ${H}:${m}`;
    }
    if (Ddays >= 30) {
        return `${Y}-${M}-${D} ${H}:${m}`;
    }
    return dateStr;
}

const videoArray = [
    '.drc',
    '.dsm',
    '.dsv',
    '.dsa',
    '.dss',
    '.vob',
    '.ifo',
    '.d2v',
    '.flv',
    '.fli',
    '.flc',
    '.flic',
    '.ivf',
    '.mkv',
    '.mpg',
    '.mpeg',
    '.mpe',
    '.m1v',
    '.m2v',
    '.mpv2',
    '.mp2v',
    '.dat',
    '.ts',
    '.tp',
    '.tpr',
    '.pva',
    '.pss',
    '.mp4',
    '.m4v',
    '.m4p',
    '.m4b',
    '.3gp',
    '.3gpp',
    '.3g2',
    '.3gp2',
    '.ogm',
    '.mov',
    '.qt',
    '.amr',
    '.ratdvd',
    '.rt',
    '.rp',
    '.smi',
    '.smil',
    '.rm',
    '.ram',
    '.rmvb',
    '.rpm',
    '.roq',
    '.swf',
    '.smk',
    '.bik',
    '.wmv',
    '.wmp',
    '.wm',
    '.asf',
    '.avi',
    '.asx',
    '.m3u',
    '.pls',
    '.wvx',
    '.wax',
    '.wmx',
    '.mpcpl',
];

const imageArray = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];

export function isImage(file) {
    if (
        isNotBlank(file) &&
        isNotBlank(file.split('.')) &&
        file.split('.').length >= 2 &&
        isNotBlank(file.split('.')[file.split('.').length - 1]) &&
        imageArray.indexOf(`.${file.split('.')[file.split('.').length - 1].toLowerCase()}`) > -1
    ) {
        return true;
    }
    return false;
}

export function isVideo(file) {
    if (
        isNotBlank(file) &&
        isNotBlank(file.split('.')) &&
        file.split('.').length >= 2 &&
        isNotBlank(file.split('.')[file.split('.').length - 1]) &&
        videoArray.indexOf(`.${file.split('.')[file.split('.').length - 1].toLowerCase()}`) > -1
    ) {
        return true;
    }
    return false;
}

export function GetQueryString(url, name) {
    const r = decodeURI(url.substr(1)).match('(^|&)' + name + '=([^&]*)(&|$)');
    if (r != null) return unescape(r[2].split('?')[0]);
    return null;
}

// 判断两个时间区间之间是否有交集  时间字符串（'08:00','09:00','12:00','13:00'）
export function isTimeIntersection(a, b, x, y) {
    if (y < a || b < x) {
        return false;
    }
    return true;
}

// 获取路由参数
export function getLocation() {
    const { childrenTabs } = window;
    let locations = null;
    if (childrenTabs) {
        const { activeKey, activedTabs } = childrenTabs.state;
        activedTabs.map(item => {
            if (item.key === activeKey && item.location !== null) {
                locations = item.location;
            }
        });
    }
    return locations;
}

// 生成随机字符串
export function getradomString(n) {
    let chars = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'G',
        'K',
        'L',
        'M',
        'N',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ];
    let res = '';
    function generateMixed(n) {
        for (let i = 0; i < n; i++) {
            let id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
    return res;
}

//   重组数组
export function filterKeywordData(keyWord1, keyWord2, keyWord3, dataLsit) {
    if (dataLsit && dataLsit.length > 0) {
        var keyWords = dataLsit.map(function(item) {
            return item[keyWord1];
        });
        var nuiqueKeywords = Array.from(new Set(keyWords));
        var obj = {};
        let arr = [];
        for (var i = 0; i < nuiqueKeywords.length; i++) {
            var itemObj = {};
            var itemArr = dataLsit.filter(item => {
                return nuiqueKeywords[i] === item[keyWord1];
            });
            itemObj['exceptionList'] = itemArr;
            itemObj[keyWord3] = nuiqueKeywords[i];
            itemObj[keyWord2] = itemArr[0][keyWord2];
            arr.push(itemObj);
        }
        return arr;
    }
}

export function unique(arr, str) {
    // 数组对象去重
    let res = [];
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].str]) {
            res.push(arr[i]);
            obj[arr[i].str] = true;
        }
    }
    return res;
}

export function deepCopy(obj) {
    // 深拷贝
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = deepCopy(obj[key]); //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

export function judgeLen(str) {
    let strlen = 0;
    for (let i = 0; i < str.length; i += 1) {
        if (str.charCodeAt(i) > 255) {
            strlen += 2; // 如果是汉字，则字符串长度加2
        } else if (str.charCodeAt(i) <= 255) {
            const strs = strlen + 1;
            strlen = strs;
        }
    }
    return strlen;
}

export function encode(str) {
    // 对字符串进行编码
    var encode = encodeURI(str);
    // 对编码的字符串转化base64
    var base64 = btoa(encode);
    return base64;
}

export function ObjTostr(formValues) {
    Object.keys(formValues).forEach(ele => {
        if (Array.isArray(formValues[ele])) {
            formValues[ele] = formValues[ele].join(',');
        }
    });
    return formValues;
}

export function proccessObject(obj) {
    for (let attr in obj) {
        if (
            obj[attr] === '' ||
            obj[attr] === undefined ||
            (Array.prototype.isPrototypeOf(obj[attr]) && obj[attr].length == 0)
        )
         delete obj[attr];
    }
    return obj;
}

export function setCookie(c_name, value, expiredays, path) {
    // 设置cookie  和过期时间
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
        c_name +
        '=' +
        escape(value) +
        (expiredays == null ? '' : ';expires=' + exdate.toGMTString()) +
        ';Path=' +
        (path == undefined ? '/' : path);
}

export function deleteCookie(c_name) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() - 1);
    document.cookie = c_name + '=1;expires=' + exdate.toGMTString();
}

export function getCookie(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split('; ');
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split('=');
        if (arr[0] == name) return arr[1];
    }
    return '';
}

export function  array_diff(a, b) {
    for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
            if (a[j].oid == b[i].oid) {
                a.splice(j, 1);
                j = j - 1;
            }
        }
    }
    return a;
}