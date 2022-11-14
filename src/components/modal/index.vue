<template>
  <view class="modal-container" v-if="show">
    <view class="modal-bg" @click="handelClose"></view>
    <view class="modal-main">
      <view class="main-header">
        <view class="title" v-if="title">{{title}}</view>
        <image class="close-icon" src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/model-close-icon.png" @click="handelClose" />
      </view>
      <view class="main-content">
        <slot></slot>
      </view>
      <view class="main-bottom">
        <slot name="bottom"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, toRefs } from 'vue';
const emits = defineEmits(['update:show']);

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
});

const { show, title } = toRefs(props);
const handelClose = () => {
  emits('update:show', false);
};
</script>

<style lang="scss" scoped>
  .modal-container {
    @include flex-center;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    .modal-bg {
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
    }
    .modal-main {
      display: flex;
      flex-direction: column;
      padding: 32rpx;
      background: #fff;
      border-radius: 16rpx;
      .main-header {
        @include flex-between;
        .title {
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
          line-height: 48rpx;
        }
        .close-icon {
          width: 40rpx;
          height: 40rpx;
        }
      }
      .main-content, .main-bottom {
        margin-top: 48rpx;
      }
    }
  }
</style>
