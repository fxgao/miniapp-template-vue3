<template>
  <view class="pageHome">
    <nav-bar
      ref="navbar"
      :showSelectBlock="true"
      :isTransparent="true"
      :titleColor="navTitleColor"
      :backgroundColor="navBarBackgroundColor"
    />
    <view class="pageContainer">
      <!-- 热门活动 -->
      <view class="activityBlock" v-if="hotActivityList.length > 0">
        <view class="topBlock">
          <view class="titleBg"> 热门活动 </view>
          <view class="moreText" @click="handleGoMore('activity')">
            查看更多
            <image
              class="icon"
              src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png"
            />
          </view>
        </view>
        <view class="list">
          <view v-for="item in hotActivityList" :key="item.id" @click="goActivityDetail(item)">
            <activity-card :info="item"></activity-card>
          </view>
        </view>
      </view>
      <!-- 热门课程 -->
      <view class="courseBlock" v-if="hotCourseList.length > 0">
        <view class="topBlock">
          <view class="titleBg"> 热门课程 </view>
          <view class="moreText" @click="handleGoMore('course')">
            查看更多
            <image
              class="icon"
              src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png"
            />
          </view>
        </view>
        <scroll-view class="courseListScroll" :scroll-x="true">
          <view class="componentItem" v-for="item in hotCourseList" :key="item.id" @click="goCourseDetail(item)">
            <course-card
              :info="item"
              :style="'margin-left: 32rpx;display: inline-block;'"
            ></course-card>
          </view>
        </scroll-view>
      </view>
      <!-- 经典活动 -->
      <view class="matchBlock" v-if="classicMatchList.length > 0">
        <view class="topBlock">
          <view class="titleBg"> 经典赛事 </view>
          <view class="moreText" @click="handleGoMore('match')">
            查看更多
            <image
              class="icon"
              src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png"
            />
          </view>
        </view>
        <view class="list">
          <span v-for="item in classicMatchList" :key="item.id" @click="goMatchDetail(item)">
            <match-card :info="item"></match-card>
          </span>
        </view>
      </view>
      <!-- 明星教练 -->
      <view class="coachBlock" v-if="starCoachList.length > 0">
        <view class="topBlock">
          <view class="titleBg"> 明星教练 </view>
          <view class="moreText" @click="handleGoMore('coach')">
            查看更多
            <image
              class="icon"
              src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png"
            />
          </view>
        </view>
        <scroll-view class="coachListScroll" :scroll-x="true">
          <view class="componentItem" v-for="item in starCoachList" :key="item.id" @click="goCoachDetail(item)">
            <coach-card
              :id="item.id"
              :name="item.nickName"
              :img="item.photo"
              :level="item.level"
              :content="item.remarks"
              :style="'margin-left: 32rpx;display: inline-block;'"
            ></coach-card>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api';
import { onLoad } from '@dcloudio/uni-app';
import { useAppInstance, useNav } from '@/hooks';
import ActivityCard from '@/components/list-card/activity-card';
import CourseCard from '@/components/list-card/course-card';
import MatchCard from '@/components/list-card/match-card';
import CoachCard from '@/components/list-card/coach-card';

const { $onLaunched } = useAppInstance();
const { to } = useNav();

// 变量
const navTitleColor = ref('color: rgba(255,255,255,0)');
const navBarBackgroundColor = ref('rgba(255,255,255,0)');

// 方法
const pageScroll = (e) => {
  const scrollTop = e.scrollTop;
  const transparent = scrollTop / 36 >= 1 ? 1 : scrollTop / 36;
  navTitleColor.value = `color:rgba(0,0,0,${transparent})`;
  navBarBackgroundColor.value = `rgba(255,255,255,${transparent})`;
  if (transparent >= 1) {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
  } else {
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    });
  }
};

const hotActivityList = ref([]);

// 获取热门活动
const getHotActivity = () => {
  api.activity
    .getActivityList({
      pageNum: 1,
      pageSize: 4,
      hot: 1
    })
    .then((res) => {
      console.log('getHotActivity res', res);
      hotActivityList.value = res || [];
    });
};

const hotCourseList = ref([]);

// 获取热门课程
const getHotCourse = () => {
  api.course
    .getCourseList({
      pageNum: 1,
      pageSize: 4,
      hot: 1
    })
    .then((res) => {
      console.log('getHotCourseList res', res);
      hotCourseList.value = res || [];
    });
};

const classicMatchList = ref([]);

// 获取经典赛事
const getClassicMatch = () => {
  api.match
    .getMatchList({
      pageNum: 1,
      pageSize: 4,
      hot: 1
    })
    .then((res) => {
      console.log('getClassicMatchList res', res);
      classicMatchList.value = res || [];
    });
};

const starCoachList = ref([]);

// 获取明星教练
const getStartCoach = () => {
  api.homePage.getStarCoachList().then((res) => {
    console.log('getStartCoach res', res);
    starCoachList.value = res || [];
  });
};

// 处理所有查看更多
const handleGoMore = (type) => {
  switch (type) {
    case 'activity':
      to('/index:activity', {}, 'redirectTo');
      break;
    case 'course':
      to('/index:course', {}, 'redirectTo');
      break;
    case 'match':
      to('/match/index');
      break;
    case 'coach':
      to('/coach/list');
      break;
  }
};

// 跳转活动详情页
const goActivityDetail = (item) => {
  console.log('goActivityDetail', item);
  to('/activity/detail', {
    actId: item.activityId,
    pubId: item.id
  });
};

// 跳转课程详情页
const goCourseDetail = (item) => {
  console.log('goCourseDetail', item);
  to('/course/detail', {
    id: item.id
  });
};

// 跳转赛事详情页
const goMatchDetail = (item) => {
  console.log('goMatchDetail', item);
  to('/match/detail', {
    id: item.id
  });
};

// 跳转教练详情
const goCoachDetail = (item) => {
  console.log('goCoachDetail', item);
  to('/coach/detail', {
    id: item.id
  });
};

onLoad(async (options) => {
  await $onLaunched;
  getHotActivity(); // 热门活动
  getHotCourse(); // 热门课程
  getClassicMatch(); // 经典赛事
  getStartCoach(); // 明星教练
});

defineExpose({
  pageScroll
});
</script>

<style lang="scss" scoped>
.pageHome {
  min-height: 100vh;
  width: 100%;
  background: #f5f5f5;
  overflow: hidden;
}
.pageContainer {
  background: #f5f5f5;
  .topBlock {
    @include flex-between;
    .titleBg {
      &::before {
        content: '';
        position: absolute;
        z-index: -1;
        top: 0;
        left: -8rpx;
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
        background: linear-gradient(319deg, rgba(255, 255, 255, 0) 0%, #ff6829 100%);
      }
      &::after {
        content: '';
        position: absolute;
        z-index: -1;
        bottom: 2rpx;
        left: 20rpx;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffcb8a 0%, #ffffff 100%);
      }
      font-size: 36rpx;
      font-weight: 600;
      color: #333333;
      line-height: 52rpx;
      position: relative;
      z-index: 1;
    }
    .moreText {
      @include flex-center;
      font-size: 28rpx;
      color: #a0a0a0;
      line-height: 32rpx;
      .icon {
        height: 32rpx;
        width: 32rpx;
        margin-left: 8rpx;
      }
    }
  }

  .activityBlock,
  .matchBlock,
  .courseBlock,
  .coachBlock {
    margin-top: 48rpx;
    padding: 0 40rpx;
  }
  .coachBlock,
  .courseBlock {
    padding: 0 !important;
    padding-bottom: 32rpx;
    .topBlock {
      padding: 0 40rpx;
    }
    .coachListScroll,
    .courseListScroll {
      width: 100%;
      white-space: nowrap;
      margin-top: 32rpx;
      @include flex-start;
      align-items: flex-start;
      .componentItem {
        width: auto;
        display: inline-block;
      }
    }
  }
}
</style>
