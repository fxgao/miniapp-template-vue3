module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:vue/vue3-essential', 'standard'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['vue'],
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    $getAppWebview: 'readonly'
  },
  rules: {
    'vue/multi-word-component-names': ['off'],
    semi: ['error', 'always'], // 分号
    'no-unused-vars': ['warn'], // var
    'space-before-function-paren': ['off'], // 不启用函数前需要空格的规则
    'property-no-unknown': ['off'],
    'no-trailing-spaces': ['warn'], // 行尾空
    camelcase: ['warn'],
    'vue/valid-template-root': ['warn'],
    'no-magic-numbers': ['off'], // 禁止魔术数字
    eqeqeq: ['warn']
  }
};
