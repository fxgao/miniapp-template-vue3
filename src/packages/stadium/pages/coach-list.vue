<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="教练列表"
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
          v-model:dataList="coachList"
          url="/wx/user/coach/listPage"
          ref="coachListRef"
          :params="params"
        >
          <template v-slot="{ data }">
            <view @click="goCoachDetail(data)">
              <coach-card
                :id="data.id"
                :name="data.nickName"
                :img="data.photo"
                :level="data.level"
                :content="data.coachIntroduction"
                :nationality="data.nationality"
                :size="'small'"
              ></coach-card>
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
import { ref, reactive, nextTick } from 'vue';
import { onShareAppMessage, onLoad } from '@dcloudio/uni-app';
import MultiFilter from '@/components/multi-filter';
import List from '@/components/list';
import CoachCard from '@/components/list-card/coach-card';
import { useAppInstance, useNav } from '@/hooks';
import Constant from '@/lib/constant';
import api from '@/api';

const levelList = [];
for (const key in Constant.COACH_LEVEL_GRADE_2STRING_MAP) {
  levelList.push({
    label: Constant.COACH_LEVEL_GRADE_2STRING_MAP[key],
    value: key,
    checked: false
  });
}

const { to } = useNav();

const coachListRef = ref(null);
const coachList = ref([]);
const params = ref({});

const goCoachDetail = (data) => {
  console.log('goMatchDetail', data);
  const { id } = data;
  to('/coach/detail', { id });
};

const filter = ref(null);
const filterTabList = ref([
  {
    label: '校区',
    value: 1,
    linkKey: 'stadium',
    showMore: true
  },
  {
    label: '级别',
    value: 2,
    linkKey: 'level',
    showMore: true
  },
  {
    label: '性别',
    value: 3,
    linkKey: 'sex',
    showMore: true
  }
]);

const filterData = reactive({
  stadium: [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'stadiumUser',
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
  level: [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'level',
      list: levelList
    }
  ],
  sex: [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'sex',
      list: [
        {
          label: '不限',
          value: '',
          checked: true,
          reset: true
        },
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '0'
        }
      ]
    }
  ]
});

const filterChange = (data) => {
  console.log('filterChange', data);
  params.value = data;
  // 需要重置外部列表数据，否则会引起列表数据问题
  coachList.value = [];
  nextTick(() => {
    coachListRef.value.refresh();
  });
};

const stadiumList = ref([]);
const initStadiumList = async () => {
  const res = await api.stadium.getAllStadiumList();
  const stadiumLabelList = res.map(item => {
    return {
      label: item.stadiumName,
      value: item.id
    };
  });
  console.log('initStadiumList', res);
  filterData.stadium = [
    {
      title: '',
      type: 'checkBox',
      multiple: true,
      key: 'stadiumIdList',
      list: stadiumLabelList
    }
  ];
  filter.value && filter.value.handleResetAll();
};

onLoad(() => {
  initStadiumList();
});

onShareAppMessage(() => {
  return {
    title: '快来选择专属你的网球教练吧！',
    imageUrl: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/coach.png'
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
    padding: 0 38rpx 32rpx;
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
