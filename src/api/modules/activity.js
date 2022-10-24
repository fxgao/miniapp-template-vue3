import request from '../request';

const activity = {
  // 教练列表默认
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
