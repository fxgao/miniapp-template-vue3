import request from '../request';

const course = {
  // 获取课程列表
  getCourseList(params) {
    return request({
      requestParams: {
        url: '/wx/publish/courseList',
        method: 'GET',
        data: params
      }
    });
  },
  // 获取活动详情
  getCourseDetail(id) {
    return request({
      requestParams: {
        url: `/wx/publish/courseDetail/${id}`,
        method: 'GET'
      }
    });
  }
};

export default course;
