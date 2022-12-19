<template>
  <view class="nav-bar">
    <view
      v-if="!hidePlaceholder"
      class="nav-bar__placeholder"
      :style="
        'height:' + navBarFullHeight + ';' + (isTransparent ? 'position:absolute;top:0;' : '')
      "
    ></view>
    <view
      class="nav-bar__inner"
      :class="[systemInfo.ios ? 'ios' : 'android']"
      :style="navBarInnerStyle"
    >
      <!-- left功能区 -->
      <view class="nav-bar__left" style="width: auto">
        <view v-if="showBackIcon === 'black'" class="nav_back" @tap.stop="handleBackClick">
          <image
            style="width: 44rpx; height: 44rpx"
            src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/back_black.png"
          />
        </view>
        <view
          v-if="showBackIcon === 'blackBg'"
          class="nav_back w54 mgr12"
          @tap.stop="handleBackClick"
        >
          <image
            style="width: 54rpx; height: 54rpx"
            src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/back_black_bg.png"
          />
        </view>
        <view v-if="showBackIcon === 'white'" class="nav_back" @tap.stop="handleBackClick">
          <image
            style="width: 44rpx; height: 44rpx"
            src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/back_white.png"
          />
        </view>

        <view v-if="showHomeIcon === 'black'" class="home_back" @tap.stop="handleGoHomeClick">
          <image
            style="width: 60rpx; height: 60rpx"
            src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/home_black.png"
          />
        </view>
        <view v-if="showHomeIcon === 'white'" class="home_back" @tap.stop="handleGoHomeClick">
          <image
            style="width: 60rpx; height: 60rpx"
            src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/home_white.png"
          />
        </view>
      </view>

      <view class="nav-bar__center" :style="'justify-content:' + navCenterStyle">
        <!-- 地址选择区 -->
        <view v-if="showSelectBlock" class="nav-bar__center-location">
          <image
            class="locationIcon"
            src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/location-icon.png"
          />
          <view class="locationChoose">
            <picker
              @change="locationChange"
              :range="locationArr"
              range-key="name"
              :value="locationIndex"
            >
              <view class="picker">北京{{locationArr[locationIndex] ? locationArr[locationIndex].name : ''}}</view>
            </picker>
          </view>
        </view>
        <!-- 页面title -->
        <text v-else-if="title" :style="titleColor" class="nav-bar__center-title">{{ title }}</text>
      </view>

      <view class="nav-bar__right">
        <slot name="right"></slot>
      </view>

      <!-- 单独控制分享按钮 -->
      <view v-if="showShareIcon === 'normal'" class="share" :style="shareButtonStyle">
        <button class="button_share_01" open-type="share" />
      </view>
      <view v-if="showShareIcon === 'normal_black'" class="share" :style="shareButtonStyle">
        <button class="button_share_01_black" open-type="share" />
      </view>
      <view v-else-if="showShareIcon === 'weixinIcon'" class="share" :style="shareButtonStyle">
        <button class="button_share_02" open-type="share" />
      </view>

      <view
        v-if="showAddMiniProgram"
        class="add_miniprogram fadeInAndOut"
        :style="'top:' + navBarFullHeight"
      >
        <view @click.stop="neverShowAddMiniProgram" class="add_miniprogram_icon"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, toRefs, computed, onMounted, watch } from 'vue';
import { useSystemInfoStore } from '@/stores/systemInfo';
import { useLocationInfoStore } from '@/stores/location';
import constant from '@/lib/constant';
const systemInfo = useSystemInfoStore().systemInfo;
const locationStore = useLocationInfoStore();

const props = defineProps({
  showBackIcon: {
    type: String,
    default: 'none' // 0.none 1.black 2.white
  },
  showHomeIcon: {
    type: String,
    default: 'none' // 0.none 1.black 2.white
  },
  title: {
    type: String
  },
  showShareIcon: {
    type: String,
    default: 'none' // 0.none 1.normal 2.weixinIcon
  },
  showSelectBlock: {
    type: Boolean,
    default: false
  },
  isTransparent: {
    type: Boolean,
    default: false
  },
  backgroundColor: {
    type: String,
    default: 'color:#FFF;'
  },
  titleColor: {
    type: String,
    default: 'color:#2F2E3B;'
  },
  navCenterStyle: {
    type: String,
    default: 'flex-start'
  },
  enableFlash: {
    type: Boolean,
    default: false
  },
  hidePlaceholder: {
    type: Boolean,
    default: false
  },
  interceptBack: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['back', 'locationChange']);
const {
  hidePlaceholder,
  isTransparent,
  backgroundColor,
  showShareIcon,
  showHomeIcon,
  title,
  titleColor,
  interceptBack,
  showSelectBlock
} = toRefs(props);
const navBarFullHeight = computed(() => {
  const { navBarHeight = 0, navBarExtendHeight = 0, statusBarHeight = 0 } = systemInfo;
  return `${navBarHeight + navBarExtendHeight + statusBarHeight}px`;
});
const showAddMiniProgram = ref(false);
const locationIndex = computed(() => {
  const index = locationArr.value.findIndex(item => {
    return item.code === locationCode.value;
  });
  return index > 0 ? index : 0;
});
const locationArr = computed(() => locationStore.getAreaList);
const locationCode = computed(() => locationStore.getCode);
// 只会在首次store被赋值时触发，用来init初始值
// watch(locationCode, (newVal, oldVal) => {
//   locationIndex.value = locationArr.value.findIndex(item => {
//     return item.code === newVal;
//   });
// }, { deep: true });

const shareButtonStyle = computed(() => {
  return `top:${systemInfo.capsulePosition.top}px;left:calc(${systemInfo.capsulePosition.left}px - 74rpx);`;
});
// 导航栏内容样式
const navBarInnerStyle = computed(() => {
  const { statusBarHeight, capsulePosition, navBarExtendHeight, windowWidth } = systemInfo;
  const leftWidth = windowWidth - capsulePosition.left; // 胶囊按钮左侧到屏幕右侧的边距
  const navigationbarinnerStyle = [
    `background:${backgroundColor.value}`,
    `height:${navBarFullHeight.value}`,
    `padding-top:${statusBarHeight}px`,
    `padding-right:${leftWidth}px`,
    `padding-bottom:${navBarExtendHeight}px`
  ];
  return navigationbarinnerStyle.join(';');
});

const judgeAddMiniProgram = () => {
  // 判断添加小程序
  const ADD_MINIPROGRAM_DAY = uni.getStorageSync(constant.STORAGE_KEYS.ADD_MINIPROGRAM_DAY);
  const date = new Date();
  const nowTime = date.getMonth() + 1 + '-' + date.getDate();
  if (ADD_MINIPROGRAM_DAY) {
    // 是否是今天
    if (ADD_MINIPROGRAM_DAY === nowTime) {
      // 今天不显示
    } else if (ADD_MINIPROGRAM_DAY === 'never') {
      // 永远不显示
    } else {
      uni.setStorageSync(constant.STORAGE_KEYS.ADD_MINIPROGRAM_DAY, nowTime);
      showAddMiniProgram.value = true;
    }
  } else {
    uni.setStorageSync(constant.STORAGE_KEYS.ADD_MINIPROGRAM_DAY, nowTime);
    showAddMiniProgram.value = true;
  }
};
const neverShowAddMiniProgram = () => {
  uni.setStorageSync(constant.STORAGE_KEYS.ADD_MINIPROGRAM_DAY, 'never');
  showAddMiniProgram.value = false;
};

const handleBackClick = () => {
  if (interceptBack.value) {
    this.$emit('back');
    return false;
  }
  // eslint-disable-next-line no-undef
  const pages = getCurrentPages();
  if (pages.length >= 2) {
    uni.navigateBack({
      delta: 1
    });
  } else {
    uni.redirectTo({
      url: '/pages/index'
    });
  }
};
const handleGoHomeClick = () => {
  if (interceptBack.value) {
    this.$emit('back');
    return false;
  }
  uni.redirectTo({
    url: '/pages/index'
  });
};
const locationChange = (res) => {
  console.log('locationChange', res);
  locationIndex.value = parseInt(res.detail?.value);
  locationStore.$patch((state) => {
    state.locationInfo.code = locationArr.value[res.detail?.value].code;
    state.locationInfo.name = locationArr.value[res.detail?.value].name;
  });
  emits('locationChange', locationArr.value[res.detail?.value]);
};

onMounted(() => {
  judgeAddMiniProgram();
});
</script>

<style lang="scss" scoped>
.nav-bar {
  --nav-bar-full-height: 68px;
  --nav-bar-right: 97px;
  .nav-bar__placeholder {
    position: relative;
    z-index: 50;
    height: var(--nav-bar-full-height);
    background: #f8f8f8;
    visibility: hidden;
  }

  .add_miniprogram {
    position: absolute;
    right: 26rpx;
    width: 378rpx;
    height: 120rpx;
    background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/add_my_miniprogram.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .add_miniprogram_icon {
      position: absolute;
      right: 24rpx;
      bottom: 20rpx;
      width: 20rpx;
      height: 20rpx;
      background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/add_my_miniprogram_close.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

  .fadeInAndOut {
    animation-name: fadeInAndOut;
    animation-duration: 10s;
    animation-fill-mode: forwards;
  }

  .ios {
    --nav-bar-right: 97px; /* 10+87 */
    --nav-bar-extend-height: 4px;

    box-sizing: border-box;
  }

  .android {
    --nav-bar-right: 96px; /* 10+87 */
    --nav-bar-extend-height: 4px;

    box-sizing: border-box;
  }

  .devtools {
    --nav-bar-right: 88px; /* 10+87 */
    --nav-bar-extend-height: 4px;

    box-sizing: border-box;
  }

  .nav-bar__inner {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 600;
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--nav-bar-full-height);
    padding-top: 20px;
    padding-right: var(--nav-bar-right);
    padding-bottom: 4px;
    .nav-bar__left {
      position: relative;
      display: flex;
      align-items: center;
      width: var(--nav-bar-right);
      height: 32px;
      margin-left: 40rpx;
      .nav_back {
        &.w54 {
          width: 54rpx;
          height: 54rpx;
        }
        &.mgr12 {
          margin-right: 12rpx;
        }

        position: relative;
        display: flex;
        align-items: center;
        width: 44rpx;
        height: 44rpx;
        height: 100%;
      }
      .home_back {
        width: 60rpx;
        height: 60rpx;
        margin-right: 24rpx;
      }
      .popmartlogo {
        margin-right: 32rpx;
        image {
          width: 142rpx;
          height: 44rpx;
        }
      }
    }
  }

  .nav-bar__center {
    position: relative;
    display: flex;
    align-items: center;
    width: 364rpx;
    // justify-content: center;
    overflow: hidden;
    font-size: 17px;
    text-align: left;
    .nav-bar__center-location {
      display: flex;
      align-items: center;
      .locationIcon {
        width: 48rpx;
        height: 48rpx;
        margin-right: 4rpx;
      }
      .locationChoose {
        font-size: 36rpx;
        font-weight: 700;
        color: #333333;
        line-height: 52rpx;
      }
    }
    .nav-bar__center-title {
      max-width: 450rpx;
      margin-top: -2px;
      overflow: hidden;
      font-size: 36rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 700;
    }
  }
  .nav-bar__center.large {
    width: 100%;
    margin-right: 16rpx;
    input {
      width: 100%;
    }
  }
  .share {
    position: absolute;
  }
  .button_share_01 {
    width: 60rpx;
    height: 60rpx;
    background-image: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/topic-share-icon.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .button_share_01_black {
    width: 60rpx;
    height: 60rpx;
    background-image: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/topic-share-icon-o.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .button_share_02 {
    width: 64rpx;
    height: 64rpx;
    background-image: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/new_share_03.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}

@keyframes flash {
  from,
  50%,
  to {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 0.3;
  }
}
@keyframes fadeInAndOut {
  from {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  to {
    display: none;
    opacity: 0;
  }
}
</style>
