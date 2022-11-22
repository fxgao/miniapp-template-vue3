// 环境变量
let PROCESS_ENV = process.env.VUE_APP_PROCESS_ENV || 'development';

// 存储常量key
const STORAGE_KEYS = {
  ADD_MINIPROGRAM_DAY: 'ADD_MINIPROGRAM_DAY'
};

// 支付状态 10 未支付, 默认10 0 支付成功 30 支付失败 40 待退款 50 已退款 60 已取消
const PAY_STATUS = {
  UNPAID: 10,
  PAID: 20,
  PAY_FAIL: 30,
  REFUNDING: 40,
  REFUNDED: 50,
  CANCEL: 60
};

const PAY_STATUS_2STRING = {
  10: '未支付',
  20: '支付成功',
  30: '支付失败',
  40: '待退款',
  50: '已退款',
  60: '已取消'
};

const ACTIVITY_TYPE = {
  1: '约球',
  2: '发球机',
  3: '陪练',
  4: '有氧多球'
};

const ACTIVITY_TYPE_2PAYTYPE= {
  1: 'about_ball',
  2: 'serve_machine',
  3: 'practice_partner',
  4: 'have_many_goals'
};

export default {
  PROCESS_ENV,
  STORAGE_KEYS,
  PAY_STATUS,
  PAY_STATUS_2STRING,
  ACTIVITY_TYPE,
  ACTIVITY_TYPE_2PAYTYPE
};
