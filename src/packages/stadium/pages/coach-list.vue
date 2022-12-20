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
                :content="data.remarks"
                :nationality="item.nationality"
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
import { onShareAppMessage } from '@dcloudio/uni-app';
import MultiFilter from '@/components/multi-filter';
import List from '@/components/list';
import CoachCard from '@/components/list-card/coach-card';
import { useAppInstance, useNav } from '@/hooks';

const { to } = useNav();

const coachListRef = ref(null);
const coachList = ref([]);
const params = reactive({});

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
      list: [
        {
          label: '不限',
          value: '',
          checked: true,
          reset: true
        },
        {
          label: '0.5',
          value: '0.5'
        },
        {
          label: '1',
          value: '1'
        },
        {
          label: '1.5',
          value: '1.5'
        },
        {
          label: '2',
          value: '2'
        },
        {
          label: '2.5',
          value: '2.5'
        },
        {
          label: '3',
          value: '3'
        },
        {
          label: '3.5',
          value: '3.5'
        },
        {
          label: '4',
          value: '4'
        },
        {
          label: '4.5',
          value: '4.5'
        },
        {
          label: '5',
          value: '5'
        },
        {
          label: '5.5',
          value: '5.5'
        },
        {
          label: '6',
          value: '6'
        },
        {
          label: '6.5',
          value: '6.5'
        },
        {
          label: '7',
          value: '7'
        }
      ]
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

onShareAppMessage(() => {
  return {
    title: '快来选择专属你的网球教练吧！',
    imageUrl: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/20221129/1669706159124WechatIMG12.jpeg'
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
