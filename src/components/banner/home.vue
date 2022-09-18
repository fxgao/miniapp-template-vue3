<template>
  <view class="bannerContainer">
    <swiper
      class="swiper"
      circular
      :autoplay="true"
      :interval="interval"
      :duration="duration"
      @change="swiperChange"
    >
      <swiper-item v-for="item in dataList" :key="item.id">
        <view class="swiper-item">
          <image class="itemImg" :src="item.url" />
        </view>
      </swiper-item>
    </swiper>
    <view class="dotContainer">
      <view
        :class="{ dotItem: true, active: index === currentIndex }"
        v-for="(item, index) in dataList"
        :key="item.id"
      ></view>
    </view>
  </view>
</template>

<script setup>
import { ref, toRefs } from 'vue';

const currentIndex = ref(0);

const props = defineProps({
  dataList: {
    require: true,
    type: Array
  },
  duration: {
    type: Number,
    default: 1000
  },
  interval: {
    type: Number,
    default: 4000
  }
});

const { dataList, duration, interval } = toRefs(props);

const swiperChange = (e) => {
  const { current } = e.detail;
  currentIndex.value = current;
};
</script>

<style lang="scss" scoped>
.bannerContainer {
}
</style>
