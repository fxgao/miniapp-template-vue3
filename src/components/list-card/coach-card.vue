<template>
  <view class="coach-card-container" :class="{small: size === 'small'}" :style="style">
    <view class="info">
      <image class="avatar" :src="img" mode="aspectFill"/>
      <view class="right">
        <view class="name">
          {{ name }}
        </view>
        <view class="labels">
          <view class="label-item red" v-if="level == 2">高级</view>
          <view class="label-item red" v-if="level == 3">精英</view>
          <view class="label-item red" v-if="level == 4">职业</view>
          <view class="label-item" v-if="nationality != 1">外教</view>
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
    type: Number || String
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
  },
  nationality: {
    type: String || Number,
    default: 1
  }
});

const { id, name, img, content, level, style, size, nationality } = toRefs(props);

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
    margin-bottom: 0;
    .info .right .name {
      max-width: 100rpx;
    }
    .content {
      @include text-ellipsis-2;
      word-break: break-all;
      white-space: pre-wrap;
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
        width: 128rpx;
        align-self: flex-end;
        padding-right: 4rpx
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
          background: #f8f8f8;
          font-size: 22rpx;
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
