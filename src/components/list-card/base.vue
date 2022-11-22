<template>
  <view class="listCardContainer">
    <image class="img" :src="img" />
    <view class="info">
      <view class="title">
        {{ title }}
      </view>
      <view class="labelBlock">
        <view
          :class="'labelItem' + ' ' + item.type"
          v-for="(item, index) in labelList"
          :key="index"
          >{{ item.labelValue }}</view
        >
      </view>
      <view class="subTitle">
        {{ subTitle }}
      </view>
      <view class="slotInfo">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  img: {
    type: String
  },
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  },
  labelList: {
    type: Array,
    default: () => []
  }
});

const { img, title, subTitle, labelList } = toRefs(props);
</script>

<style lang="scss" scoped>
.listCardContainer {
  @include flex-start;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  overflow: hidden;
  .img {
    flex-shrink: 0;
    width: 192rpx;
    height: 192rpx;
    border-radius: 16rpx;
    background: #f5f5f5;
  }
  .info {
    display: flex;
    flex-direction: column;
    margin-left: 16rpx;
    .title {
      @include text-ellipsis;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      line-height: 48rpx;
      width: 404rpx
    }
    .labelBlock {
      @include flex-start;
      margin-top: 8rpx;
      .labelItem {
        &.type {
          background: #EEF7E6;
          color: #5DB612;
          border: 1rpx solid transparent;
        }
        &.red {
          background: #FFEEEE;
          color: #FF5A5A;
          border: 1rpx solid transparent;
        }
        &:not(:last-child) {
          margin-right: 8rpx;
        }
        padding: 4rpx 8rpx;
        border-radius: 4rpx;
        border: 1rpx solid #979797;
        font-size: 24rpx;
        color: #A0A0A0;
        line-height: 24rpx;
      }
    }
    .subTitle {
      margin-top: 16rpx;
      font-size: 24rpx;
      color: #A0A0A0;
      line-height: 40rpx;
    }
    .slotInfo {
      margin-top: 8rpx;
    }
  }
}
</style>
