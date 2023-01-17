<template>
  <view class="courseCardContainer" :class="{small: size === 'small'}" :style="style">
    <image class="bgImg" :src="bgImg" mode="aspectFill" />
    <view class="info">
      <view class="title">{{ info.courseName }}</view>
      <view class="labelList">
        <view class="labelItem" v-for="(item, index) in labelList" :key="index">
          {{item}}
        </view>
      </view>
      <view class="content">
        {{info.courseDesc}}
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, toRefs } from 'vue';

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  style: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'large'
  }
});
const { info, style, size } = toRefs(props);

const bgImg = computed(() => {
  return info.value?.courseHeadFigure || '';
});

const labelList = computed(() => {
  const resList = [];
  if (info.value.courseType == 1) {
    resList.push('体验课');
  } else {
    resList.push('正式课');
  }
  if (info.value.applicablePeopleValue) {
    resList.push(info.value.applicablePeopleValue);
  }
  if (info.value.applicableLevelValue) {
    resList.push(info.value.applicableLevelValue);
  }
  return resList;
});
</script>

<style lang="scss" scoped>
.courseCardContainer {
  &.small {
    width: 320rpx;
    .bgImg {
      width: 320rpx;
      height: 180rpx
    }
    .info {
      width: 320rpx;
      .content {
        width: 274rpx;
      }
    }
  }
  border-radius: 16rpx;
  overflow: hidden;
  width: 350rpx;
  position: relative;
  .bgImg {
    width: 350rpx;
    height: 196rpx
  }
  .info {
    width: 350rpx;
    height: 232rpx;
    background: rgba(255,255,255, 1);
    padding: 24rpx;
    .title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      line-height: 48rpx;
    }
    .labelList {
      @include flex-start;
      margin-top: 8rpx;
      // height: 40rpx;
      .labelItem {
        &:not(:last-child) {
          margin-right: 6rpx;
        }
        border-radius: 4rpx;
        background: #f8f8f8;
        padding: 4rpx 8rpx;
        font-size: 22rpx;
        color: #A0A0A0;
        line-height: 28rpx;
        flex: none;
      }
    }
    .content {
      @include text-ellipsis-2;
      width: 298rpx;
      height: 80rpx;
      margin-top: 16rpx;
      font-size: 24rpx;
      color: #A0A0A0;
      line-height: 40rpx;
      word-break: break-all;
      white-space: normal;
    }
  }
}
</style>
