<template>
  <view
    class="dropdown-container"
    :class="{ isSticky: isSticky, isFixed: isFixed, overHidden: !show }"
    :style="{ top: isSticky || isFixed ? stickyTop : 0 }"
  >
    <view class="dropdow">
      <view v-if="maskVisibility">
        <view
          class="mock"
          :class="{ show: show, hide: maskVisibility != true }"
          @click="handClose"
        ></view>
      </view>
      <view
        class="content"
        :style="{ height: maskVisibility ? maxHei : '78rpx' }"
      >
        <view class="tabs flex align-center">
          <view
            class="tab flex align-center justify-center"
            v-for="(item, index) in tableData"
            :key="index"
            @click.stop="handEnum(index)"
          >
            <text :class="{ active: show && curren === index }">{{ getTitleName(item) }}</text>
            <text
              :class="{ 'active-icon': show && curren === index }"
              class="cuIcon-usefullfill"
            ></text>
          </view>
          <slot name="right"></slot>
        </view>
        <view class="mains" :class="{ open: show }" :style="{ height: mainsHeight }">
          <scroll-view :scroll-y="true" style="height: 100%">
            <view class="radios">
              <view
                class="radio"
                v-for="(item, index) in child.submenu"
                :key="index"
                @click="handSelect(item, index)"
              >
                <text :class="{ 'radio-active': child.select === index }">{{ item.label }}</text>
                <image v-if="child.select === index" class="checked" src="" />
                <image v-else class="nocheck" src="" />
              </view>
            </view>
          </scroll-view>
          <view class="bottom">
            <view class="actionBtn reset" @click="resetFilter">重置</view>
            <view class="actionBtn" @click="confirmSelect">确定</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, watch, toRaw, computed, nextTick } from 'vue';
const props = defineProps({
  // 数据
  filterData: {
    type: Array,
    default: () => []
  },
  // 选择区域最大高度
  maxHeight: {
    type: Number,
    default: 500
  },
  // tabs 高度
  tabsHeight: {
    type: Number,
    default: 80
  },
  // 是否吸顶
  isSticky: {
    type: Boolean,
    default: false
  },
  // 是否固定
  isFixed: {
    type: Boolean,
    default: false
  },
  // 吸顶距离顶部高度
  stickyTop: {
    type: String,
    default: '0rpx'
  },
  // tabs背景颜色
  bgColor: {
    type: String,
    default: '#fff'
  },
  // tabs类型 normal 正常 list 特殊样式
  tabType: {
    type: String,
    default: 'normal'
  },
  // 选择区域背景颜色
  mainBgColor: {
    type: String,
    default: '#fff'
  },
  // 字体选中颜色
  activeColor: {
    type: String,
    default: '#4EC65E'
  },
  // 字体默认颜色
  color: {
    type: String,
    default: '#333'
  }
});

const emits = defineEmits(['change']);

const tableData = ref([]);
const tableDataBak = ref([]);

watch(
  () => props.filterData,
  (val) => {
    tableData.value = val;
    tableDataBak.value = val;
  },
  {
    immediate: true
  }
);

const getTitleName = computed(() => {
  return function (item) {
    const info = item.submenu[item.select];
    if (info) {
      return info.label;
    }
    return item.label;
  };
});

const tabsHei = computed(() => {
  return `${props.tabsHeight}rpx`;
});

const maxHei = computed(() => {
  return `${props.maxHeight}rpx`;
});

const mainsHeight = computed(() => {
  return `${props.maxHeight - props.tabsHeight}rpx`;
});

const show = ref(false);
const maskVisibility = ref(false);
const curren = ref(0);
const child = ref({});

const handClose = () => {
  show.value = false;
  maskVisibility.value = false;
};
let loading = false;
const handEnum = (index) => {
  if (loading) return;
  loading = true;
  setTimeout(() => {
    loading = false;
  }, 500);
  if (show.value && curren.value === index) {
    show.value = false;
    setTimeout(() => {
      maskVisibility.value = false;
    }, 200);
    return;
  }
  curren.value = index;
  child.value = tableData.value[index];
  maskVisibility.value = true;
  nextTick(() => {
    show.value = true;
  });
};

const handSelect = (item, index) => {
  const arr = tableData.value;
  arr[curren.value].select = index;
};

const confirmSelect = () => {
  const arr = tableData.value;
  show.value = false;
  setTimeout(() => {
    maskVisibility.value = false;
  }, 200);
  const select = toRaw(arr).map((el) => {
    return {
      labelKey: el.key,
      ...el.submenu[el.select]
    };
  });
  emits('change', select);
};

const resetFilter = () => {
  tableData.value = toRaw(tableDataBak.value);
};
</script>
<style lang="scss">
.cuIcon-usefullfill:before {
  content: '\e7cf';
}

.cuIcon-check:before {
  content: '\e645';
}

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

.mock {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 750rpx;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.15s linear;

  &.show {
    background-color: rgba(0, 0, 0, 0.5);
  }

  &.hide {
    display: none;
  }
}

.dropdown-container {
  min-height: 78rpx;
}

.dropdow {
  position: relative;
  height: v-bind('tabsHei');
  z-index: 2;

  .content {
    position: relative;
    z-index: 5;
    overflow: hidden;
    height: v-bind('maxHei');
  }

  .tabs {
    background-color: v-bind('bgColor');
    position: relative;
    z-index: 4;
    height: v-bind('tabsHei');

    .tab {
      flex: 1;
      padding: 25rpx 0;
      font-size: 28rpx;
      color: v-bind('color');
      display: flex;
      align-items: center;
      justify-content: center;

      .active {
        color: $selectColor;
      }

      .cuIcon-usefullfill {
        font-size: 22rpx;
        margin-left: 10rpx;
        transform: rotate(180deg);
        transition: all 0.3s;
      }

      .active-icon {
        transform: rotate(0deg);
        color: $selectColor;
      }
    }
  }

  .mains {
    transition: height 0.2s;
    position: absolute;
    z-index: 3;
    left: 0;
    width: 750rpx;
    overflow: hidden;
    transform: translateY(-100%);
    transition: all 0.3s;
    height: v-bind('mainsHeight');

    .radios {
      background-color: v-bind('mainBgColor');
    }

    .radio {
      width: 750rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
      box-sizing: border-box;
      font-size: 28rpx;

      &-active {
        color: $selectColor;
      }

      .cuIcon-check {
        color: $selectColor;
        font-weight: bold;
        font-size: 30rpx;
      }
    }
  }

  .open {
    transform: translateY(0);
  }
}

.overHidden {
  overflow: hidden;
}

.isSticky {
  position: sticky;
  // top: v-bind("stickyTop");
}

.isFixed {
  position: fixed;
  width: 100%;
  top: v-bind('stickyTop');
}
</style>
