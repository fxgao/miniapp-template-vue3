<template>
  <view class="page-container">
    <view class="main">
      <Home v-if="current === 'home'" />
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
import { onLoad } from '@dcloudio/uni-app';
import { readonly, ref, nextTick } from 'vue';
import { useSystemInfoStore } from '@/stores/systemInfo';

const systemInfo = useSystemInfoStore();

const current = ref('home');
const tabList = readonly([
  {
    key: 'home',
    url: '/pages/index?key=home',
    iconPath: 'https://res.paquapp.com/boxonline/newui3/tab/tabbar-box.png',
    selectedIconPath: 'https://res.paquapp.com/boxonline/newui3/tab/tabbar-box-selected.png',
    title: '首页'
  },
  {
    key: 'course',
    url: '/pages/index?key=course',
    iconPath: 'https://res.paquapp.com/boxonline/newui3/tab/tabbar-store.png',
    selectedIconPath: 'https://res.paquapp.com/boxonline/newui3/tab/tabbar-store-selected.png',
    title: '课程'
  },
  {
    key: 'activity',
    url: '/pages/index?key=activity',
    iconPath: 'https://res.paquapp.com/boxonline/newui3/tab/tabbar-activity.png',
    selectedIconPath: 'https://res.paquapp.com/boxonline/newui3/tab/tabbar-activity-selected.png',
    title: '活动'
  },
  {
    key: 'mine',
    url: '/pages/index?key=mine',
    iconPath: 'https://res.paquapp.com/boxonline/newui3/tab/tabbar-mine.png',
    selectedIconPath: 'https://res.paquapp.com/boxonline/newui3/tab/tabbar-mine-selected.png',
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

onLoad((options) => {
  console.log(uni.globalSystemInfo, systemInfo.systemInfo.safeBottomHeight);
});
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
