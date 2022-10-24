const REDIRECT_URL = {
  '/webview': '/pages/transfer_station',
  '/index:home': '/pages/index?key=home',
  '/index:mine': '/pages/index?key=mine',
  '/index:course': '/pages/index?key=course',
  '/index:activity': '/pages/index?key=activity',
  '/stadium/index': '/packages/stadium/pages/index',
  '/stadium/detail': '/packages/stadium/pages/detail',
  '/edit-profile': '/packages/mine/pages/edit-profile'
};

const useNavigate = () => {
  const toQueryPair = (key, value) => {
    if (typeof value === 'undefined') {
      return key;
    }
    return key + '=' + (value === null ? '' : value);
  };
  const toQueryString = (obj) => {
    const ret = [];
    for (const key in obj) {
      const values = obj[key] ? obj[key] : 0;
      ret.push(toQueryPair(key, values));
    }
    return ret.join('&');
  };
  const symbol = (url) => {
    return url.indexOf(':') !== -1 || url.indexOf('?') !== -1 ? '&' : '?';
  };
  const to = (url, params, type = 'navigateTo') => {
    let mergeUrl = null;
    if (url.indexOf('http') !== -1 || url.indexOf('https') !== -1) {
      mergeUrl = params
        ? `${REDIRECT_URL['/webview']}?url=${encodeURIComponent(url)}&${toQueryString(params)}`
        : `${REDIRECT_URL['/webview']}?url=${encodeURIComponent(url)}`;
    } else if (url.indexOf('/') !== -1 && url.indexOf('?') !== -1) {
      // 小程序映射地址带参数
      mergeUrl = params
        ? REDIRECT_URL[url] + symbol(url) + toQueryString(params)
        : `${REDIRECT_URL[url.split('?')[0]]}?${url.split('?')[1]}`;
    } else if (url.indexOf('/') !== -1 && url.indexOf('?') === -1) {
      mergeUrl = params
        ? REDIRECT_URL[url] + symbol(url) + toQueryString(params)
        : REDIRECT_URL[url];
    } else {
      mergeUrl = params.params
        ? REDIRECT_URL[params.url] + symbol(params.url) + toQueryString(params.params)
        : REDIRECT_URL[params.url];
    }
    const pages = getCurrentPages();
    if (pages.length === 10) {
      type = 'redirectTo';
    }
    console.log('mergeUrl', mergeUrl, type);
    uni[type]({ url: mergeUrl });
  };
  const back = (delta) => {
    uni.navigateBack(
      delta
        ? {
            delta
          }
        : ''
    );
  };
  return {
    toQueryPair,
    toQueryString,
    symbol,
    to,
    back
  };
};

export default useNavigate;
