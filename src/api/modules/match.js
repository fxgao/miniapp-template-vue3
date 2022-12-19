import request from '../request';

const match = {
  // 获取赛事列表
  getMatchList(params) {
    return request({
      requestParams: {
        // url: '/wx/publish/gameList',
        url: '/wx/game/listPage',
        method: 'GET',
        data: params
      }
    });
  },
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
