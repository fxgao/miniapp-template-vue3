<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="报名课程"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer" :class="{ white: courseList.length === 0 }">
      <!-- 列表 -->
      <view class="listContainer">
        <List
          v-if="courseList.length > 0"
          v-model:loading="loading"
          v-model:dataList="courseList"
          url="/wx/publish/courseList"
          ref="courseListRef"
        >
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
        <empty
          v-if="courseList.length === 0 && !listLoading"
          title="暂无课程"
          subTitle="目前还没有报名课程哦"
          icon="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/empty/no-course.png"
          buttonText="去报名"
          url="/index:course"
        ></empty>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import List from '@/components/list';
import CourseCard from '@/components/list-card/course-card';
import Empty from '@/components/base/empty';
import { useAppInstance, useNav } from '@/hooks';
import { useSystemInfoStore } from '@/stores/systemInfo';

const systemInfoStore = useSystemInfoStore();
const { safeBottom, navHeight } = storeToRefs(systemInfoStore);
const { to } = useNav();

const courseList = ref([]);
const courseListRef = ref(null);

const listLoading = computed(() => {
  console.log(courseListRef);
  // return courseListRef.value ? courseListRef.value.loading : true;
  return false;
});

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
  &.white {
    background: #fff;
    .listContainer {
      margin-top: 0rpx;
    }
  }
  min-height: calc(100vh - v-bind('navHeight'));
  .listContainer {
    padding: 0 38rpx;
    margin-top: 32rpx;
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
