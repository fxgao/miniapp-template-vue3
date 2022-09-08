// 环境变量
let PROCESS_ENV = process.env.VUE_APP_PROCESS_ENV || 'development';

// 存储常量key
const STORAGE_KEYS = {
  ADD_MINIPROGRAM_DAY: 'ADD_MINIPROGRAM_DAY'
};

export default {
  PROCESS_ENV,
  STORAGE_KEYS
};
