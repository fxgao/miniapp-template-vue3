<template>
  <view class="page-container">
    <view class="main">
      <Home v-show="current === 'home'" />
      <Course v-if="current === 'course'" />
      <Activity v-if="current === 'activity'" />
      <Mine v-if="current === 'mine'" />
    </view>
    <view class="footer">
      <tab-bar @tabChange="tabChange" :tabs="tabList" :current="current"></tab-bar>
    </view>
  </view>
</template>

<script setup>
import Activity from './components/Activity';
import Course from './components/Course';
import Home from './components/Home';
import Mine from './components/Mine';
import { readonly, ref, nextTick, computed } from 'vue';
// import api from '@/api';
// import { useSystemInfoStore } from '@/stores/systemInfo';
import { useLocationInfoStore } from '@/stores/location';
import Config from '@/api/config';
const locationStore = useLocationInfoStore();
const locationCode = computed(() => locationStore.locationInfo.code);

// const systemInfo = useSystemInfoStore();

const current = ref('home');
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
</script>

<style lang="scss" scoped>
.main {
  background: #ffffff;
  @include text-ellipsis();
}
.page-container {
  width: 100%;
}
</style>
