<template>
  <view class="popup-container" :style="{ height: showPopupTop ? topSlotHeight : '100vh' }">
    <view
      class="popup-top-block"
      :style="{ paddingBottom: (systemInfo.safeBottom === 0 ? 10 : systemInfo.safeBottom) + 'px' }"
      v-if="showPopupTop && ($slots['outer-tip'] || $slots['outer-main'])"
      @tap="show"
    >
      <view class="popup-top-tips">
        <slot name="outer-tip"></slot>
      </view>
      <slot name="outer-main" class="top"></slot>
    </view>
    <view
      :class="{
        'popup-main-block': true,
        'show-animate': showPopupMain,
        'hide-animate': hideAnimating
      }"
      @touchmove.stop.prevent="moveHandle"
      v-show="showPopupMain"
    >
      <view class="main-top">
        <slot name="inner-main-tip"></slot>
      </view>
      <scroll-view
        :scroll-y="true"
        :style="{
          'max-height':
            $slots['inner-main-tip'] && $slots['inner-main-bottom']
              ? `calc(89vh - ${totalHeight} - 36px)`
              : `auto`,
          'margin-bottom': mainBottomHeight
        }"
      >
        <slot name="inner-main"></slot>
      </scroll-view>
      <view
        class="main-bottom"
        :style="{ paddingBottom: (systemInfo.safeBottom == 0 ? 10 : systemInfo.safeBottom) + 'px' }"
      >
        <slot name="inner-main-bottom"></slot>
      </view>
    </view>
    <!-- 遮罩层 -->
    <view
      class="transparent_mask"
      v-if="maskVisiable"
      @tap="hide"
      @touchmove.stop.prevent="moveHandle"
    ></view>
  </view>
</template>

<script setup>
import { ref, toRefs, getCurrentInstance, useSlots, defineExpose } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import { useSystemInfoStore } from '@/stores/systemInfo';

const systemInfo = useSystemInfoStore();
const instance = getCurrentInstance();

const props = defineProps({
  needAuth: {
    type: Boolean,
    default: false
  },
  showMain: {
    type: Boolean,
    default: true
  }
});
const { needAuth, showMain } = toRefs(props);
const emits = defineEmits(['onShowMainFail', 'popupShowAfterLogin', 'onPopupHide']);
const slots = useSlots();

const topSlotHeight = ref('0px');
const mainTopHeight = ref('0px');
const mainBottomHeight = ref('0px');
const totalHeight = ref('0px');
const showPopupTop = ref(true);
const showPopupMain = ref(false);
const showAnimating = ref(false);
const hideAnimating = ref(false);
const maskVisiable = ref(false);

const show = () => {
  if (needAuth.value) {
    uni.showToast({
      title: '请先登录~',
      icon: 'none'
    });
    // app.officialModalAuth({ mustLoginMember: true }, () => {
    //   showPopupMain = true;
    //   maskVisiable = true;
    //   showAnimating = true;
    //   $emit('popupShowAfterLogin');
    //   setTimeout(() => {
    //     reCountHeight();
    //   }, 260);
    //   setTimeout(() => {
    //     showPopupTop = false;
    //     showAnimating = false;
    //   }, 500);
    // });
    return;
  }
  if (!slots['inner-main'] || !showMain.value) {
    if (!showMain.value) {
      emits('onShowMainFail');
    }
    return;
  }
  showPopupMain.value = true;
  maskVisiable.value = true;
  showAnimating.value = true;
  setTimeout(() => {
    reCountHeight();
  }, 260);
  setTimeout(() => {
    showPopupTop.value = false;
    showAnimating.value = false;
  }, 500);
};
const hide = () => {
  if (showAnimating.value) return;
  maskVisiable.value = false;
  hideAnimating.value = true;
  setTimeout(() => {
    showPopupTop.value = true;
    emits('onPopupHide');
  }, 20);
  setTimeout(() => {
    showPopupMain.value = false;
    hideAnimating.value = false;
  }, 30);
};
const showForce = () => {
  if (needAuth.value) {
    uni.showToast({
      title: '请先登录~',
      icon: 'none'
    });
    // setTimeout(() => {
    //   app.officialModalAuth({ mustLoginMember: true }, () => {
    //     showPopupMain.value = true;
    //     maskVisiable.value = true;
    //     emits('popupShowAfterLogin');
    //     setTimeout(() => {
    //       showPopupTop.value = false;
    //       reCountHeight();
    //     }, 100);
    //   });
    // }, 500);
    return;
  }
  if (!slots.main) {
    return;
  }
  showPopupMain.value = true;
  maskVisiable.value = true;
  setTimeout(() => {
    showPopupTop.value = false;
    reCountHeight();
  }, 100);
};
const reCountHeight = () => {
  const query = uni.createSelectorQuery().in(instance);
  query.select('.main-top').boundingClientRect();
  query.select('.main-bottom').boundingClientRect();
  query.exec((res) => {
    mainTopHeight.value = res[0].height + 'px';
    mainBottomHeight.value = res[1].height + 10 + 'px';
    totalHeight.value = res[0].height + res[1].height + 10 + 'px';
  });
};
const moveHandle = () => {};

defineExpose({
  hide,
  show,
  showForce
});

onReady(() => {
  const query = uni.createSelectorQuery().in(instance);
  query.select('.popup-top-block').boundingClientRect();
  query.exec((res) => {
    topSlotHeight.value = res[0] ? res[0].height + 'px' : 0;
  });
});

</script>

<style lang="scss">
.popup-container {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9000;
  width: 100vw;
  max-height: 100vh;
  transition: height 1s;
  .popup-top-tips {
    position: absolute;
    top: -60rpx;
    width: 100vw;
    max-height: 54rpx;
    color: #ff9e42;
    // font-weight: 500;
    font-size: 24rpx;
    line-height: 60rpx;
    text-align: center;
    background: #fffad9;
  }
  .popup-top-block {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: 16rpx;
    background: #ffffff;
  }
  .popup-main-block {
    position: absolute;
    bottom: 0;
    z-index: 2;
    width: 100%;
    max-height: 88vh;
    background: #ffffff;
    .main-top {
      position: relative;
    }
    .main-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 32rpx 16rpx 32rpx;
      background: #ffffff;
    }
  }
  .popup-main-block.show-animate {
    transform-origin: center bottom;
    animation: showAnimate 0.5s both 1;
    animation-timing-function: ease;
    animation-fill-mode: forwards;
  }
  .popup-main-block.hide-animate {
    transform-origin: center bottom;
    animation: hideAnimate 0.5s both 1;
    animation-timing-function: ease;
    animation-fill-mode: forwards;
  }
  @keyframes showAnimate {
    from {
      bottom: -88vh;
    }
    to {
      bottom: 0;
    }
  }
  @keyframes hideAnimate {
    from {
      bottom: 0;
    }
    90% {
      opacity: 1;
    }
    to {
      bottom: -88vh;
      opacity: 0;
    }
  }
  @keyframes showAnimateBg {
    from {
      background: rgba(0, 0, 0, 0);
    }
    to {
      background: rgba(0, 0, 0, 0.5);
    }
  }
  .transparent_mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    animation: showAnimateBg 0.3s linear 0s 1;
    animation-fill-mode: forwards;
  }
}
</style>
