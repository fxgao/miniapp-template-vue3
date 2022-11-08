<template>
  <view class="page">
    <nav-bar
      ref="navbar"
      title="课程"
      :isTransparent="true"
      :titleColor="navTitleColor"
      :backgroundColor="navBarBackgroundColor"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <multi-filter
        tabType="page"
        :tabList="filterTabList"
        :filterData="filterData"
        :bgColor="filterBgColor"
        @change="filterChange"
        @onShow="filterShow"
      ></multi-filter>
      <view class="list">
        <List v-model:dataList="courseList" url="/wx/publish/courseList" ref="courseListRef">
          <template v-slot="{ data }">
            <course-card
              :info="data"
              :size="'small'"
              :style="'display: inline-block;'"
              @click="goCourseDetail(data)"
            ></course-card>
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
import { reactive, ref, toRefs } from 'vue';
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { useAppInstance, useNav } from '@/hooks';
import List from '@/components/list';
import CourseCard from '@/components/list-card/course-card';
import MultiFilter from '@/components/multi-filter';

import api from '@/api';

const { $onLaunched } = useAppInstance();
const { to } = useNav();

const navTitleColor = ref('color: rgba(0,0,0,1);');
const navBarBackgroundColor = ref('rgba(255,255,255,0)');
const filterBgColor = ref('rgba(255,255,255,0)');

const pageScroll = (e) => {
  const scrollTop = e.scrollTop;
  if (scrollTop < 5) {
    navTitleColor.value = 'color:rgba(0,0,0,1);';
    navBarBackgroundColor.value = 'rgba(255,255,255,0)';
    return;
  }
  const transparent = scrollTop / 36 >= 1 ? 1 : scrollTop / 36;
  const transparent2 = scrollTop / 198 >= 1 ? 1 : scrollTop / 198;
  navTitleColor.value = `color:rgba(0,0,0,${transparent});`;
  navBarBackgroundColor.value = `rgba(255,255,255,${transparent})`;
  filterBgColor.value = `rgba(255,255,255,${transparent2})`;
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

const filterTabList = ref([
  {
    label: '幼少儿',
    value: 1,
    linkKey: 'course',
    selected: true,
    key: 'applicablePeople'
  },
  {
    label: '青少年',
    value: 2,
    linkKey: 'course',
    key: 'applicablePeople'
  },
  {
    label: '成人',
    value: 3,
    linkKey: 'course',
    key: 'applicablePeople'
  }
]);

const filterData = reactive({
  course: [
    {
      title: '课程类型',
      type: 'block',
      multiple: true,
      key: 'courseType',
      list: [
        {
          label: '不限',
          value: '',
          checked: true,
          reset: true
        },
        {
          label: '班课',
          value: 1
        },
        {
          label: '体验课',
          value: 2
        }
      ]
    },
    {
      title: '班级类型',
      type: 'block',
      multiple: true,
      key: 'classType',
      list: [
        {
          label: '不限',
          value: '',
          checked: true,
          reset: true
        },
        {
          label: '一对一',
          value: 1
        },
        {
          label: '一对多',
          value: 2
        }
      ]
    },
    {
      title: '校区',
      type: 'checkBox',
      multiple: true,
      key: 'campus',
      list: [
        {
          label: '得乐网球（新媒体网球馆）',
          value: '1'
        },
        {
          label: '得乐网球（新媒体网球馆）',
          value: '2'
        }
      ]
    }
  ]
});
const filterChange = (data) => {
  console.log('filterChange', data);
};

const filterShow = (flag) => {
  console.log('filterShow', flag);
  if (flag) uni.pageScrollTo({ scrollTop: 198, duration: 300 });
};

const courseList = ref([]);
const courseListRef = ref(null);

const goCourseDetail = (item) => {
  console.log('goCourseDetail', item);
  to();
};

onLoad(async (options) => {
  await $onLaunched;
});

const reachBottom = () => {
  courseListRef.value.requestList();
};

defineExpose({
  pageScroll,
  reachBottom
});
</script>

<style lang="scss" scoped>
.page {
  .pageContainer {
    .filterBlock {
      position: sticky;
      top: 0;
      padding: 48rpx 0 32rpx 0;
      @include flex-between;
    }
    .tabsListBlock {
      @include flex-start;
      .tabsItem {
        &:not(:last-child) {
          margin-right: 48rpx;
        }
        &.active {
          &::after {
            content: '';
            position: absolute;
            z-index: -1;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 72rpx;
            height: 16rpx;
            background: linear-gradient(
              270deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0) 20%,
              #ff6829 100%
            );
            border-radius: 10rpx;
          }
          font-size: 36rpx;
          font-weight: 500;
          color: #333333;
          line-height: 52rpx;
        }
        font-size: 28rpx;
        font-weight: 500;
        color: #a0a0a0;
        line-height: 44rpx;
        position: relative;
      }
    }
    .moreChoose {
      &.active {
        color: #ff6829;
      }
      font-size: 28rpx;
      color: #333333;
      line-height: 44rpx;
    }
    .filterMainBlock {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: 9001;
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
        background: rgba(0, 0, 0, 0.4);
      }
    }
    .list {
      padding: 0 40rpx;
    }
    .listBottomText {
      font-size: 28rpx;
      color: #a0a0a0;
      line-height: 28rpx;
      text-align: center;
      padding: 20rpx 0;
    }
  }
}
</style>
