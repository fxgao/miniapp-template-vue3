<template>
  <view class="page">
    <nav-bar
      ref="navBar"
      title="申请退款"
      showBackIcon="black"
      titleColor="color:#2F2E3B;"
      backgroundColor="rgba(255,255,255,1)"
      :navCenterStyle="'flex-end'"
    ></nav-bar>
    <view class="pageContainer" :style="popup1 ? 'padding-bottom:' + popup1.topSlotHeight : ''">
      <!-- 订单信息 -->
      <view class="orderInfo">
        <view class="title">退款订单</view>
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
            <view class="priceInfoItem right">
              <view class="price"
                >合计支付：<span class="priceText">¥{{ orderInfo?.orderPrice }}</span>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="refundOrderInfo">
        <view class="content">

        </view>
      </view>
      <!-- 退款说明 -->
      <view class="refundNotice">
        <view class="title">退款说明</view>
        <view class="content">
          活动开始24小时前可全额退款（根据总金额，微信支付平台将扣除一定手续费），超过24小时不可退款
        </view>
      </view>
    </view>
    <view class="detailPopupBottom">
      <PopupBottom ref="popup1">
        <template v-slot:outer-main>
          <view class="actionBtn" @click="confirm">提交申请</view>
        </template>
      </PopupBottom>
    </view>
    <view class="modalContainer">
      <Modal v-model:show="successModalShow">
        <view class="modalBlock">
          <image class="successImg" src="" />
          <view class="text">退款成功</view>
        </view>
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
import { useAppInstance } from '@/hooks';
import api from '@/api';
import PopupBottom from '@/components/popup-bottom';
import Modal from '@/components/modal';

const systemInfo = useSystemInfoStore();
const loginInfoStore = useLoginInfoStore();
const { loginInfoData } = storeToRefs(loginInfoStore);
const { $onLaunched } = useAppInstance();

const popup1 = ref(null);
const successModalShow = ref(false);
const confirmInfo = ref({});

onLoad(async (options) => {
  const { confirmInfo } = options;
  await $onLaunched;
  console.log(confirmInfo);
  confirmInfo.value = confirmInfo
    ? JSON.parse(confirmInfo)
    : {
        price: 100,
        num: 1
      };
});
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100vh;
}
.pageContainer {
  background: #f5f5f5;
  .infoBlock {
    &:not(:first-child) {
      margin-top: 16rpx;
    }
    &.list {
      background: linear-gradient(180deg, #ffffff 0, #f5f5f5 80rpx, #f5f5f5 100%);
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
      backdrop-filter: blur(1rpx);
      font-size: 32rpx;
      font-weight: 600;
      color: #ff6829;
      line-height: 48rpx;
      padding: 20rpx 36rpx;
    }
    .copyBtn {
      background: linear-gradient(135deg, #ffab43 0%, #ff6829 100%);
      border-radius: 44rpx;
      font-size: 32rpx;
      font-weight: 600;
      color: #ffffff;
      line-height: 48rpx;
      padding: 20rpx 36rpx;
    }
  }
}
</style>
