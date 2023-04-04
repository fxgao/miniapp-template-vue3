<template>
  <view class="stadiumCardContainer">
    <BaseList
      :title="stadiumName"
      :subTitle="subTitle"
      :img="coverImg"
      :isActivity="true"
      :labelList="labelList"
    >
      <view class="stadiumInfo">
        <view v-if="operatStatus === Constant.OPERA_STATIS_MAP.OPEN" class="subText">
          <image
            src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/clock_icon.png"
            class="imgIcon"
          />
          营业时间：{{operatStartTime}} - {{operatEndTime}}
        </view>
        <view class="time disable" v-if="operatStatus === Constant.OPERA_STATIS_MAP.CLOSE">待营业</view>
        <view class="time disable" v-if="operatStatus === Constant.OPERA_STATIS_MAP.REST">休息中</view>
        <view class="time" v-if="operatStatus === Constant.OPERA_STATIS_MAP.OPEN">营业中</view>
      </view>
    </BaseList>
  </view>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import BaseList from './base';
import Constant from '@/lib/constant';

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
});
const { info } = toRefs(props);

const subTitle = computed(() => {
  return info.value?.areaDetail || '';
});

const coverImg = computed(() => {
  return info.value?.stadiumHeadFigure || '';
});

const operatStatus = computed(() => {
  return info.value?.operatStatus || '';
});

const operatStartTime = computed(() => {
  return info.value?.operatStartTime || '';
});

const operatEndTime = computed(() => {
  return info.value?.operatEndTime || '';
});

const stadiumName = computed(() => {
  return info.value?.stadiumName || '';
});

const labelList = computed(() => {
  return info.value?.labelList || [];
});

</script>

<style lang="scss" scoped>
.stadiumCardContainer {
  margin-top: 32rpx;
  .stadiumInfo {
    position: relative;
    .subText {
      display: flex;
      align-items: flex-start;
      font-size: 24rpx;
      color: #A0A0A0;
      line-height: 40rpx;
      margin-top: 8rpx;
      .imgIcon {
        flex: none;
        width: 32rpx;
        height: 32rpx;
        margin-top: 4rpx;
        margin-right: 8rpx;
      }
    }
    .time {
      &.disable {
        color: #A0A0A0;
        background: rgba(0,0,0,0.05);
        margin-top: 24rpx;
      }
      display: inline-block;
      background: #FFEFE9;
      border-radius: 4rpx;
      font-size: 24rpx;
      color: #FF6829;
      line-height: 32rpx;
      padding: 0 8rpx;
      margin-top: 16rpx;
    }
  }
}
</style>
