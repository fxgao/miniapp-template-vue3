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
        method: 'GET'
      }
    });
  },
  // 获取热门活动
  getHotActivityList() {
    return request({
      requestParams: {
        url: '/wx/activity/list',
        method: 'GET'
      }
    });
  },
  getHotCourseList() {
    return request({
      requestParams: {
        url: '/wx/course/list',
        method: 'GET',
        data: {
          hot: 1
        }
      }
    });
  },
  // 获取经典赛事
  getClassicMatchList() {
    return request({
      requestParams: {
        url: '/wx/game/list',
        method: 'GET'
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
