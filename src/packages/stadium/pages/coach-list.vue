<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      showBackIcon="'black'"
      title="教练"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <!-- 搜索 -->
      <view class="filterContainer">
        <view class="filterItem">校区</view>
        <view class="filterItem">级别</view>
        <view class="filterItem">性别</view>
      </view>
      <!-- 列表 -->
      <view class="listContainer">
        <List
          v-model:dataList="coachList"
          url="/wx/user/coach/listPage"
          ref="coachListRef"
        >
          <template v-slot="{ data }">
            <view @click="goCoachDetail(data)">
              <coach-card
                :id="data.id"
                :name="data.nickName"
                :img="data.photo"
                :level="data.level"
                :content="data.remarks"
                :size="'small'"
              ></coach-card>
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
import { ref } from 'vue';
import List from '@/components/list';
import CoachCard from '@/components/list-card/coach-card';
import { useAppInstance, useNav } from '@/hooks';

const { to } = useNav();

const coachList = ref([]);

const goCoachDetail = (data) => {
  console.log('goMatchDetail', data);
  const { id } = data;
  to('/coach/detail', { id });
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}
.pageContainer {
  .filterContainer {
    @include flex-between;
    background: #fff;
    padding: 16rpx 40rpx 32rpx;
    position: sticky;
    top: 91px;
    .filterItem {
      @include flex-start;
      font-size: 28rpx;
      color: #333333;
      line-height: 44rpx;
    }
  }
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
