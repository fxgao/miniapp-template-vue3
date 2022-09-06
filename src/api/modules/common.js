import request from '../request';

const common = {
  testApi: () => {
    const needControl = false;
    const requestParams = {
      url: 'http://yapi.paquapp.com/mock/49/api/testGet'
    };
    const beforeRequest = function (requestParams, header) {
      header.a = 'test';
    };
    const specialFail = function (err) {
      console.log(err);
    };
    const afterRequest = function (res) {
      console.log('after', res);
      res.a = 'a';
      return res;
    };
    const requestTest = request({
      requestParams,
      beforeRequest,
      specialFail,
      afterRequest,
      needControl
      // needCache: true
      // controlSpeed: 3000
    });
    return requestTest;
  },
  login: (code) => {
    const needControl = false;
    const requestParams = {
      url: '/wx/user/login',
      data: { code },
      method: 'POST'
    };
    const specialFail = function (err) {
      console.log(err);
    };
    const requestTest = request({
      requestParams,
      specialFail,
      needControl
    });
    return requestTest;
  }
};

export default common;
