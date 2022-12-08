<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="我的订单"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <!-- 列表 -->
      <view class="listContainer" :class="{ white: orderList.length === 0 }">
        <List
          v-model:dataList="orderList"
          url="/wx/order/searchAllOrder"
          ref="orderListRef"
          :listType="'column'"
          v-show="orderList.length > 0"
        >
          <template v-slot="{ data }">
            <view @click="goOrderDetail(data)">
              <order-card :info="data" showBottom></order-card>
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
          v-if="(orderList.length === 0 && !listLoading)"
          title="暂无订单"
          subTitle="目前还没有订单哦"
          icon="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/empty/no-order.png"
        ></empty>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import List from '@/components/list';
import Empty from '@/components/base/empty';
import OrderCard from '@/components/list-card/order-card';
import { useAppInstance, useNav } from '@/hooks';
import { useSystemInfoStore } from '@/stores/systemInfo';

const systemInfoStore = useSystemInfoStore();
const { safeBottom, navHeight } = storeToRefs(systemInfoStore);

const { to } = useNav();

const orderList = ref([]);
const orderListRef = ref(null);

const listLoading = computed(() => {
  return orderListRef.value ? orderListRef.value.loading : true;
});

const goOrderDetail = (data) => {
  console.log('goOrderDetail', data);
  const { orderSn } = data;
  to('/mine/order-detail', { id: orderSn });
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
