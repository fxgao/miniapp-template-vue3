import request from '../request';

const course = {
  // 获取活动详情
  getCourseDetail(id) {
    return request({
      requestParams: {
        url: `/wx/course/${id}`,
        method: 'GET'
      }
    });
  }
};

export default course;
