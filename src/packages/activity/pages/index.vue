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
      <!-- 列表 -->
      <view class="listContainer">
        <List
          v-if="loadEnd"
          v-model:dataList="activityList"
          url="/wx/publish/activityList"
          listType="column"
          ref="activityListRef"
          :params="filterParams"
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
import { ref, reactive, nextTick } from 'vue';
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import List from '@/components/list';
import ActivityCard from '@/components/list-card/activity-card';
import { useAppInstance, useNav } from '@/hooks';

const { to } = useNav();
const { $onLaunched } = useAppInstance();

const navTitle = ref('活动列表');
const activityList = ref([]);
const activityListRef = ref(null);
const loadEnd = ref(false);

const filterParams = reactive({});

const goActivityDetail = (item) => {
  console.log('goActivityDetail', item);
  to('/activity/detail', {
    actId: item.activityId,
    pubId: item.id
  });
};

onReachBottom(() => {
  activityListRef.value.requestList();
});

onLoad(async (options) => {
  await $onLaunched;
  const { stadiumId } = options;
  filterParams.stadiumId = stadiumId || '';
  navTitle.value = stadiumId ? '全部活动' : '活动列表';
  loadEnd.value = true;
});
</script>

<style lang="scss" scoped>
.page {
}
.pageContainer {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  .listContainer {
    padding: 0 40rpx;
  }
  .listBottomText {
    font-size: 28rpx;
    color: #A0A0A0;
    line-height: 28rpx;
    text-align: center;
    padding: 20rpx 0;
  }
}
</style>
