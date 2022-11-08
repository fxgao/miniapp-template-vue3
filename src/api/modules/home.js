import request from '../request';

const homePage = {
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
        method: 'GET',
        data
      }
    });
  },
  // 获取明星教练
  getStarCoachList() {
    return request({
      requestParams: {
        url: '/wx/user/coach/list',
        method: 'GET'
      }
    });
  }
};

export default homePage;
