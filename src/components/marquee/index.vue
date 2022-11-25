<template>
  <view class="marquee-container" :style="{background: bgColor}">
    <swiper
      class="swiper"
      :indicator-dots="false"
      autoplay="true"
      :interval="interval"
      circular="true"
      :vertical="true"
      :style="{background: innerColor}"
    >
      <swiper-item v-for="(item, index) in list" :key="index">
        <view class="innerContent">
          <image class="avatar" :src="item.photo || 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/default-avatar.png'" />
          <view class="text">
            {{ item.nickName }}正在活动中 | 已有{{total}}人参与活动
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue';
import api from '@/api';

const props = defineProps({
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

const { interval, bgColor, innerColor } = toRefs(props);

const list = ref([]);
const total = ref(0);

onMounted(async () => {
  const res = await api.activity.getMarqueeList();
  list.value = res.headCountConsumer;
  total.value = res.headCount;
});

</script>

<style lang="scss" scoped>
.marquee-container {
  padding: 16rpx 42rpx;
  .swiper {
    border-radius: 30rpx;
    height: 60rpx;
    padding: 10rpx 16rpx;
    .innerContent {
      @include flex-start;
      .avatar {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #fff;
        flex:none;
      }
      .text {
        @include text-ellipsis;
        font-size: 24rpx;
        color: #FF6829;
        line-height: 40rpx;
        margin-left: 16rpx;
      }
    }
  }
}
</style>
