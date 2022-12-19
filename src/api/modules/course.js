import request from '../request';

const course = {
  // 获取课程列表
  getCourseList(params) {
    return request({
      requestParams: {
        // url: '/wx/publish/courseList',
        url: '/wx/templete/course/listPage',
        method: 'GET',
        data: params
      }
    });
  },
  // 获取活动详情
  getCourseDetail(id) {
    return request({
      requestParams: {
        url: `/wx/templete/course/${id}`,
        method: 'GET'
      }
    });
  }
};

export default course;
