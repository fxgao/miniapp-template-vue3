<template>
  <view class="page">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,0)'"
      :isTransparent="true"
      :showSelectBlock="true"
    />
    <view class="pageContainer">
      <!-- banner位 -->
      <view class="bannerBlock">
        <swiper class="bannerSwiper" circular="true" @change="bannerChange">
          <swiper-item v-for="item in banner" :key="item.id">
            <image class="bannerImg" :src="item.bannerUrl" />
          </swiper-item>
        </swiper>
        <view class="indicatorBlock">
          <view
            :class="{ dot: true, active: index === curIndex }"
            v-for="(item, index) in banner"
            :key="item.id"
          ></view>
        </view>
      </view>
      <!-- 金刚位 -->
      <view class="kingkongBlock">
        <view
          class="kingkongItem"
          v-for="item in kingkongList"
          :key="item.id"
          @click="handleKingkongClick(item)"
        >
          <image class="kingkongImg" :src="item.image" />
          <view class="kingkongText">{{ item.name }}</view>
        </view>
      </view>
      <!-- 附近热门场馆 -->
      <view class="stadiumBlock">
        <view
          :class="{ stadiumItem: true, hot: item.hot }"
          v-for="item in stadiumList"
          :key="item.id"
          @click="handleStadiumClick(item)"
        >
          <view class="name">{{ item.stadiumName }}</view>
          <view class="remark">{{ item.stadiumRemark }}</view>
          <view class="labelBlock">
            <view class="labelItem">室内</view>
            <view class="labelItem">承认</view>
            <view class="labelItem">标签</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api';
import { onLoad } from '@dcloudio/uni-app';
import { useAppInstance } from '@/hooks';

const { $onLaunched } = useAppInstance();

// 定义

// 变量
const banner = ref([]);
const curIndex = ref(0);
const kingkongList = ref([]);
const stadiumList = ref([null, null]);

// 方法
const getBannerList = () => {
  api.common.getBanner().then((res) => {
    console.log('getBannerList res', res);
    banner.value = res || [];
  });
};

const getKingKongPosition = () => {
  api.common.getKingKongPosition().then((res) => {
    console.log('getKingKongPosition res', res);
    kingkongList.value = res.concat(res) || [];
  });
};

const getHotStadiumList = () => {
  api.common.getHotStadiumList().then((res) => {
    console.log('getHotStadiumList res', res);
    stadiumList.value[1] = res[0] || {};
  });
};

const getNearbyStadiumList = () => {
  const data = {
    lng: 123,
    lat: 456
  };
  api.common.getNearbyStadiumList(data).then((res) => {
    console.log('getNearbyStadiumList res', res);
    stadiumList.value[0] = res[0] || {};
  });
};

const bannerChange = (e) => {
  console.log('bannerChange', e);
  const { current } = e.detail;
  curIndex.value = current;
};

const handleKingkongClick = (item) => {
  console.log('handleKingkongClick', item);
};

const handleStadiumClick = (item) => {
  console.log('handleStadiumClick', item);
};

onLoad(async (options) => {
  await $onLaunched;
  getBannerList(); // banner列表
  getKingKongPosition(); // 金刚位列表
  getHotStadiumList(); // 热门场馆
  getNearbyStadiumList(); // 附近场馆
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  width: 100%;
  background: #f5f5f5;
}
.pageContainer {
  min-height: 720rpx;
  padding: 0 40rpx;
  background: url('https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/home/home-top-bg.png')
    no-repeat;
  background-size: contain;
  .bannerBlock {
    position: relative;
    padding-top: 208rpx;
    .bannerSwiper {
      height: 304rpx;
      border-radius: 16rpx;
      overflow: hidden;
      .bannerImg {
        width: 100%;
        height: 304rpx;
      }
    }
    .indicatorBlock {
      @include flex-center;
      position: absolute;
      right: 16rpx;
      bottom: 16rpx;
      .dot {
        &.active {
          width: 16rpx;
          background: #ff6829;
        }
        width: 8rpx;
        height: 4rpx;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 4rpx;
        margin-left: 4rpx;
        transition: all 0.2s linear;
      }
    }
  }
  .kingkongBlock {
    @include flex-between;
    position: relative;
    margin-top: 32rpx;
    padding: 0 24rpx;
    .kingkongItem {
      .kingkongImg {
        width: 88rpx;
        height: 88rpx;
      }
      .kingkongText {
        margin-top: 16rpx;
        font-size: 24rpx;
        color: #333333;
        line-height: 40rpx;
        text-align: center;
      }
    }
  }
  .stadiumBlock {
    @include flex-between;
    position: relative;
    margin-top: 32rpx;
    .stadiumItem {
      &.hot {
        background: url('https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/home/stadium-bg-hot.png')
          no-repeat;
        background-size: contain;
      }
      .name {
        font-size: 32rpx;
        font-weight: 500;
        color: #ffab00;
        line-height: 48rpx;
      }
      .remark {
        margin-top: 16rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #666666;
        line-height: 44rpx;
      }
      .labelBlock {
        @include flex-start;
        margin-top: 16rpx;
        .labelItem {
          border-radius: 4rpx;
          border: 1rpx solid #979797;
          padding: 4rpx 8rpx;
          font-size: 24rpx;
          color: #a0a0a0;
          line-height: 24rpx;
          margin-right: 8rpx;
        }
      }
      width: 320rpx;
      height: 196rpx;
      background: url('https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/home/stadium-bg.png')
        no-repeat;
      background-size: contain;
      padding: 24rpx;
    }
  }
}
</style>
