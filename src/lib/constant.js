// 环境变量
let PROCESS_ENV = process.env.VUE_APP_PROCESS_ENV || 'production';

// 调试环境
/* eslint-disable */
if (__wxConfig.envVersion !== 'release') {
  PROCESS_ENV = uni.getStorageSync('debugEnv') || PROCESS_ENV;
}

// 存储常量key
const STORAGE_KEYS = {
  ADD_MINIPROGRAM_DAY: 'ADD_MINIPROGRAM_DAY'
};
// 支付状态 默认10 10 未支付 20 支付成功 30 支付失败 40 待退款 50 已退款 51 成局退余款 60 已取消 70 退款失败 80 已申请退款 100 不同意退款 110 免费订单-后台添加订单
const PAY_STATUS = {
  UNPAID: 10,
  PAID: 20,
  PAY_FAIL: 30,
  REFUNDING: 40,
  REFUNDED: 50,
  REFUND_BALANCE: 51,
  CANCEL: 60,
  REFUND_FAIL: 70,
  APPLY_REFUND: 80,
  REFUND_REFUSED: 100,
  FREE_ORDER: 110
};

const PAY_STATUS_2STRING = {
  10: '未支付',
  20: '支付成功',
  30: '支付失败',
  40: '待退款',
  50: '已退款',
  51: '成局退余款',
  60: '已取消',
  70: '退款失败',
  80: '申请退款中',
  100: '不同意退款',
  110: '免费订单'
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
  4: 'have_many_goals',
  5: 'course_official',
  6: 'course_experience',
  7: 'game',
};



const LEVEL_GRADE_MAP = {
  'L0零基础': 1,
  'L1-1.5': 2,
  'L2-2.0': 3,
  'L3-2.5':4,
  '3.0': 5,
  '3.5': 6,
  '4.0': 7,
  '4.5': 8,
  '5.0': 9,
  '5.5': 10,
  '6.0': 11,
  '6.5': 12,
  '7.0': 13,
  '不限': 14
}

const LEVEL_GRADE_2STRING_MAP = {
  1: 'L0零基础',
  2: 'L1-1.5',
  3: 'L2-2.0',
  4: 'L3-2.5',
  5: '3.0',
  6: '3.5',
  7: '4.0',
  8: '4.5',
  9: '5.0',
  10: '5.5',
  11: '6.0',
  12: '6.5',
  13: '7.0',
  14: '不限'
}

const COACH_LEVEL_GRADE_2STRING_MAP = {
  1: '专业教练',
  2: '高级教练',
  3: '精英教练',
  4: '职业教练',
}

const ACTIVITY_PRICE_TYPE = {
  1: 'AA',
  2: '定额'
}

const OPERA_STATIS_MAP = {
  CLOSE: 1,
  REST: 2,
  OPEN: 3
}

export default {
  PROCESS_ENV,
  STORAGE_KEYS,
  PAY_STATUS,
  PAY_STATUS_2STRING,
  ACTIVITY_TYPE,
  ACTIVITY_TYPE_2PAYTYPE,
  LEVEL_GRADE_MAP,
  LEVEL_GRADE_2STRING_MAP,
  COACH_LEVEL_GRADE_2STRING_MAP,
  ACTIVITY_PRICE_TYPE,
  OPERA_STATIS_MAP
};
