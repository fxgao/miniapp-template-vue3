import api from 'fxmp-request';
import Config from './configs';
import Constant from '@/lib/constant';

// contentType处理函数
const contentTypeFunc = (requestParams) => {
  let contentTypeStr = '';
  if (!requestParams.header) {
    if (requestParams.method === 'POST') {
      // contentTypeStr = 'application/x-www-form-urlencoded';
      contentTypeStr = 'application/json';
    } else {
      contentTypeStr = 'application/json';
    }
  } else {
    contentTypeStr = requestParams.header['content-type'];
  }
  return contentTypeStr;
};

// 鉴权函数
const authFunc = (requestParams, header) => {
  requestParams.data = requestParams.data || {};
  requestParams.data.ts = new Date().getTime();
  requestParams.data.sign = '';
  return {
    requestParams,
    header
  };
};

// 请求前参数验证函数
const reqValidateFunc = (requestParams) => {
  return {
    status: true,
    msg: ''
  };
};

// 结果返回合法性验证函数
const resThroughFunc = (res) => {
  const validateObj = {
    status: true,
    msg: ''
  };
  // 验证返回数据格式及必要属性
  if (typeof res !== 'object' || res === null) {
    validateObj.status = false;
    validateObj.msg += 'res must be a Object!';
  }
  // 进行其他规则验证
  // if (false) {
  //     validateObj.status = false;
  //     validateObj.msg += '用户已禁用！';
  // }

  return validateObj;
};

// 请求状态码异常处理方法
const resStatusErrorFunc = (info) => {
  const { params, res, msg } = info;
  // 做错误信息上报 神策
  console.log('resStatusErrorFunc-------', params, res, msg);
};

const instanceConfigs = {
  PROCESS_ENV: Constant.PROCESS_ENV,
  baseURL: Config.REQUEST_URL_PREFIX, // 基础URL
  contentTypeHandlers: [contentTypeFunc], // contentType处理方法
  authHandlers: [authFunc], // 鉴权处理方法
  reqValidateHandlers: [reqValidateFunc], // 请求前验证处理方法
  resThroughHandlers: [resThroughFunc], // 结果返回合法性处理方法
  responseCodeKey: 'code', // 返回状态码的键名
  successCode: ['ok', 'OK', '1', 1], // 成功状态码值
  resStampKey: 'now', // 返回时间戳键名
  resMessageKey: 'msg', // 返回提示信息键名
  specialResStatusErrorCode: [], // 特殊请求状态异常Code
  specialResStatusErrorCodeHandlers: {}, // 特殊请求状态异常Code处理方法
  resStatusErrorMsg: Config.RESPONSE_ERROR_MSG, // 返回状态异常提示信息
  resStatusErrorHandlers: [resStatusErrorFunc], // 请求状态异常Code处理方法
  specialSuccessCode: [], // 特殊code码
  specialSuccessCodeHandlers: {}, // 特殊code码处理方法
  businessErrorMsg: Config.BUSINESS_ERROR_MSG, // 业务状态错误码
  openControl: true, // 请求控制开启状态
  dropSpeed: 10000, // 请求抛弃速度
  openCache: false, // 请求缓存开启状态
  cacheMethod: 'localStorage', // 缓存方式
  cacheLocation: 'DELE_API_CACHE' // 缓存方式
};
const request = api.create(instanceConfigs);

export default request;
