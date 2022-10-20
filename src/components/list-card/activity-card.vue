<template>
  <view class="activityCardContainer">
    <BaseList
      :title="info.activeName"
      :subTitle="subTitle"
      :img="coverImg"
      :labelList="info.labelList"
    >
      <view class="activityInfo">
        <view class="joinInfo">
          <view class="avatarBlock">
            <image class="avatarItem" :style="{'zIndex': index + 1, 'transform': `translateX(-${index * 16}rpx)`}" :src="item.imageUrl" mode="aspectFix" v-for="(item,index) in info.avatarList" :key="index" />
          </view>
          <view class="signUpText">{{info.completePersonCount}}人报名/{{info.completePersonCount}}满</view>
        </view>
        <view class="price">
          ¥{{info.activityPrice}}{{priceTypeText}}
        </view>
      </view>
    </BaseList>
  </view>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import BaseList from './base';

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
});
const { info } = toRefs(props);

const subTitle = computed(() => {
  return '截止报名 ' + info.value.activeEndTime;
});

const coverImg = computed(() => {
  return info.value?.activeHeadFigure || '';
});

const priceTypeText = computed(() => {
  return info.activityPriceType === 1 ? 'AA' : '/人均';
});

</script>

<style lang="scss" scoped>
.activityCardContainer {
  margin-top: 32rpx;
  .activityInfo {
    @include flex-between;
    align-items: flex-end;
    .joinInfo {
      @include flex-start;
      .avatarBlock {
        @include flex-center;
        .avatarItem {
          position: relative;
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          border: 2rpx solid #FFFFFF;
          box-sizing: border-box;
          background: #f5f5f5;
        }
      }
      .signUpText {
        font-size: 24rpx;
        color: #A0A0A0;
        line-height: 40rpx;
        margin-left: -16rpx;
      }
    }
    .price {
      font-size: 32rpx;
      font-weight: 600;
      color: #FF6829;
      line-height: 48rpx;
    }
  }
}
</style>
