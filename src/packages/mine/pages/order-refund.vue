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
        <order-card :info="orderInfo" :noPadding="true"></order-card>
        <view class="priceInfo">
          <view class="price"
            >合计支付：<span class="priceText">¥{{ orderInfo?.orderPrice }}</span>
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="refundOrderInfo">
        <view class="refundOrderItem" @click="showRefundReasonPopup">
          <view class="refundTitle require">退款原因</view>
          <view class="refundContent">
            <view class="reasonText">{{ reasonText }}</view>
            <image
              src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png"
              class="arrow"
            />
          </view>
        </view>
        <view class="refundOrderItem">
          <view class="refundTitle require">退款金额</view>
          <view class="refundContent">
            <view class="refundPriceText">¥{{ orderInfo?.orderPrice }}</view>
          </view>
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
          <view class="actionBlock">
            <view class="actionBtn" @click="confirm">提交申请</view>
          </view>
        </template>
      </PopupBottom>
      <PopupBottom ref="popup2">
        <template v-slot:inner-main>
          <view class="title">退款原因</view>
          <view
            class="refundReasonItem"
            v-for="(item, index) in refundReasonList"
            :key="index"
            @click="selectRefundReason(item)"
          >
            <view class="refundReasonItemText">{{ item }}</view>
            <image
              class="refundReasonItemIcon"
              :src="
                refundReason === item
                  ? 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/checkbox-checked.png'
                  : 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/checkbox-disable.png'
              "
            />
          </view>
        </template>
        <template v-slot:inner-main-bottom>
          <view class="actionBlock">
            <view class="actionBtn" @click="chooseReason">确定</view>
          </view>
        </template>
      </PopupBottom>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAppInstance } from '@/hooks';
import api from '@/api';
import PopupBottom from '@/components/popup-bottom';
import OrderCard from '@/components/list-card/order-card';

const { $onLaunched } = useAppInstance();

const popup1 = ref(null);
const popup2 = ref(null);

const reason = ref('');
const refundReason = ref('');
const refundReasonList = ref(['活动时间冲突', '活动内容不符', '活动场地不符']);

const showRefundReasonPopup = () => {
  popup2.value.show();
};

const reasonText = computed(() => {
  return reason.value ? reason.value : '请选择退款原因';
});
const chooseReason = () => {
  reason.value = refundReason.value;
  popup2.value.hide();
};
const selectRefundReason = (item) => {
  refundReason.value = item;
};

// 确定退款
const confirm = () => {
  if (!reason.value) {
    uni.showToast({
      title: '请选择退款原因',
      icon: 'none'
    });
    return;
  }
  api.order
    .refundOrder({
      orderId: orderInfo.value.orderSn,
      reason: reason.value
    })
    .then(res => {
      console.log('refundOrder', res);
      if (res.resultCode !== 200) {
        uni.showToast({
          title: res.codeDes,
          icon: 'none'
        });
      } else {
        const pages = getCurrentPages();
        const orderListPage = pages[pages.length - 3].$vm;
        orderListPage.changeOrderStatus(orderInfo.value.orderSn, 80);
        uni.showToast({
          title: '退款申请已提交',
          icon: 'success'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      }
    })
    .catch((error) => {
      uni.showToast({
        title: '退款申请失败',
        icon: 'none'
      });
      console.log('refund error', error);
    });
};

const orderInfo = ref({});
let actInfo = reactive({});
let stadiumInfo = reactive({});

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
.page {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}
.pageContainer {
  padding-bottom: 32rpx;
  .orderInfo,
  .refundOrderInfo,
  .refundNotice {
    padding: 32rpx 40rpx;
    margin-top: 16rpx;
    background: #fff;
    .title {
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      line-height: 52rpx;
    }
    .content {
      margin-top: 32rpx;
      font-size: 28rpx;
      color: #a0a0a0;
      line-height: 44rpx;
    }
  }
  .priceInfo {
    @include flex-end;
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
  .refundOrderInfo {
    .refundOrderItem {
      &:not(:last-child) {
        padding-bottom: 32rpx;
        margin-bottom: 32rpx;
        border-bottom: 1rpx solid #eee;
      }
      @include flex-between;
      .refundTitle {
        &.required {
          &:after {
            content: '*';
            position: absolute;
            top: 0;
            left: -8rpx;
            font-size: 32rpx;
            color: #ff5a5a;
            line-height: 48rpx;
          }
        }
        font-size: 32rpx;
        color: #a0a0a0;
        line-height: 48rpx;
        position: relative;
      }
      .refundContent {
        @include flex-start;
        align-items: center;
        .reasonText {
          font-size: 32rpx;
          color: #a0a0a0;
          line-height: 48rpx;
        }
        .arrow {
          width: 32rpx;
          height: 32rpx;
          margin-left: 8rpx;
        }
        .refundPriceText {
          font-size: 32rpx;
          font-weight: 700;
          color: #ff6829;
          line-height: 48rpx;
        }
      }
    }
  }
}
.detailPopupBottom {
  .actionBlock {
    padding: 16rpx 40rpx;
    .actionBtn {
      @include btn-normal;
    }
  }
  .title {
    padding: 32rpx 40rpx;
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
    line-height: 48rpx;
    text-align: center;
  }
  .refundReasonItem {
    @include flex-between;
    padding: 16rpx 40rpx;
    .refundReasonItemText {
      font-size: 32rpx;
      color: #333333;
      line-height: 48rpx;
    }
    .refundReasonItemIcon {
      width: 40rpx;
      height: 40rpx;
    }
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
