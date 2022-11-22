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
          v-model:dataList="matchList"
          url="/wx/publish/gameList"
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
import { ref, reactive } from 'vue';
import List from '@/components/list';
import MultiFilter from '@/components/multi-filter';
import MatchCard from '@/components/list-card/match-card';
import { useAppInstance, useNav } from '@/hooks';

const { to } = useNav();

const matchList = ref([]);
const matchListRef = ref(null);

const filter = ref(null);
const filterTabList = ref([
  {
    label: '全城',
    value: 1,
    linkKey: 'area',
    showMore: true
  },
  {
    label: '比赛形式',
    value: 2,
    linkKey: 'gameType',
    showMore: true
  },
  {
    label: '全部人群',
    value: 3,
    linkKey: 'applicablePeople',
    showMore: true
  },
  {
    label: '比赛状态',
    value: 4,
    linkKey: 'gameStatus',
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
  gameType: [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'gameType',
      list: [
        {
          label: '不限',
          value: '',
          checked: true,
          reset: true
        },
        {
          label: '单打',
          value: '1'
        },
        {
          label: '双打',
          value: '2'
        },
        {
          label: '团体',
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
  ],
  gameStatus: [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'gameStatus',
      list: [
        {
          label: '未开始',
          value: '1'
        },
        {
          label: '已结束',
          value: '2'
        }
      ]
    }
  ]
});

const filterChange = (data) => {
  console.log('filterChange', data);
  matchListRef.value.refresh(data);
};

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
