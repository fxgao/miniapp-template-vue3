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
              <view class="level"> 0基础1级 </view>
            </view>
            <view class="infoRow" v-if="loginInfoData?.openId">
              <view class="phone" v-if="loginInfoData?.tel">
                {{ loginInfoData.tel }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="orderInfoBlock">
        <view class="title">订单信息</view>
        <view class="orderBlock">
          <view class="orderInfo">
            <image :src="actInfo?.activeHeadFigure" class="infoImg" />
            <view class="infoRight">
              <view class="infoTitle">{{ actInfo?.activeName }}</view>
              <view class="infoSub">{{ stadiumInfo?.stadiumName }}</view>
              <view class="infoSub">活动时间{{ orderInfo.time }}</view>
            </view>
          </view>
          <view class="priceInfo">
            <view class="priceInfoItem">
              <!-- <view class="priceExplain">{{ priceExplainText }}</view> -->
              <view class="priceExplain">实付金额</view>
              <view class="price">¥{{ orderInfo?.goodsPrice }}</view>
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
              <view class="detailTitle">支付时间</view>
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
              <view class="detailContent">{{ orderInfo?.phone ? orderInfo?.phone : '暂无手机号' }}</view>
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
        <view class="title">购买须知</view>
        <view class="content">
          <view class="row">
            1、根据北京防疫规定，参与者需提供72小时内核酸证明和健康宝绿码，如因自身原因无法提供不能参与活动，概不退款
          </view>
          <view class="row">
            2、一旦支付，活动开始24小时前可全额退款（根据总金额，微信支付平台将扣除一定手续费），超过24小时不可退款
          </view>
        </view>
      </view>
      <!-- 协议 -->
      <view class="rule">
        请您在支付前仔细阅读
        <span class="ruleText" @click="goPayRule"> 《用户支付协议》 </span> ，
        付款即代表您同意此协议。
      </view>
    </view>
    <view class="detailPopupBottom">
      <PopupBottom ref="popup1">
        <template v-slot:outer-main>
          <view class="popupContainer">
            <view class="info">
              金额（元）： <span class="priceText">{{ orderInfo.orderPrice }}</span>
            </view>
            <view class="payBtn" @click="rePay">去付款</view>
          </view>
        </template>
      </PopupBottom>
    </view>
    <view class="modalContainer">
      <Modal v-model:show="successModalShow">
        <view class="modalBlock">
          <image class="successImg" src="" />
          <view class="text">订单支付成功</view>
        </view>
        <template v-slot:bottom>
          <view class="saveBtn" @click="share">分享给好友/群聊</view>
          <view class="copyBtn" @click="goOrderDetail">查看订单详情</view>
        </template>
      </Modal>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useAppInstance, useNav } from '@/hooks';
import { useSystemInfoStore } from '@/stores/systemInfo';
import { useLoginInfoStore } from '@/stores/loginInfo';
import PopupBottom from '@/components/popup-bottom';
import Modal from '@/components/modal';
import Constant from '@/lib/constant';
import api from '@/api';
import config from '@/api/config';
import { debounce } from '@/utils';
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
const successModalShow = ref(false);

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
      // 支付成功弹窗
      successModalShow.value = true;
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

const initData = async (id) => {
  try {
    const res = await api.order.getOrderDetail(id);
    console.log('getOrderDetail', res);
    orderInfo.value = res || {};
    actInfo = res && res.actJson ? JSON.parse(res.actJson) : {};
    stadiumInfo = res && res.stadiumJson ? JSON.parse(res.stadiumJson) : {};
    console.log(actInfo, stadiumInfo);
  } catch (error) {
    console.log('getOrderDetail error', error);
  }
};

onLoad(async (options) => {
  const { id } = options;
  console.log('onload', options);
  await $onLaunched;
  initData(id);
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
        padding: 32rpx 0;
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
              font-weight: 600;
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
      font-weight: 600;
      color: #ff6829;
      line-height: 56rpx;
    }
  }
  .payBtn {
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    line-height: 48rpx;
    padding: 20rpx 48rpx;
    background: linear-gradient(135deg, #ffab43 0%, #ff6829 100%);
    border-radius: 44rpx;
  }
}
</style>
