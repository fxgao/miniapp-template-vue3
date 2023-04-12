<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="订单详情"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer" :style="popup1 ? 'padding-bottom:' + popup1.topSlotHeight : ''">
      <!-- 用户信息 -->
      <view class="userInfoBlock">
        <view class="title">报名信息</view>
        <view class="content">
          <image
            class="userAvatar"
            :src="
              loginInfoData?.photo
                ? loginInfoData.photo
                : 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/default-avatar.png'
            "
            mode="aspectFit"
          />
          <view class="userInfo">
            <view class="infoRow">
              <view class="userName" :class="{red: !loginInfoData?.tel || !loginInfoData?.openId}">
                {{
                  loginInfoData?.nickname && loginInfoData?.openId
                    ? loginInfoData.nickname +
                      (loginInfoData?.age ? `(${loginInfoData?.age}岁)` : '')
                    : '请填写信息'
                }}
              </view>
              <image
                v-if="loginInfoData?.sex"
                class="sex"
                :src="
                  loginInfoData?.sex === '男'
                    ? 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/sex-male.png'
                    : 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/sex-female.png'
                "
              />
              <view class="level" v-if="loginInfoData?.level">
                {{ Constant.LEVEL_GRADE_2STRING_MAP[loginInfoData?.level] }}
              </view>
            </view>
            <view class="infoRow" v-if="loginInfoData?.openId">
              <view class="phone" v-if="loginInfoData?.tel">
                {{ hideMiddlePhone(loginInfoData.tel) }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="orderInfoBlock">
        <view class="title">
          订单信息
          <view class="countDownText" v-if="orderInfo && orderInfo?.orderStatus === 10 && payCountDownStr">
            请在<div class="countDownNum">{{ payCountDownStr }}</div>内支付，超时将自动取消
          </view>
        </view>
        <view class="orderBlock">
          <order-card :info="orderInfo" :noPadding="true"></order-card>
          <view class="priceInfo">
            <view class="priceInfoItem">
              <view class="priceExplain">实付金额</view>
              <view class="price">¥{{ orderInfo?.orderPrice }}</view>
            </view>
            <view class="priceInfoItem right">
              <view class="price"
                >合计支付：<span class="priceText">¥{{ orderInfo?.orderPrice }}</span>
              </view>
            </view>
          </view>
          <view class="detailInfo">
            <view class="detailItem">
              <view class="detailTitle">订单编号</view>
              <view class="detailContent">{{ orderInfo?.orderSn }}</view>
            </view>
            <view class="detailItem">
              <view class="detailTitle">支付状态</view>
              <view class="detailContent">{{ payStatusStr }}</view>
            </view>
            <view class="detailItem">
              <view class="detailTitle">{{ orderInfo?.orderStatus === 10 ? '订单创建时间' : '支付时间' }}</view>
              <view class="detailContent">{{ orderInfo?.payTime }}</view>
            </view>
            <view class="detailItem">
              <view class="detailTitle">支付方式</view>
              <view class="detailContent">微信支付</view>
            </view>
            <view class="detailItem">
              <view class="detailTitle">商家全称</view>
              <view class="detailContent">得乐体育</view>
            </view>
            <view class="detailItem">
              <view class="detailTitle">订单金额</view>
              <view class="detailContent">¥{{ orderInfo?.orderPrice }}</view>
            </view>
            <view class="detailItem">
              <view class="detailTitle">手机号</view>
              <view class="detailContent">{{ orderInfo?.tel ? orderInfo?.tel : '暂无手机号' }}</view>
            </view>
            <view class="detailItem">
              <view class="detailTitle">订单备注</view>
              <view class="detailContent">{{ orderInfo?.remark ? orderInfo?.remark : '暂无备注' }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 购买须知 -->
      <view class="buyNoticeBlock">
        <view class="title">订单须知</view>
        <view class="content">
          <template v-if="activityRule">
            <mp-html v-model:content="activityRule"></mp-html>
          </template>
          <template v-else>
            <view class="row">
              1、如因自身原因无法提供不能参与活动，概不退款
            </view>
            <view class="row">
              2、一旦支付，活动开始24小时前可全额退款（根据总金额，微信支付平台将扣除一定手续费），超过24小时不可退款
            </view>
          </template>
        </view>
      </view>
      <!-- 协议 -->
      <view class="rule">
        请您在支付前仔细阅读
        <span class="ruleText" @click="goPayRule"> 《用户支付协议》 </span> ，
        付款即代表您同意此协议。
      </view>
    </view>
    <view class="detailPopupBottom" v-if="orderInfo?.orderStatus === 10 || orderInfo?.orderStatus === 20 || orderInfo?.orderStatus === 40">
      <PopupBottom ref="popup1">
        <template v-slot:outer-main>
          <view class="popupContainer">
            <template v-if="orderInfo?.orderStatus === 10">
              <view class="info">
                金额（元）： <span class="priceText">{{ orderInfo.orderPrice }}</span>
              </view>
              <view class="payBtn" @click="rePay">去付款</view>
            </template>
            <template v-if="orderInfo?.orderStatus === 20">
              <view class="payBtn half plain" @click="goRefund" v-if="orderInfo.orderChannel === 1">申请退款</view>
              <view class="payBtn" :class="orderInfo.orderChannel == 2 ? 'full' : 'half'" @click="showServeModal">联系客服</view>
            </template>
            <template v-if="orderInfo?.orderStatus === 40 || orderInfo?.orderStatus === 80">
              <view class="payBtn half plain">退款审核中</view>
              <view class="payBtn half" @click="showServeModal">联系客服</view>
            </template>
            <template v-if="orderInfo?.orderStatus === 100">
              <view class="payBtn half plain">退款申请失败</view>
              <view class="payBtn half" @click="showServeModal">联系客服</view>
            </template>
          </view>
        </template>
      </PopupBottom>
    </view>
    <view class="modalContainer">
      <Modal v-model:show="serveModalShow">
        <view class="modalBlock">
          <image class="wechatImg" show-menu-by-longpress :src="orderInfo?.tbBizStadiumVo?.wechatCardUrl" />
          <view class="text">咨询客服了解退款情况</view>
        </view>
        <template v-slot:bottom>
          <view class="actionBlock">
            <view class="saveBtn" @click="saveQrCode">保存二维码</view>
            <view class="copyBtn" @click="copyWechatNumber">复制微信号</view>
          </view>
        </template>
      </Modal>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import { onLoad, onShow, onShareAppMessage, onUnload } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useAppInstance, useNav } from '@/hooks';
import { useSystemInfoStore } from '@/stores/systemInfo';
import { useLoginInfoStore } from '@/stores/loginInfo';
import OrderCard from '@/components/list-card/order-card';
import PopupBottom from '@/components/popup-bottom';
import Modal from '@/components/modal';
import MpHtml from '@/components/mp-html/mp-html.vue';
import Constant from '@/lib/constant';
import api from '@/api';
import config from '@/api/config';
import uniAsync from '@/lib/uni-async';
import { debounce, hideMiddlePhone } from '@/utils';
import payment from '@/lib/payment';

const systemInfo = useSystemInfoStore();
const { safeBottom, navHeight } = storeToRefs(systemInfo);
const loginInfoStore = useLoginInfoStore();
const { loginInfoData } = storeToRefs(loginInfoStore);
const { $onLaunched } = useAppInstance();
const { to } = useNav();
const BASE_URL = config.REQUEST_URL_PREFIX;
const { PAY_STATUS_2STRING } = Constant;

const orderInfo = ref(null);
let actInfo = reactive({});
let stadiumInfo = reactive({});
const popup1 = ref(null);
const serveModalShow = ref(false);
let payCountDownTimer = null;
const payCountDownStr = ref('');

const payStatusStr = computed(() => {
  return PAY_STATUS_2STRING[orderInfo.value?.orderStatus];
});

const submit = () => {
  uni.showLoading();
  const params = {
    retry_times: 5
  };
  const data = {
    orderId: orderInfo.value.orderSn
  };

  // 支付参数
  const payRequestParams = {
    url: BASE_URL + '/wx/order/prepayAgain',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data
  };
  params.payParams = payRequestParams;

  // checkorder参数
  const checkOrderParams = {
    url: '/wx/order/paySearch',
    method: 'POST',
    data: {}
  };

  // 获取检查订单结果
  params.getCheckOrderParams = () => {
    return checkOrderParams;
  };

  // 处理获取订单结果
  params.handlePaymentInfoFunc = (res) => {
    console.log('handlePaymentInfoFunc=====', res);
    if (res.payStatus === 1) {
      checkOrderParams.data.orderId = res.orderNo;
      payment.checkOrder(
        (params.getCheckOrderParams = () => {
          return checkOrderParams;
        }),
        (checkRes) => {
          // 0元支付成功
        },
        (err) => {
          console.log('失败===', err);
        }
      );
      return false;
    }
    if (res.payParam) {
      checkOrderParams.data.orderId = res.tradeOrderNum; // 此id用来查询订单状态
      return res;
    }
    return res;
  };

  // 最终支付结果
  payment.startPay(
    params,
    (successRes) => {
      console.log('successRes=====', successRes);
      uni.hideLoading();
      // 支付成功刷新当前数据
      initData(orderInfo.value.orderSn);
    },
    (error) => {
      console.log('error=====', error);
      uni.hideLoading();
      uni.showToast({
        title: error.message || '支付失败',
        icon: 'none',
        duration: 2000
      });
    }
  );
};

const rePay = debounce(submit, 2000, true);

const showServeModal = () => {
  serveModalShow.value = true;
};

const saveQrCode = async () => {
  const url = orderInfo.value?.tbBizStadiumVo?.wechatCardUrl;
  const save = (path) => {
    uni.saveImageToPhotosAlbum({
      filePath: path,
      success() {
        uni.showToast({ title: '已保存到系统相册', icon: 'none' });
      },
      fail(e) {
        console.log('saveImageToPhotosAlbum fail', e);
        uni.showToast({ title: '下载失败', icon: 'none' });
      }
    });
  };

  try {
    const auth = await uniAsync.authorize({
      scope: 'scope.writePhotosAlbum'
    });
    if (auth.errMsg === 'authorize:ok') {
      if (url.startsWith('http')) {
        uni.downloadFile({
          url,
          success: (res) => save(res.tempFilePath)
        });
      } else {
        save(url);
      }
    } else {
      uni.showModal({
        title: '无法保存',
        content:
          '1.请在“设置-隐私-照片”选项中，允许微信访问你的照片 2.请点击小程序右上角"...",在“设置”中打开“添加到相册”功能',
        showCancel: false
      });
    }
  } catch (error) {
    console.log('authorize error', error);
    uni.showModal({
      title: '无法保存',
      content:
        '1.请在“设置-隐私-照片”选项中，允许微信访问你的照片 2.请点击小程序右上角"...",在“设置”中打开“添加到相册”功能',
      showCancel: false
    });
  }
};

const copyWechatNumber = () => {
  uni.setClipboardData({
    data: orderInfo.value?.tbBizStadiumVo?.wechatCode,
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'none' });
    }
  });
};

const isRefund = ref(false);
const goRefund = () => {
  isRefund.value = true;
  nextTick(() => {
    to('/mine/order-refund', {
      id: orderInfo.value.orderSn
    });
  });
};

const clearTimer = () => {
  if (payCountDownTimer) {
    clearTimeout(payCountDownTimer);
    payCountDownTimer = null;
  }
};

const handelPayCountDown = (time) => {
  // console.log('handelPayCountDown', time);
  if (time > 0) {
    const minute = Math.floor(time / 60);
    const second = time % 60;
    payCountDownStr.value = `${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`;
    payCountDownTimer = setTimeout(() => {
      clearTimer();
      handelPayCountDown(time - 1);
    }, 1000);
  } else {
    clearTimer();
    payCountDownStr.value = '';
    const pages = getCurrentPages();
    const orderListPage = pages[pages.length - 2].$vm;
    if (orderListPage && orderListPage.changeOrderStatus) { orderListPage.changeOrderStatus(orderInfo.value.orderSn, 60); }
    initData(orderInfo.value.orderSn);
  }
};

const initData = async (id) => {
  try {
    const res = await api.order.getOrderDetail(id);
    console.log('getOrderDetail', res);
    orderInfo.value = res || {};
    actInfo = res && res.actJson ? JSON.parse(res.actJson) : {};
    stadiumInfo = res && res.stadiumJson ? JSON.parse(res.stadiumJson) : {};
    // 如果是待支付订单，倒计时
    if (res?.orderStatus === 10 && res?.refundTimeSecond > 0) {
      handelPayCountDown(res.refundTimeSecond);
    }
  } catch (error) {
    console.log('getOrderDetail error', error);
  }
};

const activitytInfo = computed(() => {
  return orderInfo.value && orderInfo.value.tbBizActivityVo ? orderInfo.value.tbBizActivityVo : {};
});

const courseInfo = computed(() => {
  return orderInfo.value && orderInfo.value.tbBizCourseVo ? orderInfo.value.tbBizCourseVo : {};
});

const gameInfo = computed(() => {
  return orderInfo.value && orderInfo.value.tbBizGameVo ? orderInfo.value.tbBizGameVo : {};
});

const activityRule = computed(() => {
  return activitytInfo.value?.activeRule || '';
});

const headFigure = computed(() => {
  if (orderInfo.value?.actType === 'course_official' && orderInfo.value?.actType === 'course_experience') {
    return courseInfo.value?.courseHeadFigure || '';
  } else if (orderInfo.value?.actType === 'game') {
    return gameInfo.value?.gameImageUrl || '';
  } else {
    return activitytInfo.value?.activeHeadFigure || '';
  }
});

const goPayRule = () => {
  to('/mp-html?alias=paymentAgreement&title=支付协议');
};

onShareAppMessage(() => {
  return {
    title: '我在参与活动，邀你一起来围观！',
    // imageUrl: headFigure.value || 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/order.png',
    imageUrl: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/order.png',
    path: `/packages/activity/pages/detail?actId=${orderInfo.value.actId}&pubId=${orderInfo.value.publishId}`
  };
});

onShow(() => {
  console.log('onshow', isRefund);
  if (isRefund.value) {
    isRefund.value = false;
    initData(orderInfo.value.orderSn);
  }
});

onLoad(async (options) => {
  const { id } = options;
  console.log('onload', options);
  await $onLaunched;
  initData(id);
});

onUnload(() => {
  clearTimer();
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
.pageContainer {
  width: 100%;
  background: #f5f5f5;
  overflow: hidden;
  .userInfoBlock,
  .orderInfoBlock,
  .buyNoticeBlock {
    margin-top: 16rpx;
    padding: 32rpx 40rpx;
    background: #fff;
    .title {
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 52rpx;
    }
    .content {
      margin-top: 32rpx;
      .row {
        &:not(:first-child) {
          margin-top: 16rpx;
        }
        font-size: 28rpx;
        color: #a0a0a0;
        line-height: 44rpx;
      }
      .textArea {
        font-size: 28rpx;
        line-height: 44rpx;
        height: 150rpx;
      }
    }
  }
  .userInfoBlock {
    .content {
      @include flex-start;
      margin-top: 32rpx;
      .userAvatar {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
        flex-shrink: 0;
        background: #f5f5f5;
      }
      .userInfo {
        margin-left: 32rpx;
        position: relative;
        .infoRow {
          &:not(:first-child) {
            margin-top: 16rpx;
          }
          width: 500rpx;
          @include flex-start;
          .userName {
            &.red {
              color: #ff4d4f;
            }
            font-size: 28rpx;
            font-weight: 500;
            color: #333333;
            line-height: 44rpx;
          }
          .sex {
            width: 32rpx;
            height: 32rpx;
            margin-left: 16rpx;
          }
          .age,
          .phone {
            font-size: 24rpx;
            color: #a0a0a0;
            line-height: 40rpx;
          }
          .level {
            font-size: 24rpx;
            color: #ffffff;
            line-height: 24rpx;
            background: linear-gradient(135deg, #ade767 0%, #4cac00 100%);
            border-radius: 4rpx;
            padding: 4rpx 8rpx;
            margin-left: 16rpx;
          }
        }
      }
    }
  }

  .orderInfoBlock {
    .title {
      position: relative;
      .countDownText {
        &::before {
          content: '';
          position: absolute;
          left: 12rpx;
          top: 50%;
          transform: translateY(-50%);
          width: 32rpx;
          height: 32rpx;
          background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/i-icon-warn.png') 0 0 no-repeat;
          background-size: contain;
        }
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 48rpx;
        background: #FFEFE9;
        border-radius: 26rpx;
        font-size: 24rpx;
        color: #FF6829;
        line-height: 48rpx;
        padding-left: 48rpx;
        padding-right: 24rpx;
        .countDownNum {
          display: inline-block;
          font-weight: 500;
          width: 84rpx;
          text-align: center;
        }
      }
    }
    .orderBlock {
      margin-top: 32rpx;
      .orderInfo {
        @include flex-start;
        align-items: flex-start;
        padding-bottom: 32rpx;
        border-bottom: 1rpx solid #eee;
        .infoImg {
          width: 192rpx;
          height: 192rpx;
          border-radius: 16rpx;
          margin-right: 16rpx;
          flex: none;
          background: #f5f5f5;
        }
        .infoRight {
          .infoTitle {
            font-size: 32rpx;
            font-weight: 500;
            color: #333333;
            line-height: 48rpx;
          }
          .infoSub {
            font-size: 24rpx;
            color: #a0a0a0;
            line-height: 40rpx;
            margin-top: 8rpx;
          }
        }
      }
      .priceInfo {
        padding: 0 0 32rpx;
        border-bottom: 1rpx solid #eee;
        .priceInfoItem {
          @include flex-between;
          &.right {
            @include flex-end;
          }
          .priceExplain {
            font-size: 24rpx;
            color: #a0a0a0;
            line-height: 40rpx;
          }
          .price {
            font-size: 24rpx;
            color: #a0a0a0;
            line-height: 40rpx;
            margin-right: 8rpx;
            .priceText {
              font-size: 32rpx;
              font-weight: 700;
              color: #ff6829;
              line-height: 48rpx;
              margin-left: 8rpx;
            }
          }
        }
      }
      .detailInfo {
        padding-top: 16rpx;
        .detailItem {
          @include flex-between;
          align-items: flex-start;
          padding: 16rpx 0;
          .detailTitle {
            font-size: 28rpx;
            color: #A0A0A0;
            line-height: 44rpx;
            flex:none;
          }
          .detailContent {
            font-size: 28rpx;
            color: #333333;
            line-height: 44rpx;
            max-width: 78%;
            word-break: break-all;
          }
        }
      }
    }
  }
  .rule {
    margin: 32rpx 40rpx;
    font-size: 24rpx;
    color: #a0a0a0;
    line-height: 40rpx;
    padding-bottom: 64rpx;
    .ruleText {
      color: #ff6829;
    }
  }
}
.detailPopupBottom {
  .popupContainer {
    @include flex-between;
    padding: 16rpx 40rpx;
    border-top: 2rpx solid #eeeeee;
  }
  .info {
    font-size: 28rpx;
    color: #333333;
    line-height: 44rpx;
    .priceText {
      font-size: 40rpx;
      font-weight: 700;
      color: #ff6829;
      line-height: 56rpx;
    }
  }
  .payBtn {
    &.half {
      width: 48%;
      text-align: center;
    }
    &.full {
      width: 100%;
      text-align: center;
    }
    &.plain {
      border: 1rpx solid #ECECEC;
      color: #333333;
      background: #fff;
    }
    font-size: 32rpx;
    font-weight: 700;
    color: #ffffff;
    line-height: 48rpx;
    padding: 20rpx 48rpx;
    background: linear-gradient(135deg, #ffab43 0%, #ff6829 100%);
    border-radius: 44rpx;
  }
}
.modalContainer {
  .modalBlock {
    display: flex;
    flex-direction: column;
    align-items: center;
    .wechatImg {
      width: 362rpx;
      height: 362rpx;
      margin: 0 68rpx;
    }
    .text {
      font-size: 24rpx;
      color: #a0a0a0;
      line-height: 40rpx;
      text-align: center;
      margin-top: 32rpx;
    }
  }
  .actionBlock {
    @include flex-between;
    width: 100%;
    .saveBtn {
      border-radius: 40rpx;
      border: 2rpx solid #ff6829;
      backdrop-filter: blur(2rpx);
      font-size: 32rpx;
      font-weight: 700;
      color: #ff6829;
      line-height: 48rpx;
      padding: 20rpx 36rpx;
    }
    .copyBtn {
      background: linear-gradient(135deg, #ffab43 0%, #ff6829 100%);
      border-radius: 44rpx;
      font-size: 32rpx;
      font-weight: 700;
      color: #ffffff;
      line-height: 48rpx;
      padding: 20rpx 36rpx;
    }
  }
}
</style>
