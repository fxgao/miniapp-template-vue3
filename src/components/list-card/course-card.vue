<template>
  <view class="courseCardContainer" :class="{small: size === 'small'}" :style="style">
    <image class="bgImg" :src="bgImg" mode="widthFix" />
    <view class="info">
      <view class="title">{{ info.courseName }}</view>
      <view class="labelList">
        <view class="labelItem" v-for="item in info.labelList" :key="item.id">
          {{item.labelLabel}}
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
</script>

<style lang="scss" scoped>
.courseCardContainer {
  &.small {
    width: 320rpx;
    .bgImg {
      width: 320rpx;
      height: 320rpx
    }
    .info {
      width: 320rpx;
    }
  }
  border-radius: 16rpx;
  overflow: hidden;
  width: 350rpx;
  height: 412rpx;
  position: relative;
  .bgImg {
    width: 350rpx;
    height: 350rpx
  }
  .info {
    position: absolute;
    bottom: 0;
    width: 350rpx;
    height: 232rpx;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(2rpx);
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
      height: 36rpx;
      .labelItem {
        &:not(:last-child) {
          margin-right: 8rpx;
        }
        border-radius: 4rpx;
        border: 1rpx solid #979797;
        padding: 4rpx 8rpx;
        font-size: 24rpx;
        color: #A0A0A0;
        line-height: 24rpx;
      }
    }
    .content {
      @include text-ellipsis-2;
      margin-top: 16rpx;
      font-size: 24rpx;
      color: #A0A0A0;
      line-height: 40rpx;
    }
  }
}
</style>
