<template>
  <view class="stadiumCardContainer">
    <BaseList
      :title="info.stadiumName"
      :subTitle="subTitle"
      :img="coverImg"
      :labelList="info.labelList"
    >
      <view class="stadiumInfo">
        <view class="time">营业中{{info.operatStartTime}} - {{info.operatEndTime}}</view>
      </view>
    </BaseList>
  </view>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import BaseList from './base';

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
});
const { info } = toRefs(props);

const subTitle = computed(() => {
  return info.value.areaDetail;
});

const coverImg = computed(() => {
  return info.value?.stadiumHeadFigure || '';
});

</script>

<style lang="scss" scoped>
.stadiumCardContainer {
  margin-top: 32rpx;
  .stadiumInfo {
    position: relative;
    .time {
      display: inline;
      background: #FFEFE9;
      border-radius: 4rpx;
      font-size: 24rpx;
      color: #FF6829;
      line-height: 32rpx;
      padding: 0 8rpx;
    }
  }
}
</style>
