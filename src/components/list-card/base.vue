<template>
  <view class="listCardContainer">
    <image class="img" :src="img" mode="aspectFill"/>
    <view class="info">
      <view class="title">
        {{ title }}
      </view>
      <view class="labelBlock" v-if="!isActivity">
        <view
          :class="'labelItem' + ' ' + item.type"
          v-for="(item, index) in labelList"
          :key="index"
          >{{ item.labelValue }}</view
        >
      </view>
      <view class="activitySubTitle" v-if="activitySubTitle && isActivity">
        <image
          src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/clock_icon.png"
          class="imgIcon"
        />
        {{ activitySubTitle }}
      </view>
      <view class="subTitle" :class="{'activity': isActivity}">
        <image
          src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/ball_icon.png"
          class="imgIcon"
          v-if="isActivity"
        />
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
  isActivity: {
    type: Boolean,
    default: false
  },
  activitySubTitle: {
    type: String,
    default: ''
  },
  labelList: {
    type: Array,
    default: () => []
  }
});

const { img, title, subTitle, isActivity, activitySubTitle, labelList } = toRefs(props);
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
      width: 412rpx
    }
    .labelBlock {
      @include flex-start;
      margin-top: 8rpx;
      .labelItem {
        &.type {
          background: #EEF7E6;
          color: #5DB612;
          // border: 1rpx solid transparent;
        }
        &.red {
          background: #FFEEEE;
          color: #FF5A5A;
          // border: 1rpx solid transparent;
        }
        &:not(:last-child) {
          margin-right: 8rpx;
        }
        padding: 4rpx 8rpx;
        border-radius: 4rpx;
        background: #f8f8f8;
        font-size: 22rpx;
        color: #A0A0A0;
        line-height: 28rpx;
      }
    }
    .subTitle {
      @include text-ellipsis;
      &.activity {
        margin-top: 8rpx;
        margin-bottom: -10rpx;
      }
      .imgIcon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 8rpx;
        margin-top: 4rpx;
        flex: none;
      }
      display: flex;
      align-items: flex-start;
      margin-top: 16rpx;
      font-size: 24rpx;
      color: #A0A0A0;
      line-height: 40rpx;
      max-width: 432rpx;
    }

    .activitySubTitle {
      display: flex;
      align-items: flex-start;
      .imgIcon {
        width: 32rpx;
        height: 32rpx;
        margin-right: 8rpx;
        margin-top: 4rpx;
        flex: none;
      }
      font-size: 24rpx;
      color: #A0A0A0;
      line-height: 40rpx;
      margin-top: 8rpx;
    }
    .slotInfo {
      margin-top: 8rpx;
    }
  }
}
</style>
