<template>
  <view
    id="filterContainer"
    class="filterContainer"
    :class="{ isSticky: isSticky }"
    :style="{ top: isSticky ? (stickyTop ? stickyTop : navHeight) : 0 }"
  >
    <view class="tabsContainer" :style="{ height: tabsHeight + 'rpx', background: bgColor }" @touchmove.stop.prevent="stop">
      <view
        class="tabsListBlock"
        :class="{ tabsListList: tabType === 'list', tabsListPage: tabType === 'page' }"
        v-if="tabList.length > 0"
      >
        <view
          :class="{ tabsItem: true, active: item.selected }"
          @click="changeTab(item)"
          v-for="(item, index) in tabListData"
          :key="index"
        >
          {{ item.showLabel || item.label }}
          <template v-if="tabType === 'list'">
            <view v-if="item.selected" class="iconfont icon-arrow-down"></view>
            <view v-else class="iconfont icon-arrow-up"></view>
          </template>
        </view>
      </view>
      <view
        v-if="tabType === 'page'"
        class="moreChoose"
        :class="{ active: show }"
        @click="showMoreFilter"
        >更多筛选</view
      >
    </view>
    <view class="dropContainer" v-show="show">
      <view class="mock" @click="handClose" @touchmove.stop.prevent="stop"></view>
      <view class="content">
        <scroll-view
          :scroll-y="true"
          class="mains"
          :class="{ open: show }"
          :style="{ height: maxHei }"
        >
          <view
            :class="{ chooseItem: true, noMgt: !item.title }"
            v-for="(item, index) in nowFilterData"
            :key="index"
          >
            <view class="title" v-if="item.title">{{ item.title }}</view>
            <view
              class="chooseContent"
              :class="{ column: item.type === 'checkBox', noMgt: !item.title }"
            >
              <template v-if="item.type === 'block'">
                <view
                  :class="{ filterItemBlock: true, active: itemChild.checked }"
                  v-for="(itemChild, indexChild) in item.list"
                  :key="indexChild"
                  @click="selectData(itemChild, item, index)"
                >
                  {{ itemChild.label }}
                </view>
              </template>
              <template v-if="item.type === 'checkBox'">
                <view
                  :class="{ filterItemCheckBox: true, active: itemChild.checked }"
                  v-for="(itemChild, indexChild) in item.list"
                  :key="indexChild"
                  @click="selectData(itemChild, item, index)"
                >
                  <view class="label">
                    {{ itemChild.label }}
                  </view>
                  <image
                    class="checkbox"
                    :src="
                      itemChild.checked
                        ? 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/checkbox-checked.png'
                        : 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/checkbox-disable.png'
                    "
                  />
                </view>
              </template>
            </view>
          </view>
        </scroll-view>
        <view class="bottom" @touchmove.stop.prevent="stop">
          <view class="actionBtn reset" @click="handleReset">重置</view>
          <view class="actionBtn confirm" @click="handleConfirm">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import {
  ref,
  watch,
  toRaw,
  computed,
  reactive,
  nextTick,
  toRefs,
  onMounted,
  getCurrentInstance
} from 'vue';
import { storeToRefs } from 'pinia';
import { useSystemInfoStore } from '@/stores/systemInfo';
const systemInfoStore = useSystemInfoStore();
const { safeBottom, navHeight } = storeToRefs(systemInfoStore);

const _this = getCurrentInstance();

const props = defineProps({
  // 类型  list , page
  tabType: {
    type: String,
    default: 'list'
  },
  // tabbar展示数据
  tabList: {
    type: Array,
    default: () => []
  },
  // 数据
  filterData: {
    type: Object,
    default: () => {}
  },
  // 选择区域最大高度
  maxHeight: {
    type: Number,
    default: 500
  },
  // tabs 高度
  tabsHeight: {
    type: Number,
    default: 160
  },
  // 是否吸顶
  isSticky: {
    type: Boolean,
    default: true
  },
  // 吸顶距离顶部高度
  stickyTop: {
    type: String,
    default: ''
  },
  // tabs背景颜色
  bgColor: {
    type: String,
    default: '#fff'
  },
  // 选择区域背景颜色
  mainBgColor: {
    type: String,
    default: '#fff'
  },
  // 字体选中颜色
  activeColor: {
    type: String,
    default: '#ff6829'
  },
  // 字体默认颜色
  color: {
    type: String,
    default: '#333'
  }
});

const { tabType, tabList, filterData, isSticky, stickyTop, activeColor } = toRefs(props);

const emits = defineEmits(['change', 'onShow']);

const tabListData = ref([]); // tabList区域数据
const allFilterData = ref({}); // 选择区域数据

const show = ref(false); // 是否展示选择区域

// 当前tabList选中的数据
const nowTabListData = computed(() => {
  return tabListData.value.filter((item) => item.selected);
});

// 当前选择区域数据
const nowFilterData = computed(() => {
  const linkKey = nowTabListData.value[0]?.linkKey;
  return allFilterData.value[linkKey] || [];
});

// tabbar高度
const tabsHei = computed(() => {
  return `${props.tabsHeight}rpx`;
});

// 内容区域最大高度
const maxHei = computed(() => {
  return `${props.maxHeight}rpx`;
});

// sticky顶部高度
const stickyTopHei = computed(() => {
  if (isSticky.value) {
    return stickyTop.value ? stickyTop.value : navHeight.value;
  } else {
    return 0;
  }
});

const mainsHeight = computed(() => {
  return `${props.maxHeight - props.tabsHeight}rpx`;
});

// 监听tabList数据变化
watch(
  () => props.tabList,
  (val) => {
    console.log('watch tabList');
    const list = val.map((item) => {
      return {
        ...item,
        showLabel: item.label,
        selected: item.selected || false,
        showMore: item.showMore || false
      };
    });
    tabListData.value = list;
  },
  {
    immediate: true
  }
);

// 监听filterData数据变化
watch(
  () => props.filterData,
  (val) => {
    console.log('filterData watch', val);
    const resObj = {};
    for (const key in val) {
      resObj[key] = val[key].map((item) => {
        const list = item.list.map((itemChild) => {
          return {
            ...itemChild,
            checked: itemChild.checked || false
          };
        });
        return {
          ...item,
          list
        };
      });
    }
    allFilterData.value = resObj;
  },
  {
    immediate: true
  }
);

// 切换tab
const changeTab = (item) => {
  if (item.showMore) {
    show.value = true;
    emits('onShow', true);
  }
  if (item.selected) return;
  console.log('changeTab', item);
  tabListData.value = tabListData.value.map((itemChild) => {
    return {
      ...itemChild,
      selected: itemChild.value === item.value
    };
  });
  if (!item.showMore) {
    handleConfirm();
  }
};

// 选择数据
const selectData = (listData, data, index) => {
  const linkKey = nowTabListData.value[0]?.linkKey;
  const { value, reset = false } = listData;
  const { multiple = false } = data;
  let num = 0;
  let list = [];
  if (multiple && !reset) {
    list = allFilterData.value[linkKey][index].list.map((item) => {
      if (item.value === value) {
        if (!item.checked) {
          num++;
        }
        return {
          ...item,
          checked: !item.checked
        };
      } else {
        if (item.checked && !item.reset) {
          num++;
        }
        return item;
      }
    });
    list = list.map((item) => {
      if (item.reset) {
        return {
          ...item,
          checked: num === 0
        };
      } else {
        return item;
      }
    });
  } else {
    list = allFilterData.value[linkKey][index].list.map((item) => {
      if (item.value === value) {
        return {
          ...item,
          checked: true
        };
      } else {
        return {
          ...item,
          checked: false
        };
      }
    });
  }

  if (tabType.value === 'list') {
    if (num > 0) {
      tabListData.value = tabListData.value.map((item) => {
        if (item.linkKey === linkKey) {
          return {
            ...item,
            showLabel: `${item.label}(${num})`
          };
        } else {
          return item;
        }
      });
    } else {
      tabListData.value = tabListData.value.map((item) => {
        if (item.linkKey === linkKey) {
          return {
            ...item,
            showLabel: item.label
          };
        } else {
          return item;
        }
      });
    }
  }
  console.log('selectData', tabListData.value);
  allFilterData.value[linkKey][index].list = list;
};

// 展开更多搜索
const showMoreFilter = () => {
  console.log('showMoreFilter', !show.value);
  !show.value && emits('onShow', true);
  show.value = !show.value;
};

// 处理确定按钮
const handleConfirm = () => {
  const result = {};
  // 返回格式化之后的数据
  if (tabType.value === 'page') {
    // tab区域
    const { value: tabValue, key: tabKey } = nowTabListData.value[0];
    result[tabKey] = tabValue;
  }
  // 选择区域
  for (const key in allFilterData.value) {
    const element = allFilterData.value[key];
    element.forEach((item) => {
      const { key } = item;
      const list = item.list.filter((itemChild) => itemChild.checked);
      if (list.length > 0) {
        result[key] = list.map((itemChild) => itemChild.value).join(',');
      }
    });
  }
  emits('change', result);
  show.value = false;
};

// 处理重置按钮
const handleReset = () => {
  const selectIndex = tabListData.value.findIndex((item) => item.selected);
  const linkKey = tabListData.value[selectIndex].linkKey;
  const tabListReset = tabListData.value.map((item) => {
    console.log('tabListReset map', item);
    if (item.linkKey === linkKey) {
      return {
        ...item,
        showLabel: item.label,
        selected: item.selected
      };
    } else {
      return item;
    }
  });

  const filterDataReset = {};
  for (const key in filterData.value) {
    if (key === linkKey) {
      filterDataReset[key] = filterData.value[key].map((item) => {
        const list = item.list.map((itemChild) => {
          return {
            ...itemChild,
            checked: itemChild.reset || false
          };
        });
        return {
          ...item,
          list
        };
      });
    } else {
      console.log('>>>>>', filterData.value[key]);
      filterDataReset[key] = allFilterData.value[key];
    }
  }
  tabListData.value = tabListReset;
  allFilterData.value = filterDataReset;
};

// 处理全部重置
const handleResetAll = () => {
  const tabListReset = tabListData.value.map((item) => {
    console.log('tabListReset map', item);
    return {
      ...item,
      showLabel: item.label,
      selected: item.selected
    };
  });

  const filterDataReset = {};
  for (const key in filterData.value) {
    filterDataReset[key] = filterData.value[key].map((item) => {
      const list = item.list.map((itemChild) => {
        return {
          ...itemChild,
          checked: itemChild.checked || false
        };
      });
      return {
        ...item,
        list
      };
    });
  }
  tabListData.value = tabListReset;
  allFilterData.value = filterDataReset;
};

const handClose = () => {
  show.value = false;
};

const stop = () => {};

defineExpose({
  handClose,
  handleReset,
  handleResetAll
});
</script>
<style lang="scss">
$selectColor: v-bind('activeColor');

.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.overHidden {
  overflow: hidden;
}

.filterContainer {
  &.isSticky {
    position: sticky;
    top: v-bind('stickyTop');
  }
  width: 100vw;
  position: relative;
  z-index: 1001;
  .tabsContainer {
    padding: 0 40rpx;
    @include flex-between;
    .tabsListBlock {
      &.tabsListList {
        @include flex-between;
        width: 100%;
        .tabsItem {
          &.active {
            font-size: 28rpx;
            font-weight: 500;
            color: v-bind('activeColor');
            line-height: 44rpx;
          }
          font-size: 28rpx;
          color: #333333;
          line-height: 44rpx;
          position: relative;
        }
      }
      &.tabsListPage {
        @include flex-start;
        .tabsItem {
          &:not(:last-child) {
            margin-right: 48rpx;
          }
          &.active {
            &::after {
              content: '';
              position: absolute;
              z-index: 1;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 72rpx;
              height: 16rpx;
              background: linear-gradient(
                270deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0) 20%,
                #ff6829 100%
              );
              border-radius: 10rpx;
            }
            font-size: 36rpx;
            font-weight: 500;
            color: #333333;
            line-height: 52rpx;
          }
          font-size: 28rpx;
          font-weight: 500;
          color: #a0a0a0;
          line-height: 44rpx;
          position: relative;
        }
      }
    }
    .moreChoose {
      &.active {
        color: $selectColor;
      }
      font-size: 28rpx;
      color: #333333;
      line-height: 44rpx;
    }
  }
  .dropContainer {
    .mock {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 750rpx;
      height: calc(100vh - v-bind('tabsHei') - v-bind('stickyTopHei'));
      background-color: rgba(0, 0, 0, 0.5);
      transition: background-color 0.15s linear;
    }
    .content {
      position: relative;
      background: #fff;
      .mains {
        padding: 0rpx 40rpx 32rpx;
        transition: height 0.2s;
        overflow: hidden;
        transition: all 0.3s;
        height: v-bind('mainsHeight');
        .chooseItem {
          &.noMgt {
            margin-top: 0rpx;
          }
          margin-top: 48rpx;
          .title {
            font-size: 32rpx;
            font-weight: 700;
            color: #333333;
            line-height: 48rpx;
          }
          .chooseContent {
            &.column {
              display: flex;
              flex-direction: column;
            }
            @include flex-start;
            margin-top: 24rpx;
            .filterItemBlock {
              &.active {
                color: $selectColor;
              }
              background: #f5f5f5;
              border-radius: 8rpx;
              padding: 10rpx 50rpx;
              font-size: 28rpx;
              color: #333333;
              line-height: 44rpx;
              margin-right: 20rpx;
            }
            .filterItemCheckBox {
              @include flex-between;
              width: 100%;
              &:not(:first-child) {
                margin-top: 48rpx;
              }
              &.active {
                .label {
                  color: $selectColor;
                  font-weight: 700;
                }
              }
              .label {
                font-size: 28rpx;
                color: #333333;
                line-height: 44rpx;
              }
              .checkbox {
                width: 28rpx;
                height: 28rpx;
                border-radius: 8rpx;
              }
            }
          }
        }
      }
      .bottom {
        @include flex-between;
        width: 100%;
        height: 120rpx;
        padding: 14rpx 38rpx;
        background: #fff;
        position: relative;
        z-index: 5;
        border-top: 1rpx solid #eee;
        .actionBtn {
          width: 324rpx;
          height: 92rpx;
          border-radius: 44rpx;
          font-size: 32rpx;
          color: #ff6829;
          line-height: 90rpx;
          font-weight: 700;
          text-align: center;
          &.reset {
            border: 2px solid #ff6829;
          }
          &.confirm {
            background: linear-gradient(135deg, #ffab43 0%, #ff6829 100%);
            color: #fff;
          }
        }
      }
    }
    position: absolute;
    z-index: 10;
    top: v-bind('tabsHei');
    left: 0;
    right: 0;
  }
}
</style>
