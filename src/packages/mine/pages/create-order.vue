<template>
  <view class="page">
    <nav-bar
      ref="navBar"
      title="确认订单"
      showBackIcon="black"
      titleColor="color:#2F2E3B;"
      backgroundColor="rgba(255,255,255,1)"
      :navCenterStyle="'flex-end'"
    ></nav-bar>
    <view class="pageContainer" :style="popup1 ? 'padding-bottom:' + popup1.topSlotHeight : ''">
      <!-- 用户信息 -->
      <view class="userInfoBlock" @click="goEditProfile">
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
              <view
                class="userName"
                :class="{ red: !loginInfoData?.tel || !loginInfoData?.openId }"
              >
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
                {{ Constant.LEVEL_GRADE_2STRING_MAP[loginInfoData?.level] }} 级
              </view>
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
            <image :src="confirmInfo.img" class="infoImg" />
            <view class="infoRight">
              <view class="infoTitle">{{ confirmInfo.name }}</view>
              <view class="infoSub">{{ confirmInfo.area }}</view>
              <view class="infoSub">活动时间{{ confirmInfo.time }}</view>
            </view>
          </view>
          <view class="priceInfo">
            <view class="priceExplain">{{ priceExplainText }}</view>
            <view class="price">
              定金<span class="priceText">¥{{ price }}</span>
            </view>
          </view>
        </view>
      </view>
      <!-- 订单备注 -->
      <view class="orderRemarkBlock">
        <view class="title">订单备注</view>
        <view class="content">
          <textarea
            class="textArea"
            :value="demand"
            @blur="demandChange"
            @input="demandChange"
            :maxlength="300"
            placeholder="选填，请输入需备注内容，如：指定教练性别"
            placeholder-style="color: #C0C0C0;font-size: 14px;"
          />
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
              金额（元）： <span class="priceText">{{ price }}</span>
            </view>
            <view class="payBtn" @click="pay">去付款</view>
          </view>
        </template>
      </PopupBottom>
    </view>
    <view class="modalContainer">
      <Modal v-model:show="successModalShow">
        <view class="modalBlock">
          <image
            class="successImg"
            src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/success-icon.png"
          />
          <view class="text">订单支付成功</view>
        </view>
        <template v-slot:bottom>
          <view class="actionBlock">
            <button open-type="share" class="copyBtn">分享给好友/群聊</button>
            <view class="saveBtn" @click="goOrderDetail">查看订单详情</view>
          </view>
        </template>
      </Modal>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useSystemInfoStore } from '@/stores/systemInfo';
import { useLoginInfoStore } from '@/stores/loginInfo';
import { useAppInstance, useNav } from '@/hooks';
import payment from '@/lib/payment';
import { debounce } from '@/utils';
import api from '@/api';
import config from '@/api/config';
import PopupBottom from '@/components/popup-bottom';
import Modal from '@/components/modal';
import MpHtml from '@/components/mp-html/mp-html.vue';
import Constant from '@/lib/constant';

const BASE_URL = config.REQUEST_URL_PREFIX;
const systemInfo = useSystemInfoStore();
const loginInfoStore = useLoginInfoStore();
const { loginInfoData } = storeToRefs(loginInfoStore);
const { $onLaunched } = useAppInstance();
const { to } = useNav();

const popup1 = ref(null);
const successModalShow = ref(false);

/**
 * 正式课程   course_official
 * 临时课程  course_experience
 * 比赛 game
 * 活动--约球 about_ball
 * 活动--发球机 serve_machine
 * 活动--陪练 practice_partner
 * 活动--有痒多球 have_many_goals
 **/
const orderType = ref('');
const orderSn = ref('');
const actId = ref(0);
const pId = ref(0);
const price = ref(0);
const confirmInfo = ref({
  img: '',
  name: '得乐新媒体馆2号场有氧多球16-18',
  area: '北京市朝阳区周家庄村111号',
  time: '2022.09.24 20:00 - 22:00'
});
const demand = ref('');

const priceExplainText = computed(() => {
  return '此活动需支付尾款';
});

const submit = () => {
  const levelStart = parseInt(confirmInfo.value.levelStart);
  const levelEnd = parseInt(confirmInfo.value.levelEnd);
  if (!loginInfoData.value?.tel || !loginInfoData.value?.openId) {
    uni.showToast({
      title: '请先填写用户信息',
      icon: 'none'
    });
    return;
  }
  if (loginInfoData.value?.level > levelEnd || loginInfoData.value?.level < levelStart) {
    uni.showToast({
      title: '您的等级要不符合要求，请看看其他活动',
      icon: 'none'
    });
    return;
  }
  uni.showLoading();
  const params = {
    retry_times: 5
  };
  const data = {
    orderType: orderType.value,
    actId: actId.value,
    publishId: pId.value,
    orderAmount: price.value,
    remark: demand.value || ''
  };

  // 支付参数
  const payRequestParams = {
    url: BASE_URL + '/wx/order/prepay',
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
      orderSn.value = successRes.orderNo;
    },
    (error) => {
      console.log('error=====', error);
      uni.hideLoading();
      uni.showToast({
        title: error.msg || '支付失败',
        icon: 'none',
        duration: 2000
      });
      error.orderId &&
        uni.redirectTo({
          url: '/pages/order-detail?orderId=' + error.orderId + '&fromWhere=payFail'
        });
    }
  );
};

const pay = debounce(submit, 2000, true);

const goEditProfile = () => {
  to('/edit-profile', {
    navBack: true
  });
};

const goOrderDetail = () => {
  to('/mine/order-detail', {
    id: orderSn.value
  });
};

onLoad(async (options) => {
  const { activityId, publishId, type, price: priceValue, info } = options;
  console.log(activityId, type, priceValue, info);
  await $onLaunched;
  orderType.value = type;
  actId.value = activityId;
  pId.value = publishId;
  price.value = priceValue;
  confirmInfo.value = JSON.parse(info);
});
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100vh;
}
.pageContainer {
  background: #f5f5f5;
  overflow: hidden;
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
        &::after {
          content: '';
          position: absolute;
          right: -32rpx;
          top: 50%;
          transform: translateY(-50%);
          height: 32rpx;
          width: 32rpx;
          font-size: 32rpx;
          background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png');
          background-size: contain;
        }
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
  .userInfoBlock,
  .orderInfoBlock,
  .orderRemarkBlock,
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
        padding: 0 0;
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
        @include flex-between;
        padding-top: 32rpx;
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
  .infoBlock {
    &:not(:first-child) {
      margin-top: 16rpx;
    }
    &.list {
      background: linear-gradient(180deg, #ffffff 0, #f5f5f5 120rpx, #f5f5f5 100%);
    }
    background: #fff;
    padding: 32rpx 40rpx;
    .title {
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      line-height: 52rpx;
      margin-bottom: 32rpx;
    }
    .infoItem {
      &:not(:first-child) {
        margin-top: 16rpx;
      }
      @include flex-start;
      align-items: flex-start;
      .leftText {
        font-size: 28rpx;
        color: #a0a0a0;
        line-height: 44rpx;
        flex: none;
      }
      .right {
        font-size: 28rpx;
        color: #333333;
        line-height: 44rpx;
      }
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
    width: 560rpx;
    .successImg {
      width: 128rpx;
      height: 128rpx;
      margin: 0 68rpx;
    }
    .text {
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      line-height: 52rpx;
      margin-top: 16rpx;
    }
  }
  .actionBlock {
    width: 100%;
    margin-bottom: 32rpx;
    .saveBtn {
      border-radius: 40rpx;
      border: 2rpx solid #ff6829;
      backdrop-filter: blur(2rpx);
      font-size: 32rpx;
      font-weight: 700;
      color: #ff6829;
      line-height: 48rpx;
      padding: 20rpx 36rpx;
      text-align: center;
      margin-top: 32rpx;
    }
    .copyBtn {
      background: linear-gradient(135deg, #ffab43 0%, #ff6829 100%);
      border-radius: 44rpx;
      font-size: 32rpx;
      font-weight: 700;
      color: #ffffff;
      line-height: 48rpx;
      padding: 20rpx 36rpx;
      text-align: center;
    }
  }
}
</style>
