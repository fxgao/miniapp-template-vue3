<template>
  <view class="coach-card-container" :class="{small: size === 'small'}" :style="style">
    <view class="info">
      <image class="avatar" :src="img" mode="aspectFill"/>
      <view class="right">
        <view class="name">
          {{ name }}
        </view>
        <view class="labels">
          <view class="label-item red" v-if="level == 1">高级</view>
          <view class="label-item">外教</view>
        </view>
      </view>
    </view>
    <view class="content">{{ content ? content : '教练简介' }}</view>
  </view>
</template>

<script setup>
import { toRefs } from 'vue';
import { useNav } from '@/hooks';
const { to } = useNav();
const props = defineProps({
  id: {
    type: Number || String,
    required: true
  },
  name: {
    type: String,
    default: '教练'
  },
  img: {
    type: String,
    default: ''
  },
  level: {
    type: String || Number
  },
  content: {
    type: String,
    default: ''
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

const { id, name, img, content, level, style, size } = toRefs(props);

const goCoachDetail = () => {
  to();
};
</script>

<style lang="scss" scoped>
.coach-card-container {
  &.small {
    width: 318rpx;
    height: 264rpx;
    background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/bg/coach-bg-small.png') 0 0 no-repeat;
    background-size: contain;
    .info .right .name {
      max-width: 96rpx;
    }
    .content {
      @include text-ellipsis-2;
      height: 80rpx;
    }
  }
  width: 350rpx;
  height: 304rpx;
  background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/bg/coach-bg.png') 0 0 no-repeat;
  background-size: contain;
  padding: 24rpx;
  margin-bottom: 32rpx;
  overflow: hidden;
  .info {
    @include flex-between;
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 16rpx;
      background: #f5f5f5;
      flex-shrink: 0;
    }
    .right {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 120rpx;
      margin-left: 16rpx;
      .name {
        @include text-ellipsis;
        font-size: 32rpx;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 48rpx;
        text-align: center;
        width: 124rpx;
        align-self: flex-end;
      }
      .labels {
        @include flex-start;
        margin-top: 38rpx;
        .label-item {
          &:not(:last-child) {
            margin-right: 8rpx;
          }
          &.red {
            background: #FFEFE9;
            color: #FF6829;
            border: none;
          }
          border-radius: 4rpx;
          border: 1rpx solid #979797;
          font-size: 24rpx;
          color: #A0A0A0;
          line-height: 24rpx;
          padding: 4rpx 8rpx;
        }
      }
    }
  }
  .content {
    @include text-ellipsis-3;
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #A0A0A0;
    line-height: 40rpx;
    height: 120rpx;
  }
}
</style>
