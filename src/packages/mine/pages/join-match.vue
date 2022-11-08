<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="参与赛事"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <!-- 列表 -->
      <view class="listContainer">
        <List
          v-model:dataList="joinMatchList"
          url="/wx/stadium/list"
          ref="activityListRef"
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
import { ref, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import List from '@/components/list';
import MatchCard from '@/components/list-card/match-card';
import { useAppInstance, useNav } from '@/hooks';

const { to } = useNav();

const joinMatchList = ref([]);

const goMatchDetail = (data) => {
  console.log('goStadiumDetail', data);
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
