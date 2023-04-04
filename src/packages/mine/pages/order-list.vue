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
      <!-- tabpanel -->
      <view class="tabPanelContainer">
        <tab-panel
          :tabList="tabListArr"
          :currentValue="current"
          @change="handleTabPanelChange"
          sticky
          :stickyTop="navHeight"
          flexbox
          justify="space-between"
          color="#ef6328"
          labelColor="#ef6328"
        ></tab-panel>
      </view>
      <!-- 列表 -->
      <view class="listContainer" :class="{ white: orderList.length === 0 }">
        <List
          v-model:dataList="orderList"
          url="/wx/order/searchAllOrder"
          :params="{
            orderStatus: current
          }"
          ref="orderListRef"
          :listType="'column'"
          v-show="orderList.length > 0"
        >
          <template v-slot="{ data }">
            <view @click="goOrderDetail(data)" v-show="data">
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
          v-if="orderList.length === 0 && !listLoading"
          title="暂无订单"
          subTitle="目前还没有订单哦"
          icon="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/empty/no-order.png"
        ></empty>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { onReachBottom, onShow } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import List from '@/components/list';
import TabPanel from '@/components/base/tab-panel';
import Empty from '@/components/base/empty';
import OrderCard from '@/components/list-card/order-card';
import { useNav } from '@/hooks';
import { useSystemInfoStore } from '@/stores/systemInfo';

const systemInfoStore = useSystemInfoStore();
const { navHeight } = storeToRefs(systemInfoStore);

const { to } = useNav();

const loaded = ref(false);
const orderList = ref([]);
const orderListRef = ref(null);
// 10 末支付 20 已支付 50 已退款 60 已取消
const tabListArr = ref([
  {
    value: '',
    label: '全部'
  },
  {
    value: '10',
    label: '待付款'
  },
  {
    value: '20',
    label: '已付款'
  },
  {
    value: '60',
    label: '已取消'
  }
]);
const current = ref('');

const listLoading = computed(() => {
  return orderListRef.value ? orderListRef.value.loading : true;
});

onShow(() => {
  if (loaded.value) {
    // 需要重置外部列表数据，否则会引起列表数据问题
    orderList.value = [];
    nextTick(() => {
      orderListRef.value.refresh();
    });
  } else {
    loaded.value = true;
  }
});

onReachBottom(() => {
  orderListRef.value.requestList();
});

const goOrderDetail = (data) => {
  console.log('goOrderDetail', data);
  const { orderSn, orderStatus } = data;
  to('/mine/order-detail', { id: orderSn });
};

const changeOrderStatus = (orderNo, status) => {
  console.log('changeOrderStatus', orderNo, status);
  const curIndex = orderList.value.findIndex((item) => item.orderSn === orderNo);
  if (curIndex > -1) orderList.value[curIndex].orderStatus = status;
};

const handleTabPanelChange = (value, index) => {
  current.value = value;
  // 需要重置外部列表数据，否则会引起列表数据问题
  orderList.value = [];
  nextTick(() => {
    orderListRef.value.refresh();
  });
};

defineExpose({
  changeOrderStatus
});
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
  .tabPanelContainer {
    padding: 0 40rpx;
    background: #fff;
  }
  .listContainer {
    padding: 0 38rpx;
    margin-top: 32rpx;
  }
  .listBottomText {
    font-size: 28rpx;
    color: #a0a0a0;
    line-height: 28rpx;
    text-align: center;
    padding: 20rpx 0 80rpx 0;
  }
}
</style>
