<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="报名课程"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <!-- 列表 -->
      <view class="listContainer">
        <List v-model:dataList="courseList" url="/wx/publish/courseList" ref="courseListRef">
          <template v-slot="{ data }">
            <view @click="goCourseDetail(data)">
              <course-card
                :info="data"
                :size="'small'"
                :style="'display: inline-block;'"
              ></course-card>
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

const { to } = useNav();

const courseList = ref([]);

const goCourseDetail = (data) => {
  console.log('goCourseDetail', data);
  const { id } = data;
  to('/course/detail', { id });
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
