<template>
  <view class="emptyContainer">
    <image class="emptyIcon" :src="icon" mode="aspectFit"/>
    <view class="title">{{ title }}</view>
    <view class="subTitle">{{ subTitle }}</view>
    <view v-if="buttonText" class="btn" @click="handleNav">{{ buttonText }}</view>
  </view>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useNav } from '@/hooks';

const { to } = useNav();

const props = defineProps({
  icon: {
    type: String,
    default: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/empty/no-content.png'
  },
  title: {
    type: String,
    default: '空空如也'
  },
  subTitle: {
    type: String,
    default: '目前还没有内容哦'
  },
  buttonText: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  navType: {
    type: String,
    default: 'navigateTo'
  },
  params: {
    type: Object,
    default: () => {}
  }
});

const { icon, title, subTitle, buttonText, url, navType, params } = toRefs(props);

const handleNav = () => {
  to(url.value, params.value, navType.value);
};

</script>

<style lang="scss" scoped>
.emptyContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 168rpx;
  .emptyIcon {
    width: 670rpx;
    height: 560rpx;
  }
  .title {
    font-size: 32rpx;
    color: #333333;
    line-height: 48rpx;
    transform: translateY(-56rpx);
  }
  .subTitle {
    font-size: 28rpx;
    color: #A0A0A0;
    line-height: 44rpx;
    transform: translateY(4rpx);
  }
  .btn {
    font-size: 32rpx;
    font-weight: 600;
    color: #FF6829;
    line-height: 48rpx;
    padding: 24rpx 84rpx;
    border-radius: 40rpx;
    border: 2rpx solid #FF6829;
    backdrop-filter: blur(2rpx);
    margin-top: 48rpx;
  }
}
</style>
