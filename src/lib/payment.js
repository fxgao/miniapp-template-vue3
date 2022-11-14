import request from '../api/request';
export const PAY_SCREEN = {
  UNKNOWN: 0, // 未知
};

// 801 未查询订单  10未支付, 默认10 20支付成功 30支付失败 40待退款 50已退款

class PaymentControl {
  constructor() {}
  async startPay(
    params,
    successFunc = this.ifMissing('successFunc'),
    failFunc = this.ifMissing('failFunc')
  ) {
    uni.showLoading({ mask: true });
    let that = this;
    try {
      let {
        payParams = this.ifMissing('payParams'),
        handlePaymentInfoFunc = this.ifMissing('handlePaymentInfoFunc'),
        getCheckOrderParams = this.ifMissing('getCheckOrderParams'),
        retry_times = 5,
        pay_screen = PAY_SCREEN.UNKNOWN
      } = params;
      // 下单
      this.sendRequest({ ...payParams }).then(async res => {
        // console.log('then',res,res.order_no);
        let payInfoData = await handlePaymentInfoFunc(res);
        console.log('payInfoData====', payInfoData);
        if (payInfoData.payParam) {
          payInfoData.payParam.success = () => {
            that.checkOrder(getCheckOrderParams, successFunc, failFunc, retry_times, pay_screen, payInfoData.orderNo);
          };
          payInfoData.payParam.fail = payRes => {
            payRes.orderNo = payInfoData.orderNo;
            failFunc(payRes);
          };
          uni.requestPayment(payInfoData.payParam);
        } else {
          failFunc(res);
        }
        uni.hideLoading();
      });
    } catch (e) {
      failFunc(e);
    }
  }
  async checkOrder(getCheckOrderParams, successFunc, failFunc, retryTimes, pay_screen, orderNo) {
    // try {
      uni.showLoading({ mask: true });
      let that = this;
      // 处理checkOrder参数
      let checkOrderParams = await getCheckOrderParams();
      this.checkOrderApi({ ...checkOrderParams }).then(async res => {
        console.log('checkorder result', res);
        if (res && res.code === 200) {
          if (res.data.resultCode === 20) {
            successFunc({...res, orderNo});
            return;
          } else if (res.data.resultCode === 10) {
            if (retryTimes <= 0) {
              failFunc(res);
            } else {
              setTimeout(() => {
                retryTimes--;
                that.checkOrder(
                  getCheckOrderParams,
                  successFunc,
                  failFunc,
                  retryTimes,
                  pay_screen
                );
              }, 2000);
            }
          } else {
            failFunc(res);
            return;
          }
        } else {
          failFunc(res);
        }
      });
    // } catch (e) {
    //   failFunc(e);
    // }
  }
  ifMissing(fn) {
    throw new Error('缺少参数:' + fn);
  }
  sendRequest(requestParams) {
    return request({
      requestParams,
      requestControl: false
    });
  }

  checkOrderApi(requestParams) {
    const afterRequest = function(res) {
      return res;
    }
    return request({
      requestParams,
      requestControl: false,
      afterRequest
    });
  }
}



const PaymentControlInstance = new PaymentControl();

export default PaymentControlInstance;
