import request from '../request';

const activity = {
  // 获取活动详情
  getActivityDetail(id) {
    return request({
      requestParams: {
        url: `/wx/activity/${id}`,
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
