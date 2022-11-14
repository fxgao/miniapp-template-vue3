<template>
  <view class="orderCardContainer">
    <view class="infoBlock">
      <image :src="actInfo?.activeHeadFigure" class="infoImg" />
      <view class="infoRight">
        <view class="infoTitle">{{ actInfo?.activeName }}</view>
        <view class="infoSub">{{ stadiumInfo?.stadiumName }}</view>
        <view class="infoSub">活动时间{{ actInfo.time }}</view>
      </view>
    </view>
    <view class="bottomBlock">
      <view class="payText">{{payText}}: ¥{{info.orderPrice}}</view>
      <!-- 801 未查询订单  10未支付, 默认10 20支付成功 30支付失败 40待退款 50已退款 -->
      <view class="actionBlock">
        <view class="actionBtn" v-if="info.orderStatus === 10">去支付</view>
        <view class="actionBtn plain" v-if="info.orderStatus === 20">申请退款</view>
      </view>
    </view>
    <image v-if="coverStatus" class="coverStatusIcon" :src="'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon' + coverStatus + '.png'"  />
  </view>
</template>

<script setup>
import { toRefs, computed } from 'vue';
const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
});
const { info } = toRefs(props);

const payText = computed(() => {
  if (info.value?.payStatus === 1) {
    return '实付定金';
  } else {
    return '实付总额';
  }
});

const actInfo = computed(() => {
  return info.value && info.value.actJson ? JSON.parse(info.value.actJson) : {};
});

const stadiumInfo = computed(() => {
  return info.value && info.value.stadiumJson ? JSON.parse(info.value.stadiumJson) : {};
});

</script>

<style lang="scss" scoped>
.orderCardContainer {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
  .infoBlock {
    @include flex-start;
    align-items: flex-start;
    padding: 24rpx 24rpx 32rpx;
    border-bottom: 1rpx solid #eee;
    .infoImg {
      width: 192rpx;
      height: 192rpx;
      margin-right: 16rpx;
      border-radius: 16rpx;
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
  .bottomBlock {
    @include flex-between;
    padding: 28rpx;
    .payText {
      font-size: 32rpx;
      font-weight: 600;
      color: #333333;
      line-height: 48rpx;
    }
    .actionBlock {
      @include flex-end;
      .actionBtn {
        font-size: 28rpx;
        color: #FF6829;
        line-height: 44rpx;
        padding: 12rpx 32rpx;
        border-radius: 40rpx;
        border: 1rpx solid #FF6829;
        &.plain {
          &.disable {
            color: #ECECEC;
          }
          border: 1rpx solid #ECECEC;
          color: #333;
        }
      }
    }
  }
}
</style>
