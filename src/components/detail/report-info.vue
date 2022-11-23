<template>
  <view class="reportInfoContianer">
    <view class="header">
      <view class="leftText">已报名{{ infoList.length }}/{{ total }}</view>
      <view class="moreText" :class="{ active: showAll }" @click="toggleShow" v-if="infoList.length > 4">
        {{ showAll ? '收起' : '展开' }}
        <image
          class="icon"
          src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png"
        />
      </view>
    </view>
    <view class="content">
      <view class="item" v-for="(item, index) in list" :key="index">
        <image class="avatar" :src="item.img" mode="aspectFit" />
        <view class="nickName">{{ item.name }}</view>
        <image
          class="sex"
          :src="
            item?.sex == '男'
              ? 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/sex-male.png'
              : 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/sex-female.png'
          "
          mode="aspectFit"
        />
        <view class="level">
          {{ item.level }}级
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, toRefs, computed } from 'vue';

const props = defineProps({
  infoList: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    required: true
  }
});

const { infoList } = toRefs(props);

const showAll = ref(false);
const toggleShow = () => {
  showAll.value = !showAll.value;
};

const list = computed(() => {
  if (!showAll.value) {
    return infoList.value.slice(0, 4);
  } else {
    return infoList.value;
  }
});
</script>

<style lang="scss" scoped>
.reportInfoContianer {
  background: #F5F5F5;
  border-radius: 16rpx;
  padding: 24rpx;
  .header {
    @include flex-between;
    .leftText {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
      line-height: 44rpx;
    }
    .moreText {
      &.active {
        .icon {
          transform: rotateX(-90deg);
        }
      }
      @include flex-start;
      font-size: 28rpx;
      color: #A0A0A0;
      line-height: 44rpx;
      .icon {
        width: 32rpx;
        height: 32rpx;
        transform: rotateX(90deg);
      }
    }
  }
  .content {
    .item {
      @include flex-start;
      margin-top: 32rpx;
      .avatar {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
        flex: none;
        background: #F5F5F5;
      }
      .nickName {
        font-size: 28rpx;
        color: #333333;
        line-height: 44rpx;
        margin-left: 16rpx;
      }
      .sex {
        width: 32rpx;
        height: 32rpx;
        margin-left: 8rpx;
      }
      .level {
        margin-left: 8rpx;
        background: linear-gradient(135deg, #ADE767 0%, #4CAC00 100%);
        border-radius: 4rpx;
        font-size: 24rpx;
        color: #FFFFFF;
        line-height: 24rpx;
        padding: 4rpx 8rpx;
      }
    }
  }
}
</style>
