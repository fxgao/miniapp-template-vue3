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
  login(code) {
    const needControl = false;
    const requestParams = {
      url: '/wx/user/login',
      method: 'POST',
      data: { code },
      header: { 'content-type': 'application/json' }
    };
    const specialFail = function (err) {
      console.log(err);
    };

    return request({
      requestParams,
      specialFail,
      needControl
    });
  },
  // 经纬度转位置
  locationTransPosition(lat, lng) {
    return request({
      requestParams: {
        url: '/wx/stadium/getAreaName',
        method: 'GET',
        responseReturnCode: false,
        data: {
          lat,
          lng
        }
      }
    });
  },
  // 获取手机号
  getPhoneNumber(data) {
    return request({
      requestParams: {
        url: '/wx/user/getNumber',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data
      }
    });
  },
  // 编辑用户信息
  updateUserInfo(data) {
    return request({
      requestParams: {
        url: '/wx/user/edit',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data
      }
    });
  },
  // 获取OSS STS信息
  getUploadSTSToken() {
    const requestParams = {
      url: '/wx/oss/ailiyunToken',
      method: 'GET'
    };
    return request({
      requestParams
    });
  },
  // 反馈建议
  feedBack(data) {
    const requestParams = {
      url: '/wx/feedback/add',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data
    };
    return request({
      requestParams
    });
  },
  // 获取规则信息
  getProtocolContent(type) {
    const requestParams = {
      url: `/wx/protocol/${type}`,
      method: 'GET'
    };
    return request({
      requestParams
    });
  }
};

export default common;
