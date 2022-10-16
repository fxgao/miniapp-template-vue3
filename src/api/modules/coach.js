import request from '../request';

const coach = {
  // 教练列表默认
  getCoachListDefault() {
    return request({
      requestParams: {
        url: '/wx/user/coach/list',
        method: 'GET'
      }
    });
  },
  // 教练列表
  getCoachList(data) {
    return request({
      requestParams: {
        url: '/wx/user/coach/listPage',
        method: 'GET',
        data
      }
    });
  },
  // 教练详情
  getCoachDetail(id) {
    return request({
      requestParams: {
        url: `/wx/user/coach/${id}`,
        method: 'GET'
      }
    });
  }

};

export default coach;
