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
  4: 'have_many_goals',
  5: 'course_official',
  6: 'course_experience',
  7: 'game',
};



const LEVEL_GRADE_MAP = {
  '0基础': 1,
  '0.5': 2,
  '1': 3,
  '1.5': 4,
  '2': 5,
  '2.5': 6,
  '3': 7,
  '3.5': 8,
  '4': 9,
  '4.5': 10,
  '5': 11,
  '5.5': 12,
  '6': 13,
  '6.5': 14,
  '7': 15,
}

const LEVEL_GRADE_2STRING_MAP = {
  1: '0基础',
  2: '0.5',
  3: '1',
  4: '1.5',
  5: '2',
  6: '2.5',
  7: '3',
  8: '3.5',
  9: '4',
  10: '4.5',
  11: '5',
  12: '5.5',
  13: '6',
  14: '6.5',
  15: '7',
}

export default {
  PROCESS_ENV,
  STORAGE_KEYS,
  PAY_STATUS,
  PAY_STATUS_2STRING,
  ACTIVITY_TYPE,
  ACTIVITY_TYPE_2PAYTYPE,
  LEVEL_GRADE_MAP,
  LEVEL_GRADE_2STRING_MAP
};
