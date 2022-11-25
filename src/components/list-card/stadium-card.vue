<template>
  <view class="stadiumCardContainer">
    <BaseList
      :title="stadiumName"
      :subTitle="subTitle"
      :img="coverImg"
      :labelList="labelList"
    >
      <view class="stadiumInfo">
        <view class="time">营业中{{operatStartTime}} - {{operatEndTime}}</view>
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
  return info.value?.areaDetail || '';
});

const coverImg = computed(() => {
  return info.value?.stadiumHeadFigure || '';
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
