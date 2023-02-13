<template>
  <view class="activityCardContainer">
    <BaseList :title="info.activeName" :subTitle="subTitle" :img="coverImg" :isActivity="true" :activitySubTitle="activitySubTitle">
      <view class="activityInfo">
        <view class="joinInfo">
          <view class="avatarBlock" :style="{ marginRight: `-${(joinList?.length - 1) * 16}rpx` }" v-if="joinList?.length">
            <image
              class="avatarItem"
              :style="{ zIndex: index + 1, transform: `translateX(-${index * 16}rpx)` }"
              :src="
                item.img ||
                'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/default-avatar.png'
              "
              mode="aspectFix"
              v-for="(item, index) in joinList"
              :key="index"
            />
          </view>
          <view class="signUpText" :class="{ noml: !joinList?.length }"
            >{{ info?.participantVo.participanCount || 0 }}人已报/最多{{
              info?.participantVo.participanCountMax || 'x'
            }}人</view
          >
        </view>
        <view class="price"> ¥{{ info?.activityPriceTotalAmount || info?.activityPrice || info?.orderPrice }}{{ priceTypeText }} </view>
      </view>
    </BaseList>
  </view>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import BaseList from './base';
import Constant from '@/lib/constant';

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
});
const { info } = toRefs(props);

const activitySubTitle = computed(() => {
  return `${info.value?.activeStartTime.replace(/-/g, '.')}-${info.value?.endTime}`;
});
const subTitle = computed(() => {
  // return info.value?.activeStartTime
  //   ? '截止报名 ' + info.value?.activeStartTime
  //   : info.value?.activityDate;
  return ` ${info.value?.stadiumName}`;
});

const coverImg = computed(() => {
  return info.value?.activeHeadFigure || '';
});

const priceTypeText = computed(() => {
  const activityPriceTypeValue = Constant.ACTIVITY_PRICE_TYPE[info.value?.activityPriceType];
  return activityPriceTypeValue === '定额' ? '' : (activityPriceTypeValue || '');
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
      @include flex-center;
      max-width: 318rpx;
      min-width: 168rpx;
      .avatarBlock {
        @include flex-center;
        .avatarItem {
          position: relative;
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          border: 2rpx solid #ffffff;
          box-sizing: border-box;
          background: #f5f5f5;
        }
      }
      .signUpText {
        &.noml {
          margin-left: 0rpx;
        }
        font-size: 24rpx;
        color: #a0a0a0;
        line-height: 40rpx;
        margin-left: 4rpx;
      }
    }
    .price {
      font-size: 32rpx;
      font-weight: 700;
      color: #ff6829;
      line-height: 48rpx;
    }
  }
}
</style>
