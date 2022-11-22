<template>
  <view class="activityCardContainer">
    <BaseList
      :title="info.activeName"
      :subTitle="subTitle"
      :img="coverImg"
      :labelList="labelList"
    >
      <view class="activityInfo">
        <view class="joinInfo">
          <view class="avatarBlock" v-if="joinList?.length">
            <image class="avatarItem" :style="{'zIndex': index + 1, 'transform': `translateX(-${index * 16}rpx)`}" :src="item.img" mode="aspectFix" v-for="(item,index) in joinList" :key="index" />
          </view>
          <view class="signUpText">{{info?.participantVo?.participanCount}}人报名/{{info?.participantVo?.participanCount}}人满</view>
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
  return info.value?.activeEndTime ? '截止报名 ' + info.value?.activeEndTime : info.value?.activeRemark;
});

const coverImg = computed(() => {
  return info.value?.activeHeadFigure || '';
});

const priceTypeText = computed(() => {
  return info.value?.activityPriceTypeValue || '';
});

const labelList = computed(() => {
  const resList = [];
  if (info.value.activeTypeValue) {
    resList.push({
      labelValue: info.value.activeTypeValue,
      type: 'type'
    });
  }
  if (info.value.applicablePeopleValue) {
    resList.push({
      labelValue: info.value.applicablePeopleValue
    });
  }
  return resList;
});

const joinList = computed(() => {
  const resList = info.value?.participantVo?.participantUserVo || [];
  return resList.slice(0, 3);
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
        margin-right: -16rpx;
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
