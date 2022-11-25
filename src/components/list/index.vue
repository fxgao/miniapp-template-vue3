<template>
  <view class="listContainer">
    <view class="listBlock" :class="{column: listType === 'column'}">
      <view class="list" v-for="(item, index) in dataList" :key="index">
        <slot :data="item"></slot>
      </view>
    </view>
    <view class="bottomBlock">
      <view class="loading" v-if="loading">
        <slot name="loading"></slot>
      </view>
      <view class="noMore" v-if="noMore">
        <slot name="noMore"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { toRefs, watch, onMounted, ref, computed, nextTick } from 'vue';
import request from '@/api/request';

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    default: () => {}
  },
  reqMethod: {
    type: String,
    default: 'GET'
  },
  dataList: {
    type: Array,
    default: () => []
  },
  listType: {
    type: String,
    default: 'row'
  },
  rowNum: {
    type: Number,
    default: 2
  },
  size: {
    type: Number,
    default: 10
  },
  sizeName: {
    type: String,
    default: 'pageSize'
  },
  pageName: {
    type: String,
    default: 'pageNum'
  },
  dataName: {
    type: String,
    default: ''
  }
});

const { url, params, reqMethod, dataList, listType, size, sizeName, pageName, dataName } = toRefs(props);
const emits = defineEmits(['update:dataList', 'requestEnd']);
const pageNum = ref(0);
const loading = ref(true);
const noMore = ref(false);

const formatList = (data) => {
  const res = [];
  const listLen = data.length;
  let nowLen = 0;
  let time = 0;
  while (nowLen < listLen) {
    const info = {
      id: ++time,
      size: size.value,
      data: data.slice(nowLen, nowLen + size.value)
    };
    nowLen += size.value;
    res.push(info);
  }
  return res;
};

const list = computed(() => {
  if (!dataList.value) return [];
  return formatList(dataList.value);
});

watch(list, (newVal) => {
  const lastSize = newVal.length ? newVal[newVal.length - 1].data.length : 0;
  if (lastSize.length < size.value) {
    noMore.value = true;
  }
});

// 重新加载列表
const refresh = (paramsValue) => {
  console.log('refresh', paramsValue);
  emits('update:dataList', []);
  pageNum.value = 0;
  noMore.value = false;
  nextTick(() => {
    requestList();
  });
};

// 加载列表
const requestList = () => {
  if (noMore.value) return;
  loading.value = true;
  const requestParams = {
    url: url.value,
    method: reqMethod.value || 'GET',
    data: {
      [sizeName.value]: size.value,
      [pageName.value]: ++pageNum.value,
      ...params.value
    }
  };

  request({
    requestParams
  }).then((res) => {
    console.log('list requestlist res', res);
    if (dataName.value === '') {
      if (!res?.length) {
        noMore.value = true;
      } else {
        emits(
          'update:dataList',
          dataList.value.concat(
            res || []
          )
        );
        if (res?.length < size.value) {
          noMore.value = true;
        }
      }
    } else {
      if (!res[dataName.value]) {
        noMore.value = true;
      } else {
        emits(
          'update:dataList',
          dataList.value.concat(
            res[dataName.value] || []
          )
        );
      }
    }
    loading.value = false;
  });
};

onMounted(() => {
  console.log('list onMounted 1111');
  requestList();
});

defineExpose({
  refresh,
  requestList
});
</script>

<style lang="scss" scoped>
.listContainer {
  width: 100%;
  .listBlock {
    &.column {
      display: flex;
      flex-direction: column;
      row-gap: 0rpx;
    }
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 30rpx;
    row-gap: 32rpx;

  }
}
</style>
