<template>
  <view class="pageContainer">
    <view class="topConatiner">
      <!-- banner位 -->
      <view class="bannerBlock" v-if="current !== 'mine'">
        <swiper class="bannerSwiper" circular="true" @change="bannerChange">
          <swiper-item v-for="item in banner" :key="item.id">
            <image class="bannerImg" :src="item.bannerUrl" @tap="handleBannerJump(item)"/>
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
      <view class="kingkongBlock" v-if="current === 'home'">
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
      <!-- 附近、热门场馆 -->
      <view
        class="stadiumBlock"
        v-if="stadiumList.length > 0 && (current === 'home' || current === 'activity')"
      >
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
    <view
      class="main"
      :style="{
        paddingBottom: 46 + (systemInfo.safeBottom === 0 ? 8 : systemInfo.safeBottom) + 'px',
        marginTop: current === 'course' ? '-208rpx' : current === 'mine' ? '-528rpx' : ''
      }"
    >
      <Home v-show="current === 'home'" ref="homeRef" />
      <Course v-if="current === 'course'" ref="courseRef" />
      <Activity v-if="current === 'activity'" ref="activityRef" />
      <Mine v-if="current === 'mine'" ref="mineRef" />
    </view>
    <view class="footer">
      <tab-bar @tabChange="tabChange" :tabs="tabList" :current="current"></tab-bar>
    </view>
  </view>
</template>

<script setup>
import { readonly, ref, nextTick, computed } from 'vue';
import { storeToRefs } from 'pinia';
import Activity from './components/Activity';
import Course from './components/Course';
import Home from './components/Home';
import Mine from './components/Mine';
import api from '@/api';
import { onLoad, onPageScroll, onReachBottom } from '@dcloudio/uni-app';
import { useSystemInfoStore } from '@/stores/systemInfo';
import { useLocationInfoStore } from '@/stores/location';
import { useAppInstance, useNav } from '@/hooks';
import Config from '@/api/config';
const locationStore = useLocationInfoStore();
const { getCode, locationInfo } = storeToRefs(locationStore);
const { $onLaunched, $userLocation } = useAppInstance();
const { to } = useNav();

const systemInfo = useSystemInfoStore();

const current = ref('home');
const homeRef = ref(null);
const courseRef = ref(null);
const activityRef = ref(null);
const mineRef = ref(null);

const tabList = readonly([
  {
    key: 'home',
    url: '/pages/index?key=home',
    iconPath: Config.OSS_URL_PREFIX + 'mp/tabbar/tabbar-home.png',
    selectedIconPath: Config.OSS_URL_PREFIX + 'mp/tabbar/tabbar-home-selected.png',
    title: '首页'
  },
  {
    key: 'course',
    url: '/pages/index?key=course',
    iconPath: Config.OSS_URL_PREFIX + 'mp/tabbar/tabbar-course.png',
    selectedIconPath: Config.OSS_URL_PREFIX + 'mp/tabbar/tabbar-course-selected.png',
    title: '课程'
  },
  {
    key: 'activity',
    url: '/pages/index?key=activity',
    iconPath: Config.OSS_URL_PREFIX + 'mp/tabbar/tabbar-activity.png',
    selectedIconPath: Config.OSS_URL_PREFIX + 'mp/tabbar/tabbar-activity-selected.png',
    title: '活动'
  },
  {
    key: 'mine',
    url: '/pages/index?key=mine',
    iconPath: Config.OSS_URL_PREFIX + 'mp/tabbar/tabbar-mine.png',
    selectedIconPath: Config.OSS_URL_PREFIX + 'mp/tabbar/tabbar-mine-selected.png',
    reddot: true,
    title: '我的'
  }
]);

const tabChange = (key) => {
  if (key === current.value) return;

  uni.pageScrollTo({
    scrollTop: 0,
    duration: 0
  });
  current.value = key;

  nextTick(() => {
    console.log('do smt');
  });
};

const banner = ref([]);
const curIndex = ref(0);
const kingkongList = ref([]);
const stadiumList = ref([]);

const bannerChange = (e) => {
  console.log('bannerChange', e);
  const { current } = e.detail;
  curIndex.value = current;
};

const getBannerList = () => {
  api.homePage.getBanner().then((res) => {
    console.log('getBannerList res', res);
    banner.value = res || [];
  });
};

const getKingKongPosition = () => {
  api.homePage.getKingKongPosition().then((res) => {
    console.log('getKingKongPosition res', res);
    kingkongList.value = res || [];
  });
};

const getHotStadiumList = () => {
  api.homePage.getHotStadiumList().then((res) => {
    console.log('getHotStadiumList res', res);
    if (!res.length) return;
    stadiumList.value[1] = res[0] || {};
  });
};

const getNearbyStadiumList = async () => {
  await $userLocation;
  const data = {
    lng: locationInfo.value.lng || 0,
    lat: locationInfo.value.lat || 0
  };
  api.homePage.getNearbyStadiumList(data).then((res) => {
    console.log('getNearbyStadiumList res', res);
    if (!res.length) return;
    stadiumList.value[0] = res[0] || {};
  });
};

const handleBannerJump = (item) => {
  console.log('handleBannerJump', item);
  const { stationJumpType, jumpType, data } = item;
  if (stationJumpType === 1) {
    let url = '';
    switch (jumpType) {
      case 4: // 活动
        url = `/activity/detail?id=${data}`;
        break;
      case 6: // 课程
        url = `/course/detail?id=${data}`;
        break;
      case 8: // 比赛
        url = `/match/detail?id=${data}`;
        break;
    }
    url && to(url);
  } else if (stationJumpType === 2) {
    to(data);
  } else {
    to(data);
  }
};

const handleKingkongClick = (item) => {
  console.log('handleKingkongClick', item);
  const { path } = item;
  if (path.indexOf('/index:') !== -1) {
    current.value = path.split(':')[1];
  } else {
    to(path);
  };
};

const handleStadiumClick = (item) => {
  console.log('handleStadiumClick', item);
};

onPageScroll((e) => {
  if (current.value === 'home') {
    homeRef.value.pageScroll(e);
  }
  if (current.value === 'course') {
    courseRef.value.pageScroll(e);
  }
  if (current.value === 'activity') {
    activityRef.value.pageScroll(e);
  }
});

onReachBottom(() => {
  if (current.value === 'course') {
    courseRef.value.reachBottom();
  }
  if (current.value === 'activity') {
    activityRef.value.reachBottom();
  }
});

onLoad(async (options) => {
  await $onLaunched;
  getBannerList(); // banner列表
  getKingKongPosition(); // 金刚位列表
  getHotStadiumList(); // 热门场馆
  getNearbyStadiumList(); // 附近场馆

  if (options.key && options.key !== current.value) {
    current.value = options.key;
  }
});
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
}
.pageContainer {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  .topConatiner {
    min-height: 720rpx;
    padding-top: 208rpx;
    background: url('https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/home/home-top-bg.png')
      no-repeat;
    background-size: contain;
    .bannerBlock {
      position: relative;
      padding-top: 208rpx;
      padding: 0 40rpx;
      .bannerSwiper {
        height: 304rpx;
        border-radius: 16rpx;
        overflow: hidden;
        .bannerImg {
          width: 100%;
          height: 304rpx;
          background: #ccc;
        }
      }
      .indicatorBlock {
        @include flex-center;
        position: absolute;
        right: 56rpx;
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
      padding: 0 64rpx;
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
      padding: 0 40rpx;
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
}
</style>
