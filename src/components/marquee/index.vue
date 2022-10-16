<template>
  <view class="marquee-container">
    <swiper
      class="swiper"
      indicator-dots="false"
      autoplay="true"
      :interval="interval"
      circular="true"
      vertical="true"
    >
      <swiper-item v-for="(item, index) in list" :key="index">
        <view class="innerContent">
          {{ item.text }}
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
    default: '#fff'
  }
});

const { list, interval, bgColor, innerColor } = toRefs(props);

</script>

<style lang="scss" scoped>
.marquee-container {
}
</style>
