// 时间格式化
const formatTime = (value, type) => {
  const time = new Date(value);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  let hour, minutes, seconds;
  // 传type会进行0补位
  if (type) {
    hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
  } else {
    hour = time.getHours();
    minutes = time.getMinutes();
    seconds = time.getSeconds();
  }

  return {
    year,
    month,
    date,
    hour,
    minutes,
    seconds
  };
};

// 日期格式化
const formatDate = (date, fmt) => {
  if (typeof date === 'number') {
    date = new Date(date);
  }
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
};

// 处理秒转时间
const formatSeconds = (value, type) => {
  type = type || '';
  let theTime = parseInt(value); // 需要转换的时间秒
  let theTime1 = 0; // 分
  let theTime2 = 0; // 小时
  let theTime3 = 0; // 天
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 >= 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
      if (theTime2 > 24 && type !== 'ne') {
        // 大于24小时
        theTime3 = parseInt(theTime2 / 24);
        theTime2 = parseInt(theTime2 % 24);
      }
    }
  }
};

// 是否Array类型
const isArray = (value) => {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
};

// 是否Object类型
const isObject = (value) => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

// 是否为空
const isEmpty = (value) => {
  if (isArray(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return value === '' || value === undefined || value === null;
};

// 延迟
const delay = (cb, ms = 0) => {
  const timer = setTimeout(() => {
    clearTimeout(timer);
    cb();
  }, ms);
  return () => {
    clearTimeout(timer);
  };
};

// 切割字符串
const cutString = (name, num) => {
  if (!name) return;
  const cutNum = num || 10;
  if (name.length > cutNum) {
    name = name.substring(0, cutNum) + '...';
  }
  return name;
};

// 对手机号进行中间部分加密
const phoneStrHandler = function (phonestr) {
  phonestr = phonestr + '';
  if (!phonestr || phonestr.length !== 11) return '输入的是非法手机号！';
  return phonestr.substring(0, 3) + ' **** ' + phonestr.substring(7, 11);
};

const debounce = function (func, wait, immediate) {
  let timeout, args, context, timestamp, result;
  const later = function () {
    const last = +new Date() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function () {
    context = this;
    args = arguments;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};

/**
 * 节流函数：每隔某个时间段去执行某个函数，防止函数的过多执行
 * leading：（Boolean）是否立即执行
 * trailing： （Boolean）wait期间如果有再次调用，是否会在“周期后边缘（wait结束）”再次执行
 * leading= true；trailing：true：调用立即执行一次，wait期间如果有再次调用，在周期后边缘再次执行
 * leading= true；trailing：false：调用立即执行一次，wait期间如果有再次调用，在周期后边缘不会执行
 * leading= false；trailing：true：调用需要等待wait时间，wait期间如果再次调用，在周期后边缘再次执行
 * leading= false；trailing：false：调用需要等待wait时间，wait期间如果再次调用，在周期后边缘不会执行
 */
const throttle = function (func, wait, options) {
  let context, args, result;
  let timeout = null;
  let previous = 0;
  if (!options) options = {};

  const later = function () {
    previous = options.leading === false ? 0 : new Date();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function () {
    const now = new Date();
    if (!previous && options.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};

const PromiseWithAbort = function (promise) {
  let _abort = null;
  const Pabort = new Promise((resolve, reject) => {
    _abort = function (reason = 'abort !') {
      console.warn(reason);
      reject(reason);
    };
  });

  const race = Promise.race([promise, Pabort]);
  race.abort = _abort;
  return race;
};

const addZero = function (m) {
  return m < 10 ? '0' + m : m;
};

const formatDateTime = (timestamp) => {
  if (timestamp) {
    const time = new Date(timestamp);
    const y = time.getFullYear();
    const M = time.getMonth() + 1;
    const d = time.getDate();
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    return (
      y +
      '-' +
      addZero(M) +
      '-' +
      addZero(d) +
      ' ' +
      addZero(h) +
      ':' +
      addZero(m) +
      ':' +
      addZero(s)
    );
  } else {
    return '';
  }
};

const randomString = (len, hasDateNow) => {
  len = len || 32;
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  if (hasDateNow) {
    pwd += '_' + Date.now();
  }
  return pwd;
};

export {
  cutString,
  formatDate,
  formatSeconds,
  isArray,
  isObject,
  isEmpty,
  delay,
  formatTime,
  phoneStrHandler,
  debounce,
  throttle,
  PromiseWithAbort,
  formatDateTime,
  randomString
};
