<template>
  <view class="page">
    <nav-bar
      ref="navbar"
      title="活动"
      :isTransparent="true"
      :titleColor="navTitleColor"
      :backgroundColor="navBarBackgroundColor"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <multi-filter
        ref="filter"
        tabType="page"
        :tabList="filterTabList"
        :filterData="filterData"
        :bgColor="filterBgColor"
        @change="filterChange"
        @onShow="filterShow"
      ></multi-filter>
      <view class="listBlock">
        <List v-model:dataList="activityList" url="/wx/publish/activityList" listType="column" ref="activityListRef" :params="filterParams">
          <template v-slot="{data}">
            <view @click="goActivityDetail(data)">
              <activity-card
                :info="data"
              ></activity-card>
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
import { reactive, ref, toRefs, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { useAppInstance, useNav } from '@/hooks';
import { useLocationInfoStore } from '@/stores/location';
import List from '@/components/list';
import MultiFilter from '@/components/multi-filter';
import ActivityCard from '@/components/list-card/activity-card';

import api from '@/api';
import Constant from '@/lib/constant';

const locationInfoStore = useLocationInfoStore();
const { getAreaList } = storeToRefs(locationInfoStore);
const { $onLaunched } = useAppInstance();
const { to } = useNav();

const navTitleColor = ref('color: rgba(0,0,0,1);');
const navBarBackgroundColor = ref('rgba(255,255,255,0)');
const filterBgColor = ref('rgba(255,255,255,0)');
const filter = ref(null);
const filterParams = ref({
  activeType: 1
});

const pageScroll = (e) => {
  const scrollTop = e.scrollTop;
  if (scrollTop < 5) {
    navTitleColor.value = 'color:rgba(0,0,0,1);';
    navBarBackgroundColor.value = 'rgba(255,255,255,0)';
    return;
  }
  const transparent = scrollTop / 36 >= 1 ? 1 : scrollTop / 36;
  const transparent2 = scrollTop / 284 >= 1 ? 1 : scrollTop / 284;
  if (transparent2 >= 1) {
    filterBgColor.value = `rgba(255,255,255,${transparent2})`;
  } else {
    filterBgColor.value = 'rgba(255,255,255,0)';
  }

  if (transparent >= 1) {
    navTitleColor.value = `color:rgba(0,0,0,${transparent});`;
    navBarBackgroundColor.value = `rgba(255,255,255,${transparent})`;
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
  } else {
    navTitleColor.value = 'color:rgba(0,0,0,0);';
    navBarBackgroundColor.value = 'rgba(255,255,255,0)';
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    });
  }
};

const filterTabList = ref([
  {
    label: '约球',
    value: 1,
    linkKey: 'activity',
    selected: true,
    key: 'activeType'
  },
  {
    label: '发球机',
    value: 2,
    linkKey: 'activity',
    key: 'activeType'
  },
  {
    label: '陪练',
    value: 3,
    linkKey: 'activity',
    key: 'activeType'
  },
  {
    label: '有氧多球',
    value: 4,
    linkKey: 'activity',
    key: 'activeType'
  }
]);

const filterData = reactive({
  activity: [
    {
      title: '区域',
      type: 'checkBox',
      multiple: true,
      key: 'areaId',
      list: [
        {
          label: '全城',
          value: '',
          checked: true,
          reset: true
        }
      ]
    },
    {
      title: '等级',
      type: 'block',
      multiple: true,
      key: 'level',
      list: []
    }
  ]
});
const filterChange = (data) => {
  console.log('filterChange', data);
  filterParams.value = data;
  // 需要重置外部列表数据，否则会引起列表数据问题
  activityList.value = [];
  nextTick(() => {
    activityListRef.value.refresh();
  });
};

const filterShow = (flag) => {
  console.log('filterShow', flag);
  if (flag) uni.pageScrollTo({ scrollTop: 296, duration: 300 });
};

watch(
  getAreaList,
  (val) => {
    const resList = val.map((item) => {
      return {
        label: item.name,
        value: item.code
      };
    });
    resList.unshift({
      label: '全城',
      value: '',
      checked: true,
      reset: true
    });
    const levelList = [];
    for (const key in Constant.LEVEL_GRADE_2STRING_MAP) {
      levelList.push({
        label: Constant.LEVEL_GRADE_2STRING_MAP[key],
        value: key,
        checked: false
      });
    }
    filterData.activity = [{
      title: '等级',
      type: 'block',
      multiple: true,
      key: 'level',
      list: levelList
    }, {
      title: '区域',
      type: 'checkBox',
      multiple: true,
      key: 'areaId',
      list: resList
    }];
    filter.value && filter.value.handleResetAll();
  },
  { immediate: true }
);

const activityList = ref([]);
const activityListRef = ref(null);

const goActivityDetail = (item) => {
  console.log('goActivityDetail', item);
  to('/activity/detail', {
    actId: item.activityId,
    pubId: item.id
  });
};

onLoad(async (options) => {
  await $onLaunched;
});

const reachBottom = () => {
  activityListRef.value.requestList();
};

defineExpose({
  pageScroll,
  reachBottom
});
</script>

<style lang="scss" scoped>
.page {
  .pageContainer {
    .listBlock {
      padding: 0 40rpx;
      margin-top: -24rpx;
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
