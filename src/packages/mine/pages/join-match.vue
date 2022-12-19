<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="参与赛事"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer" :class="{ white: joinMatchList.length === 0 }">
      <!-- 列表 -->
      <view class="listContainer">
        <List
          v-model:dataList="joinMatchList"
          url="/wx/stadium/list"
          ref="matchListRef"
          :listType="'column'"
          v-if="joinMatchList.length > 0"
        >
          <template v-slot="{ data }">
            <view @click="goMatchDetail(data)">
              <match-card :info="data" :overTime="data.gameStatus === 3"></match-card>
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
          v-if="(joinMatchList.length === 0 && !listLoading)"
          title="暂无赛事"
          subTitle="目前还没有参与赛事哦"
          icon="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/empty/no-match.png"
          buttonText="去报名"
          url="/match/index"
        ></empty>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import List from '@/components/list';
import MatchCard from '@/components/list-card/match-card';
import Empty from '@/components/base/empty';
import { useAppInstance, useNav } from '@/hooks';
import { useSystemInfoStore } from '@/stores/systemInfo';

const systemInfoStore = useSystemInfoStore();
const { safeBottom, navHeight } = storeToRefs(systemInfoStore);

const { to } = useNav();

const joinMatchList = ref([]);
const matchListRef = ref(null);

const listLoading = computed(() => {
  // return matchListRef.value ? matchListRef.value.loading : true;
  return false;
});

const goMatchDetail = (data) => {
  console.log('goStadiumDetail', data);
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
  &.white {
    background: #fff;
  }
  min-height: calc(100vh - v-bind('navHeight'));
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
