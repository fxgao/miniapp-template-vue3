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
      <view class="filterBlock">
        <view class="tabsListBlock">
          <view
            :class="{ tabsItem: true, active: listType === item.value }"
            @click="changeListType(item.value)"
            v-for="(item, index) in listTypeList"
            :key="index"
          >
            {{ item.label }}
          </view>
        </view>
        <view :class="{ moreChoose: true, active: isMoreFilterShow }" @click="showMoreFilter"
          >更多筛选</view
        >
      </view>
      <view class="filterMainBlock" v-if="isMoreFilterShow">
        <view class="mask" @click="showMoreFilter"></view>
        <view class="filterMainContainer">
          <scroll-view class="filterMain" scroll-y="true">
            <view class="filterBlockList" v-for="(item, index) in filterData" :key="index">
              <view class="title">
                {{ item.title }}
              </view>
              <view class="content">
                <template v-if="item.type === 'block'">
                  <view
                    :class="{ filterItemBlock: true, active: item.checked }"
                    v-for="(itemChild, indexChild) in item.list"
                    :key="indexChild"
                  >
                    {{ itemChild.label }}
                  </view>
                </template>
                <template v-if="item.type === 'checkBox'">
                  <view
                    class="filterItemCheckBox"
                    v-for="(itemChild, indexChild) in item.list"
                    :key="indexChild"
                  >
                    <view class="label">
                      {{ itemChild.label }}
                    </view>
                    <image class="checkbox" :src="itemChild.checked ? '' : ''" />
                  </view>
                </template>
              </view>
            </view>
          </scroll-view>
          <view class="bottom">
            <view class="actionBtn reset" @click="resetFilter">重置</view>
            <view class="actionBtn" @click="confirmSelect">确定</view>
          </view>
        </view>
      </view>
      <view class="list">
        <List v-model:dataList="courseList" url="/wx/course/listByLabel" ref="courseListRef">
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

import api from '@/api';

const { $onLaunched } = useAppInstance();
const { to } = useNav();

const navTitleColor = ref('color: rgba(0,0,0,1);');
const navBarBackgroundColor = ref('rgba(255,255,255,0)');

const pageScroll = (e) => {
  const scrollTop = e.scrollTop;
  if (scrollTop < 5) {
    navTitleColor.value = 'color:rgba(0,0,0,1);';
    navBarBackgroundColor.value = 'rgba(255,255,255,0)';
    return;
  }
  const transparent = scrollTop / 36 >= 1 ? 1 : scrollTop / 36;
  navTitleColor.value = `color:rgba(0,0,0,${transparent});`;
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

const listType = ref(1);

const listTypeList = ref([
  {
    label: '幼少儿',
    value: 1
  },
  {
    label: '青少年',
    value: 2
  },
  {
    label: '成人',
    value: 3
  }
]);

const changeListType = (value) => {
  listType.value = value;
};

const isMoreFilterShow = ref(false);

const showMoreFilter = () => {
  isMoreFilterShow.value = !isMoreFilterShow.value;
};

const filterData = reactive([
  {
    title: '课程类型',
    type: 'block',
    list: [
      {
        label: '不限',
        value: '',
        checked: true
      },
      {
        label: '班课',
        value: 1,
        checked: false
      },
      {
        label: '体验课',
        value: 2,
        checked: false
      }
    ]
  },
  {
    title: '班级类型',
    type: 'block',
    list: [
      {
        label: '不限',
        value: '',
        checked: true
      },
      {
        label: '一对一',
        value: 1,
        checked: false
      },
      {
        label: '一对多',
        value: 2,
        checked: false
      }
    ]
  },
  {
    title: '小区',
    type: 'checkbox',
    list: [
      {
        label: '得乐网球（新媒体网球馆）',
        value: '',
        checked: false
      }
    ]
  }
]);

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
    padding: 0 40rpx;
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
    .listBottomText {
      font-size: 28rpx;
      color: #A0A0A0;
      line-height: 28rpx;
      text-align: center;
      padding: 20rpx 0;
    }
  }
}
</style>
