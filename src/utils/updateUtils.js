import COS from 'cos-js-sdk-v5';
import { getStorage } from '@/utils/localStorageUtils';
import { isNotBlank } from '@/utils/utils';

const config = { Bucket: 'ddd-1259590172', Region: 'ap-guangzhou' };
// https://ddd-1259590172.cos.ap-guangzhou.myqcloud.com

// const config = { Bucket: 'yuezym-1256524715', Region: 'ap-guangzhou' };

// let param=null;

const cos = new COS({
  getAuthorization(options, callback) {
    const url = '/api/beauty/store/authStr';
    // 方法二、后端通过获取临时密钥，并计算好签名给到前端
    const method = (options.Method || 'get').toLowerCase();
    const key = options.Key || '';
    const query = options.Query || {};
    const headers = options.Headers || {};
    const pathname = key.indexOf('/') === 0 ? key : `/${key}`;
    // var url = 'http://127.0.0.1:3000/sts-auth';
    // var url = '../server/sts-auth.php';
    const xhr = new XMLHttpRequest();
    const data = {
      method,
      path: pathname,
      param: query,
      headers,
    };
    xhr.open('POST', url, true);
    // xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('token', getStorage('token'));
    xhr.onload = (e) => {
      const AuthData = JSON.parse(e.target.responseText);
      callback({
        Authorization: AuthData.data.Authorization,
        XCosSecurityToken: AuthData.data.XCosSecurityToken,
      });
    };
    xhr.send(JSON.stringify(data));
  }
});

export function getHeader(param, url) {
  const haede = new Promise((resolve, reject) => {
    let TaskId = null;
    if (param.file.size > 1024 * 1024) {
      cos.sliceUploadFile({
        Bucket: config.Bucket, // Bucket 格式：test-1250000000
        Region: config.Region,
        Key: url + param.file.name,
        Body: param.file,
        TaskReady: (tid) => {
          console.log(tid);
        },
        onHashProgress: (progressData) => {
          console.log('onHashProgress', JSON.stringify(progressData));
        },
        onProgress: (progressData) => {
          if (isNotBlank(param) && isNotBlank(param.progress)) {
            param.progress(progressData.loaded / progressData.total * 100);
          }
        },
      }, (err, data) => {
        if (err) {
          reject(err);
        } else if (data) {
          resolve(data);
        }
      });
    } else {
      cos.putObject({
        Bucket: config.Bucket, // Bucket 格式：test-1250000000
        Region: config.Region,
        Key: url + param.file.name,
        Body: param.file,
        TaskReady: (tid) => {
          TaskId = tid;
        },
        onProgress: (progressData) => {
          if (isNotBlank(param) && isNotBlank(param.progress)) {
            param.progress(progressData.loaded / progressData.total * 100);
          }

        },
      }, (err, data) => {
        if (err) {
          reject(err);
        } else if (data) {
          resolve(data);
        }
      });
    }
    console.log(TaskId)
  });
  return haede;
}

export function getHeaderImage(file, url) {
  const haede = new Promise((resolve, reject) => {
    let TaskId = null;
    if (file.size > 1024 * 1024) {
      cos.sliceUploadFile({
        Bucket: config.Bucket, // Bucket 格式：test-1250000000
        Region: config.Region,
        Key: url + file.name,
        Body: file,
        TaskReady: (tid) => {
          console.log(tid);
        },
        onHashProgress: (progressData) => {
          console.log('onHashProgress', JSON.stringify(progressData));
        },
        onProgress: (progressData) => {
          console.log(progressData);
        },
      }, (err, data) => {
        if (err) {
          reject(err);
        } else if (data) {
          resolve(data);
        }
      });
    } else {
      cos.putObject({
        Bucket: config.Bucket, // Bucket 格式：test-1250000000
        Region: config.Region,
        Key: url + file.name,
        Body: file,
        TaskReady: (tid) => {
          TaskId = tid;
        },
        onProgress: (progressData) => {
          console.log(progressData)
        },
      }, (err, data) => {

        if (err) {
          reject(err);
        } else if (data) {
          resolve(data);
        }
      });
    }
    console.log(TaskId)
  });
  return haede;
}


function buildPreviewHtml(val) {
  return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 375px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container audio{
              max-width: 100%;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${val}</div>
        </body>
      </html>
    `
};

export function getPreview(value) {

  if (window.previewWindow) {
    window.previewWindow.close()
  }

  window.previewWindow = window.open()
  window.previewWindow.document.write(buildPreviewHtml(value))
  window.previewWindow.document.close()

}
