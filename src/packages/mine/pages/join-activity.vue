<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="参与活动"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer" :class="{ white: joinActivityList.length === 0 }">
      <!-- tabpanel -->
      <tab-panel
        :tabList="tabListArr"
        :currentValue="current"
        @change="handleTabPanelChange"
        sticky
        :stickyTop="navHeight"
        flexbox
        justify="center"
        color="#ef6328"
        labelColor="#ef6328"
        gutter="92"
      ></tab-panel>
      <!-- 列表 -->
      <view class="listContainer">
        <List
          v-model:dataList="joinActivityList"
          url="/wx/order/getActivity"
          ref="activityListRef"
          :params="{
            activeTimeStatus: current
          }"
          :listType="'column'"
          v-show="joinActivityList.length > 0"
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
        <empty
          v-if="joinActivityList.length === 0 && !listLoading"
          title="暂无活动"
          subTitle="目前还没有参与活动哦"
          icon="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/empty/no-activity.png"
          buttonText="去报名"
          url="/index:activity"
        ></empty>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { onReachBottom, onShow } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import TabPanel from '@/components/base/tab-panel';
import List from '@/components/list';
import ActivityCard from '@/components/list-card/activity-card';
import Empty from '@/components/base/empty';
import { useNav } from '@/hooks';

import { useSystemInfoStore } from '@/stores/systemInfo';
const systemInfoStore = useSystemInfoStore();
const { navHeight } = storeToRefs(systemInfoStore);

const { to } = useNav();

const joinActivityList = ref([]);
const activityListRef = ref(null);
const tabListArr = ref([
  {
    value: '3',
    label: '待成局'
  },
  {
    value: '2',
    label: '未开始'
  },
  {
    value: '1',
    label: '已结束'
  }
]);
const current = ref('3');

const listLoading = computed(() => {
  return activityListRef.value ? activityListRef.value.loading : true;
});

const loaded = ref(false);
onShow(() => {
  if (loaded.value) {
    // 需要重置外部列表数据，否则会引起列表数据问题
    joinActivityList.value = [];
    nextTick(() => {
      activityListRef.value.refresh();
    });
  } else {
    loaded.value = true;
  }
});

onReachBottom(() => {
  activityListRef.value.requestList();
});

const handleTabPanelChange = (value, index) => {
  current.value = value;
  // 需要重置外部列表数据，否则会引起列表数据问题
  joinActivityList.value = [];
  nextTick(() => {
    activityListRef.value.refresh();
  });
};

const goActivityDetail = (data) => {
  console.log('goStadiumDetail', data);
  const { activityId, id } = data;
  to('/activity/detail', {
    actId: activityId,
    pubId: id,
    fromMine: true
  });
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}
.pageContainer {
  &.white {
    background: #fff;
  }
  min-height: calc(100vh - v-bind('navHeight'));
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
