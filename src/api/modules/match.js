import request from '../request';

const match = {
  // 获取赛事列表
  getMatchList(params) {
    return request({
      requestParams: {
        url: '/wx/publish/gameList',
        method: 'GET',
        data: params
      }
    });
  },
  // 获取活动详情
  getMatchDetail(id) {
    return request({
      requestParams: {
        url: `/wx/publish/getGameDetail/${id}`,
        method: 'GET'
      }
    });
  }
};

export default match;
