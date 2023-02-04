<template>
  <view class="page">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      :title="navTitle"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <view class="schduleContainer" v-if="stadiumId">
        <activity-schedule :stadiumId="stadiumId"></activity-schedule>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useAppInstance, useNav } from '@/hooks';
import ActivitySchedule from '../components/activity-schedule';
import { useSystemInfoStore } from '@/stores/systemInfo';

const { to } = useNav();
const { $onLaunched } = useAppInstance();
const systemInfoStore = useSystemInfoStore();
const { navHeight } = storeToRefs(systemInfoStore);

const navTitle = ref('预约活动');
const stadiumId = ref('');

onLoad(async (options) => {
  await $onLaunched;
  const { stadiumId: sId } = options;
  stadiumId.value = sId || '';
});
</script>

<style lang="scss" scoped>
.page {
}
.pageContainer {
  width: 100%;
  min-height: calc(100vh - v-bind(navHeight));
  background: #f5f5f5;
  padding-top: 12rpx;
  .schduleContainer {
    background: #fff;
    padding-top: 40rpx;
  }
}
</style>
