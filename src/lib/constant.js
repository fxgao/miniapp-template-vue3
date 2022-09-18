// 环境变量
let PROCESS_ENV = process.env.VUE_APP_PROCESS_ENV || 'development';

const REGION_ARR = [
  {
    name: '东城',
    code: 110101
  },
  {
    name: '西城',
    code: 110102
  },
  {
    name: '朝阳',
    code: 110105
  },
  {
    name: '丰台',
    code: 110106
  },
  {
    name: '石景山',
    code: 110107
  },
  {
    name: '海淀',
    code: 110108
  },
  {
    name: '门头沟',
    code: 110109
  },
  {
    name: '房山',
    code: 110111
  },
  {
    name: '通州',
    code: 110112
  },
  {
    name: '顺义',
    code: 110113
  },
  {
    name: '昌平',
    code: 110114
  },
  {
    name: '大兴',
    code: 110115
  },
  {
    name: '怀柔',
    code: 110116
  },
  {
    name: '平谷',
    code: 110117
  },
  {
    name: '密云',
    code: 110118
  },
  {
    name: '延庆',
    code: 110119
  }
];

// 存储常量key
const STORAGE_KEYS = {
  ADD_MINIPROGRAM_DAY: 'ADD_MINIPROGRAM_DAY'
};

export default {
  PROCESS_ENV,
  STORAGE_KEYS,
  REGION_ARR
};
