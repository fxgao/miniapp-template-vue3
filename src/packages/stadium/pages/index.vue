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
      <multi-filter
        ref="filter"
        :tabList="filterTabList"
        :filterData="filterData"
        @change="filterChange"
        :tabsHeight="96"
      ></multi-filter>
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
import { ref, reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import List from '@/components/list';
import StadiumCard from '@/components/list-card/stadium-card';
import Marquee from '@/components/marquee';
import MultiFilter from '@/components/multi-filter';
import { useAppInstance, useNav } from '@/hooks';

import { useLocationInfoStore } from '@/stores/location';
const locationInfoStore = useLocationInfoStore();
const { getAreaList } = storeToRefs(locationInfoStore);

const { to } = useNav();
const filter = ref(null);
const filterTabList = ref([
  {
    label: '全城',
    value: 1,
    linkKey: 'area',
    showMore: true
  },
  {
    label: '场地类型',
    value: 2,
    linkKey: 'stadiumType',
    showMore: true
  },
  {
    label: '场地材质',
    value: 3,
    linkKey: 'placeType',
    showMore: true
  },
  {
    label: '全部人群',
    value: 4,
    linkKey: 'applicablePeople',
    showMore: true
  }
]);

const filterData = reactive({
  area: [
    {
      title: '',
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
    }
  ],
  stadiumType: [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'stadiumType',
      list: [
        {
          label: '不限',
          value: '',
          checked: true,
          reset: true
        },
        {
          label: '室内',
          value: '1'
        },
        {
          label: '室外',
          value: '2'
        }
      ]
    }
  ],
  placeType: [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'placeType',
      list: [
        {
          label: '不限',
          value: '',
          checked: true,
          reset: true
        },
        {
          label: '红地',
          value: '1'
        },
        {
          label: '草地',
          value: '2'
        },
        {
          label: '混凝土',
          value: '3'
        }
      ]
    }
  ],
  applicablePeople: [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'applicablePeople',
      list: [
        {
          label: '不限',
          value: '',
          checked: true,
          reset: true
        },
        {
          label: '幼少儿',
          value: '1'
        },
        {
          label: '青少年',
          value: '2'
        },
        {
          label: '成人',
          value: '3'
        }
      ]
    }
  ]
});

const filterChange = (data) => {
  console.log('filterChange', data);
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
    filterData.area = [{
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'areaId',
      list: resList
    }];
    filter.value && filter.value.handleReset();
  },
  { immediate: true }
);

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
