<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="赛事列表"
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
          url="/wx/game/listPage"
          ref="matchListRef"
          :listType="'column'"
          :params="filterParams"
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
import { ref, reactive, nextTick, watch } from 'vue';
import { onShareAppMessage, onReachBottom } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import List from '@/components/list';
import MultiFilter from '@/components/multi-filter';
import MatchCard from '@/components/list-card/match-card';
import { useLocationInfoStore } from '@/stores/location';
import { useAppInstance, useNav } from '@/hooks';
import Constant from '@/lib/constant';

const locationInfoStore = useLocationInfoStore();
const { getAreaList } = storeToRefs(locationInfoStore);

const { to } = useNav();
const levelList = [];
for (const key in Constant.LEVEL_GRADE_2STRING_MAP) {
  levelList.push({
    label: Constant.LEVEL_GRADE_2STRING_MAP[key],
    value: key,
    checked: false
  });
}

const matchList = ref([]);
const matchListRef = ref(null);

const filter = ref(null);
const filterParams = ref({
});
const filterTabList = ref([
  {
    label: '区域',
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
  },
  {
    label: '等级',
    value: 5,
    linkKey: 'level',
    showMore: true
  }
]);

const filterData = reactive({
  area: [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'areaIdList',
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
      key: 'gameTypeList',
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
      key: 'applicablePeopleList',
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
      key: 'gameStatusList',
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
  ],
  level: [
    {
      title: '',
      type: 'block',
      multiple: true,
      key: 'level',
      list: levelList
    }
  ]
});

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
      key: 'areaIdList',
      list: resList
    }];
    filter.value && filter.value.handleResetAll();
  },
  { immediate: true }
);

const filterChange = (data) => {
  console.log('filterChange', data);
  filterParams.value = data;
  // 需要重置外部列表数据，否则会引起列表数据问题
  matchList.value = [];
  nextTick(() => {
    matchListRef.value.refresh();
  });
};

const goMatchDetail = (data) => {
  console.log('goMatchDetail', data);
  const { activityId, id } = data;
  to('/match/detail', {
    id,
    pubId: activityId
  });
};

onReachBottom(() => {
  matchListRef.value.requestList();
});

onShareAppMessage(() => {
  return {
    title: '经典赛事不容错过，快来围观参与吧！',
    imageUrl: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/match.png'
  };
});
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
