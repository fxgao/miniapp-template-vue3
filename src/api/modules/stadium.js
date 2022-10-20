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
  }
};

export default stadium;
