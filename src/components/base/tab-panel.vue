<template>
  <view
    class="tabPanel"
    :class="[classList]"
    :style="{
      top: stickyTop
    }"
  >
    <view class="tabPanel__main">
      <scroll-view
        class="tabPanel__bar"
        scroll-with-animation
        scroll-x
        :style="{
          backgroundColor
        }"
      >
        <view
          class="tabPanel__bar__box"
          :style="{
            display: flexbox ? 'flex' : '',
            'justify-content': flexbox ? justify : '',
            'text-align': flexbox ? '' : justify
          }"
        >
          <view
            class="tabPanel__bar__item"
            v-for="(item, index) in tabList"
            :key="index"
            :style="{
              color: activeIndex === index ? color : unColor,
              fontWeight: currentValue === item.value || activeIndex === index ? 700 : 400,
              padding: `0 ${gutter}rpx`
            }"
            @click="handleChangeTab(item.value, index)"
          >
            {{ item.label }}
          </view>
          <view
            class="tabPanel__label"
            :style="{
              backgroundColor: labelColor,
              left: `${labelLeft}px`
            }"
          ></view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, toRefs, computed, onMounted, nextTick, getCurrentInstance } from 'vue';
const instance = getCurrentInstance();

const props = defineProps({
  currentValue: {
    type: [String, Number],
    default: ''
  },
  tabList: {
    type: Array,
    default: () => []
  },
  sticky: {
    type: Boolean,
    default: false
  },
  stickyTop: {
    type: String,
    default: ''
  },
  flexbox: {
    type: Boolean,
    default: false
  },
  // 水平布局
  justify: {
    type: String,
    default: 'start'
  },
  // 选中字体颜色
  color: {
    type: String,
    default: '#A0A0A0'
  },
  // 未选中字体颜色
  unColor: {
    type: String,
    default: '#A0A0A0'
  },
  // 标签间隔
  gutter: {
    type: Number,
    default: 24
  },
  // 浮标颜色，默认主色
  labelColor: {
    type: String,
    default: '#A0A0A0'
  },
  // 背景颜色
  backgroundColor: {
    type: String,
    default: '#fff'
  }
});

const {
  currentValue,
  tabList,
  sticky,
  stickyTop,
  flexbox,
  justify,
  color,
  unColor,
  gutter,
  labelColor,
  backgroundColor
} = toRefs(props);

const emit = defineEmits(['change', 'update:currentValue']);

const activeIndex = ref(-1);
const offsetLeft = ref(0);
const width = ref(0);
onMounted(() => {
  activeIndex.value = tabList.value.findIndex((item) => item.value === currentValue.value);
  nextTick(() => {
    // 获取选项卡宽度
    uni
      .createSelectorQuery()
      .in(instance)
      .select('.tabPanel')
      .boundingClientRect((d) => {
        offsetLeft.value = d.left;
        width.value = d.width;
        getRect();
      })
      .exec();
  });
});
const classList = computed(() => {
  const list = [];
  if (sticky.value) {
    list.push('is-sticky');
  }
  return list.join(' ');
});
const tabRect = ref([]);
const getRect = () => {
  nextTick(() => {
    uni
      .createSelectorQuery()
      // #ifndef MP-ALIPAY
      .in(instance)
      // #endif
      .selectAll('.tabPanel__bar__item')
      .boundingClientRect((d) => {
        console.log('getRect', d);
        tabRect.value = d;
        calcLabelLeft();
      })
      .exec();
  });
};

const handleChangeTab = (value, index) => {
  console.log('handleChangeTab', value, index);
  activeIndex.value = index;
  calcLabelLeft();
  emit('change', value, index);
  emit('update:currentValue', value);
};

const labelLeft = ref(0);
// 计算浮标位置
const calcLabelLeft = () => {
  if (tabRect.value.length > 0) {
    nextTick(() => {
      const item = tabRect.value[activeIndex.value];
      if (item) {
        labelLeft.value = item.left + item.width / 2 - offsetLeft.value - 12;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.tabPanel {
  width: 100%;

  &__main {
    position: relative;
    height: 72rpx;
    overflow: hidden;
  }

  &__bar {
    box-sizing: border-box;
    height: 72rpx;
    white-space: nowrap;
    text-align: center;

    .uni-scroll-view::-webkit-scrollbar {
      display: none;
    }

    &__item {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      height: 72rpx;
      font-size: 28rpx;
      line-height: 72rpx;
      transition: font-size 0.1s;
      .tabPanel__icon {
        font-size: 30rpx;

        &--prefix {
          margin-right: 10rpx;
        }

        &--suffix {
          margin-left: 10rpx;
        }
        &--reddot {
          position: absolute;
          top: 12rpx;
          right: 12rpx;
          width: 12rpx;
          height: 12rpx;
          background: #ff4e6d;
          border-radius: 50%;
        }
      }
    }

    &__box {
      position: relative;
      white-space: nowrap;
      height: 72rpx;
    }
  }

  &__label {
    position: absolute;
    bottom: 0rpx;
    width: 48rpx;
    height: 8rpx;
    background-color: #2f2e3b;
    border-radius: 4rpx;
    transition: all 0.5s;
  }

  &.is-sticky {
    position: sticky;

    /* #ifdef H5 */
    top: 44px;

    /* #endif */

    /* #ifndef H5 */
    top: 0;
    z-index: 99;

    /* #endif */
  }
}
</style>
