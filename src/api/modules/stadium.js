import request from '../request';

const stadium = {
  // 场馆列表
  getStadiumList(data) {
    return request({
      requestParams: {
        url: '/wx/user/coach/listPage',
        method: 'GET',
        data
      }
    });
  },
  // 全部场馆列表
  getAllStadiumList() {
    return request({
      requestParams: {
        url: '/wx/stadium/listAll',
        method: 'GET'
      }
    });
  },
  // 场馆详情
  getStadiumDetailInfo(id) {
    return request({
      requestParams: {
        url: `/wx/stadium/${id}`,
        method: 'GET'
      }
    });
  },
  // 获取场馆教练信息
  getStadiumCoachInfo(id) {
    return request({
      requestParams: {
        url: `/wx/stadium/coach/${id}`,
        method: 'GET'
      }
    });
  },
  // 获取场馆活动列表
  getStadiumActivityList(id, time) {
    return request({
      requestParams: {
        url: '/wx/publish/getPlaceDetails',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          stadiumId: id,
          activityTime: time
        }
      }
    });
  }
};

export default stadium;
