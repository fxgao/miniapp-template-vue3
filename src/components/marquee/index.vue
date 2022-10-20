<template>
  <view class="marquee-container" :style="{background: bgColor}">
    <swiper
      class="swiper"
      indicator-dots="false"
      autoplay="true"
      :interval="interval"
      circular="true"
      :vertical="true"
      :style="{background: innerColor}"
    >
      <swiper-item v-for="(item, index) in list" :key="index">
        <view class="innerContent">
          <image class="avatar" :src="item.avatar" />
          <view class="text">
            {{ item.text }}
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { ref, toRefs } from 'vue';

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  interval: {
    type: Number || Number,
    default: 5000
  },
  bgColor: {
    type: String,
    default: '#fff'
  },
  innerColor: {
    type: String,
    default: '#f5f5f5'
  }
});

const { list, interval, bgColor, innerColor } = toRefs(props);

</script>

<style lang="scss" scoped>
.marquee-container {
  padding: 16rpx 42rpx;
  .swiper {
    border-radius: 30rpx;
    height: 60rpx;
    padding: 10rpx 16rpx;
  }
}
</style>
