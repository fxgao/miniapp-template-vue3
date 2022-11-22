<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="参与活动"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <!-- 列表 -->
      <view class="listContainer">
        <List
          v-model:dataList="joinActivityList"
          url="/wx/publish/activityList"
          ref="activityListRef"
          :listType="'column'"
        >
          <template v-slot="{ data }">
            <view @click="goActivityDetail(data)">
              <activity-card :info="data"></activity-card>
            </view>
          </template>
          <template v-slot:loading>
            <view class="listBottomText"> 加载中... </view>
          </template>
          <template v-slot:noMore>
            <view class="listBottomText"> 没有更多了! </view>
          </template>
        </List>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import List from '@/components/list';
import ActivityCard from '@/components/list-card/activity-card';
import { useAppInstance, useNav } from '@/hooks';

import { useLocationInfoStore } from '@/stores/location';
const locationInfoStore = useLocationInfoStore();
const { getAreaList } = storeToRefs(locationInfoStore);

const { to } = useNav();

const joinActivityList = ref([]);

const goActivityDetail = (data) => {
  console.log('goStadiumDetail', data);
  const { id } = data;
  to('/activity/detail', { id });
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}
.pageContainer {
  .listContainer {
    padding: 0 38rpx;
  }
  .listBottomText {
    font-size: 28rpx;
    color: #a0a0a0;
    line-height: 28rpx;
    text-align: center;
    padding: 20rpx 0;
  }
}
</style>
