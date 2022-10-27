<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="赛事"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <!-- 搜索 -->
      <view class="filterContainer">
        <view class="filterItem">全城</view>
        <view class="filterItem">赛事类型</view>
        <view class="filterItem">成人</view>
        <view class="filterItem">未开始</view>
      </view>
      <!-- 列表 -->
      <view class="listContainer">
        <List
          v-model:dataList="matchList"
          url="/wx/game/listPage"
          ref="matchListRef"
          :listType="'column'"
        >
          <template v-slot="{ data }">
            <view @click="goMatchDetail(data)">
              <match-card :info="data"></match-card>
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
import MatchCard from '@/components/list-card/match-card';
import { useAppInstance, useNav } from '@/hooks';

const { to } = useNav();

const matchList = ref([]);

const goMatchDetail = (data) => {
  console.log('goMatchDetail', data);
  const { id } = data;
  to('/match/detail', { id });
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
