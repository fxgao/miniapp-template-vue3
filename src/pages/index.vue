<template>
  <view class="container">
    <view class="main">
      <Home v-if="current === 'home'" />
      <Course v-if="current === 'course'" />
      <Activity v-if="current === 'activity'" />
      <Mine v-if="current === 'mine'" />
    </view>
    <view class="footer">
      <button @click="slientLogin">登录</button>
    </view>
  </view>
</template>

<script setup>
import Activity from './components/Activity';
import Course from './components/Course';
import Home from './components/Home';
import Mine from './components/Mine';
import { onLoad } from '@dcloudio/uni-app';
import { readonly, ref } from 'vue';
import { useSystemInfoStore } from '@/stores/systemInfo';
import api from '@/api';

const systemInfo = useSystemInfoStore();

const slientLogin = () => {
  uni.login({
    provider: 'weixin',
    success: function (loginRes) {
      console.log('slientLogin', loginRes);
      const code = loginRes.code;
      api.common.login(code).then((res) => {
        console.log('login res', res);
      });
    }
  });
};

const current = ref('home');
const tabList = readonly(
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
);

onLoad((options) => {
  console.log(uni.globalSystemInfo, systemInfo.systemInfo.safeBottomHeight);
});
</script>
