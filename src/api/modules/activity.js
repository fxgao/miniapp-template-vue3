import request from '../request';

const activity = {
  // 获取活动列表
  getActivityList(params) {
    return request({
      requestParams: {
        url: '/wx/publish/activityList',
        method: 'GET',
        data: params
      }
    });
  },
  // 获取活动详情
  getActivityDetail(id) {
    return request({
      requestParams: {
        url: `/wx/publish/activityDetail/${id}`,
        method: 'GET'
      }
    });
  },
  // 活动参与人跑马灯列表
  getMarqueeList() {
    return request({
      requestParams: {
        url: '/wx/publish/activeUser',
        method: 'GET'
      }
    });
  }
};

export default activity;
