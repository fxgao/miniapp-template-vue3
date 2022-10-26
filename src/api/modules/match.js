import request from '../request';

const match = {
  // 获取活动详情
  getMatchDetail(id) {
    return request({
      requestParams: {
        url: `/wx/game/${id}`,
        method: 'GET'
      }
    });
  }
};

export default match;
