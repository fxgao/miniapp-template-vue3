import Constant from '../lib/constant';

// 环境变量别名
const ENV_ALIAS = {
  production: 'prod',
  development: 'dev'
}[Constant.PROCESS_ENV];

// oss地址配置
const OSS_URL_PREFIX_ENV_CONFIG = {
  production: 'https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/',
  development: 'https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/'
};

// 接口地址配置
const REQUEST_URL_PREFIX_ENV_CONFIG = {
  production: 'https://dele.htennis.net/mothApi/little-moth-wx-api',
  development: 'https://dele.htennis.net/mothApi/little-moth-wx-api'
};

const REQUEST_URL_PREFIX =
  REQUEST_URL_PREFIX_ENV_CONFIG[Constant.PROCESS_ENV] || REQUEST_URL_PREFIX_ENV_CONFIG.production;

const OSS_URL_PREFIX =
  OSS_URL_PREFIX_ENV_CONFIG[Constant.PROCESS_ENV] || OSS_URL_PREFIX_ENV_CONFIG.production;

// 请求状态码
const RESPONSE_STATUS_CODE = {
  SUCCESS: 200,
  OTHER_LOGIN: 406,
  NOT_FOUND: 404,
  SERVICE_LINEUP: 429,
  SERVICE_WRONG: 500,
  SERVICE_NOT_REALIZE: 501,
  GATEWAY_WRONG: 502,
  SERVICE_NOT_USABLE: 503,
  GATEWAY_TIMEOUT: 504,
  TOKEN_TIMEOUT: 401,
  VERSION_LOW: 418
};

// 请求错误信息
const RESPONSE_ERROR_MSG = {
  400: '请求参数错误',
  401: '未授权,请重新登录',
  403: '没有访问权限',
  404: '请求错误,未找到该资源',
  405: '请求方式错误',
  408: '请求超时',
  418: '版本过低，请重新打开小程序',
  500: '服务器异常',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
};

// 业务错误信息
const BUSINESS_ERROR_MSG = {
  0: '系统错误'
};

export default {
  PROCESS_ENV: Constant.PROCESS_ENV,
  REQUEST_URL_PREFIX,
  OSS_URL_PREFIX,
  RESPONSE_ERROR_MSG,
  BUSINESS_ERROR_MSG,
  RESPONSE_STATUS_CODE,
  ENV_ALIAS
};
