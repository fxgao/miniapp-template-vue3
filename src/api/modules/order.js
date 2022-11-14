import request from '../request';

const order = {
  // 获取订单详情
  getOrderDetail(id) {
    return request({
      requestParams: {
        url: '/wx/order/orderNumber',
        method: 'GET',
        data: {
          orderId: id
        }
      }
    });
  }
};

export default order;
