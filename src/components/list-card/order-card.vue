<template>
  <view class="orderCardContainer">
    <view class="infoBlock" :class="{'nopd': noPadding}">
      <image :src="headFigure" class="infoImg" mode="aspectFill"/>
      <view class="infoRight">
        <view class="infoTitle">{{ publishInfo?.publishName }}</view>
        <view class="infoSub">{{ stadiumInfo?.stadiumName }} {{ placeInfo?.placeName }}</view>
        <view class="infoSub">活动时间：{{ info.activeTime + ' ' }}{{ publishInfo.startTime }}{{ publishInfo.endTime ? '-' + publishInfo.endTime : '' }}</view>
      </view>
    </view>
    <template v-if="showBottom">
      <view class="bottomBlock">
        <view class="payText">{{payText}}: ¥{{info.orderPrice}}</view>
        <!-- 801 未查询订单  10未支付, 默认10 20支付成功 30支付失败 40待退款 50已退款 具体在constant.js-->
        <view class="actionBlock">
          <view class="actionBtn" v-if="info.orderStatus === 10">去支付</view>
          <view class="actionBtn plain" v-if="info.orderStatus === 20">申请退款</view>
          <view class="actionBtn plain" v-if="info.orderStatus === 40 || info.orderStatus === 80">退款审核中</view>
          <view class="actionBtn plain" v-if="info.orderStatus === 100">退款失败</view>
        </view>
      </view>
      <image v-if="info.orderStatus === 50 || info.orderStatus === 51" class="coverStatusIcon" :src="'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/refund-icon.png'"/>
      <image v-if="info.orderStatus === 30" class="coverStatusIcon" :src="'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/pay-fail-icon.png'"/>
      <image v-if="info.orderStatus === 60" class="coverStatusIcon" :src="'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/cancel-icon.png'"/>
      <image v-if="info.orderStatus === 70" class="coverStatusIcon" :src="'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/refund-fail-icon.png'"/>
    </template>
  </view>
</template>

<script setup>
import { toRefs, computed } from 'vue';
const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  noPadding: {
    type: Boolean,
    default: false
  },
  showBottom: {
    type: Boolean,
    default: false
  }
});
const { info } = toRefs(props);

const payText = computed(() => {
  if (info.value?.payStatus === 1) {
    return '定金';
  } else {
    return '金额';
  }
});

const headFigure = computed(() => {
  if (info.value?.actType === 'course_official' && info.value?.actType === 'course_experience') {
    return courseInfo.value?.courseHeadFigure || '';
  } else if (info.value?.actType === 'game') {
    return gameInfo.value?.gameImageUrl || '';
  } else {
    return actInfo.value?.activeHeadFigure || '';
  }
});

const actInfo = computed(() => {
  return info.value && info.value.tbBizActivityVo ? info.value.tbBizActivityVo : {};
});

const courseInfo = computed(() => {
  return info.value && info.value.tbBizCourseVo ? info.value.tbBizCourseVo : {};
});

const gameInfo = computed(() => {
  return info.value && info.value.tbBizGameVo ? info.value.tbBizGameVo : {};
});

const publishInfo = computed(() => {
  return info.value && info.value.tbBizInformationPublishVo ? info.value.tbBizInformationPublishVo : {};
});

const stadiumInfo = computed(() => {
  return info.value && info.value.tbBizStadiumVo ? info.value.tbBizStadiumVo : {};
});

const placeInfo = computed(() => {
  return info.value && info.value.tbBizPlaceVo ? info.value.tbBizPlaceVo : {};
});

</script>

<style lang="scss" scoped>
.orderCardContainer {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
  position: relative;
  .infoBlock {
    &.nopd {
      padding: 24rpx 0 32rpx;
    }
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
        height: 96rpx;
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
      font-weight: 700;
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
  .coverStatusIcon {
    position: absolute;
    bottom: 56rpx;
    right: 18rpx;
    width: 132rpx;
    height: 132rpx;
  }
}
</style>
