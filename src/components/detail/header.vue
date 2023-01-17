<template>
  <view class="detailHeaderContianer">
    <view class="title">{{title}}</view>
    <view class="labelBlock">
      <view class="labelItem" :style="item.style" v-for="(item, index) in labelList" :key="index">
        {{ item.label }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '标题'
  },
  labelList: {
    type: Array,
    default: () => []
  }
});

const { title, labelList } = toRefs(props);

</script>

<style lang="scss" scoped>
.detailHeaderContianer {
  .title {
    @include text-ellipsis;
    font-size: 40rpx;
    font-weight: 700;
    color: #333333;
    line-height: 56rpx;
  }
  .labelBlock {
    @include flex-start;
    margin-top: 16rpx;
    .labelItem {
      &:not(:last-child) {
        margin-right: 8rpx;
      }
      border-radius: 4rpx;
      background: #f8f8f8;
      font-size: 22rpx;
      color: #A0A0A0;
      line-height: 28rpx;
      padding: 4rpx 8rpx;
    }
  }
}
</style>
