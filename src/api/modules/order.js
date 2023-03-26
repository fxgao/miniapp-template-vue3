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
  },
  // 退款前置检验接口
  preRefundOrder(data) {
    return request({
      requestParams: {
        url: '/wx/order/prepayRefundPay',
        method: 'POST',
        data
      }
    });
  },
  // 退款
  refundOrder(data) {
    return request({
      requestParams: {
        url: '/wx/order/refundPay',
        method: 'POST',
        data
      }
    });
  }
};

export default order;
