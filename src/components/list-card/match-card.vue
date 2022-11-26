<template>
  <view class="matchCardContainer">
    <BaseList
      :title="info.gameName || info.publishName"
      :subTitle="subTitle"
      :img="coverImg"
      :labelList="labelList"
    >
      <view class="matchInfo">
        <view class="place">{{info.stadiumName || '得乐体育'}}</view>
        <view class="btns" v-if="!overTime">
          <view class="btn" v-if="info.gameStatus === 1">报名</view>
          <view class="btn grey" v-else>结束</view>
        </view>
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
  },
  overTime: {
    type: Boolean,
    default: false
  }
});
const { info, overTime } = toRefs(props);

const subTitle = computed(() => {
  return info.value.activityDate;
});

const coverImg = computed(() => {
  return info.value?.gameImageUrl || '';
});

const labelList = computed(() => {
  const resList = [];
  if (info.value.gameTypeValue) {
    resList.push({
      labelValue: info.value.gameTypeValue,
      type: 'red'
    });
  }
  if (info.value.activeTypeValue) {
    resList.push({
      labelValue: info.value.activeTypeValue,
      type: 'type'
    });
  }
  if (info.value.applicablePeopleValue) {
    resList.push({
      labelValue: info.value.applicablePeopleValue
    });
  }
  if (info.value.applicableAgeValue) {
    resList.push({
      labelValue: info.value.applicableAgeValue
    });
  }
  return resList;
});

</script>

<style lang="scss" scoped>
.matchCardContainer {
  margin-top: 32rpx;
  .matchInfo {
    position: relative;
    .place {
      @include text-ellipsis;
      font-size: 24rpx;
      color: #A0A0A0;
      line-height: 40rpx;
      width: 300rpx;
    }
    .btns {
      position: absolute;
      top: -38rpx;
      right: 0;
      .btn {
        &.grey {
          background: #C0C0C0;
          color: #FFFFFF;
        }
        padding: 16rpx 32rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 34rpx;
        background: linear-gradient(135deg, #FFAB43 0%, #FF6829 100%);
        border-radius: 32rpx;
      }
    }
  }
}
</style>
