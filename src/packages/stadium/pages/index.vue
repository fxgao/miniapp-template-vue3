<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="约球场馆"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <!-- 顶部滚动信息 -->
      <Marquee></Marquee>
      <!-- 搜索 -->
      <view class="filterContainer">
        <view class="filterItem">全城</view>
        <view class="filterItem">场地类型</view>
        <view class="filterItem">材质</view>
        <view class="filterItem">全部人群</view>
      </view>
      <!-- 列表 -->
      <view class="listContainer">
        <List
          v-model:dataList="stadiumList"
          url="/wx/stadium/list"
          ref="stadiumListRef"
          :listType="'column'"
        >
          <template v-slot="{ data }">
            <view @click="goStadiumDetail(data)">
              <stadium-card :info="data"></stadium-card>
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
import StadiumCard from '@/components/list-card/stadium-card';
import Marquee from '@/components/marquee';
import { useAppInstance, useNav } from '@/hooks';

const { to } = useNav();
// const marqueeList = ref([
//   {
//     avatar: '',
//     text: 'YY小果*** 正在活动中 | 已有3349人参与活动'
//   },
//   {
//     avatar: '',
//     text: 'YY小果*** 正在活动中 | 已有3349人参与活动'
//   }
// ]);

const stadiumList = ref([]);

const goStadiumDetail = (data) => {
  console.log('goStadiumDetail', data);
  const { id } = data;
  to('/stadium/detail', { id });
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
    top: 98px;
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
