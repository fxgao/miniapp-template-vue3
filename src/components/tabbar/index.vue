<template>
  <view
    class="container"
    catchtouchmove="true"
    :style="{ paddingBottom: (systemInfo.safeBottom === 0 ? 8 : systemInfo.safeBottom) + 'px' }"
  >
    <view
      v-for="item in props.tabs"
      :key="item.key"
      :class="{ active: props.current === item.key }"
      @click.stop="currentChange(item)"
    >
      <view class="tab default-tab">
        <view class="icon-container">
          <image
            v-if="props.current === item.key"
            :src="item.selectedIconPath"
            :class="{ icon: true, active: true }"
          />
          <image v-if="props.current !== item.key" :src="item.iconPath" class="icon" />
        </view>
        <view class="title">
          {{ item.title }}
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { useSystemInfoStore } from '@/stores/systemInfo';

const props = defineProps({
  tabs: Array,
  current: String
});
const emit = defineEmits(['tabChange']);
const systemInfo = useSystemInfoStore();

const currentChange = (item) => {
  emit('tabChange', item.key);
};
console.log(systemInfo.safeBottom, props.tabs);
</script>
<style lang="scss" scoped>
.container {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: content-box;
  // height: 98rpx;
  padding: 10rpx 12rpx 8rpx 12rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 0 0 #dddddd;
  border-top: 2rpx solid #eeeeee;
}

.default-tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon-container {
    &.activity {
      width: 140rpx;
      margin: 0 -42rpx;
      transform: translateY(-16rpx);
    }

    display: flex;
    align-items: center;
    justify-content: center;
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 4rpx;
  }
  .icon {
    &.activity {
      width: 140rpx;
      height: 140rpx;
    }
    &.active {
      animation: tabActive 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    width: 48rpx;
    height: 48rpx;
  }

  .title {
    height: 28rpx;
    color: #a0a0a0;
    font-weight: 500;
    font-size: 20rpx;
    line-height: 28rpx;
  }
}

.active {
  .title {
    color: #ef6328;
  }
}
@keyframes tabActive {
  0% {
    width: 48rpx;
    height: 48rpx;
  }
  40% {
    width: 54rpx;
    height: 54rpx;
  }
  100% {
    width: 48rpx;
    height: 48rpx;
  }
}
</style>
