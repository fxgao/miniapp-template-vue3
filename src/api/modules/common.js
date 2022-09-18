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
  // 获取首页banner
  getBanner() {
    return request({
      requestParams: {
        url: '/wx/banner/list',
        method: 'GET'
      }
    });
  },
  // 获取首页金刚位
  getKingKongPosition() {
    return request({
      requestParams: {
        url: '/wx/kingarea/list',
        method: 'GET'
      }
    });
  },
  // 获取热门场馆
  getHotStadiumList() {
    return request({
      requestParams: {
        url: '/wx/stadium/hotStadiumList',
        method: 'GET'
      }
    });
  },
  // 获取附近
  getNearbyStadiumList(data) {
    return request({
      requestParams: {
        url: '/wx/stadium/stadiumListByGeopoint',
        method: 'GET'
      }
    });
  }
};

export default common;
