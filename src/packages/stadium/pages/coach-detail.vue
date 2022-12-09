<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :isTransparent="true"
      :showBackIcon="'black'"
      :titleColor="navTitleColor"
      :backgroundColor="navBarBackgroundColor"
    />
    <view class="pageContainer">
      <view class="photoBlock">
        <image class="photo" :src="coachDetail.photo" mode="aspectFill" />
      </view>
      <view class="main">
        <view class="name">
          {{ coachDetail.nickName }}
          <text class="seniority">教龄{{coachDetail.seniority}}年</text>
        </view>
        <view class="labels">
          <view class="label-item red" v-if="coachDetail.level">高级</view>
          <view class="label-item">外教</view>
        </view>
        <view class="stadium" v-for="item in stadiumList" :key="item.id" @click="goStadiumDetail(item)">
          <view class="place">{{item.stadiumName}}</view>
          <image class="rightIcon" src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png" />
        </view>
        <view class="content">
          {{ coachDetail.remarks }}
        </view>
      </view>
    </view>
    <view class="detailPopupBottom">
      <PopupBottom ref="popup1">
        <template v-slot:outer-main>
          <view class="actionBlock">
            <view class="actionBtn" @click="callPhone">联系我</view>
          </view>
        </template>
      </PopupBottom>
    </view>
    <!-- <view class="modalContainer">
      <Modal v-model:show="infoModalShow">
        <view class="modalContainer">
        <image class="wechatImg" :src="stadiumInfo.wechatCardUrl" />
        <view class="text">更多活动内容请添加教练微信进行咨询</view>
      </view>
      <template v-slot:bottom>
        <view class="actionBlock">
          <view class="saveBtn" @click="saveQrCode">保存二维码</view>
          <view class="copyBtn" @click="copyWechatNumber">复制微信号</view>
        </view>
      </template>
      </Modal>
    </view> -->
  </view>
</template>

<script setup>
import { computed, reactive, ref, toRefs } from 'vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import { useAppInstance, useNav } from '@/hooks';
import { useLoginInfoStore } from '@/stores/loginInfo';
import PopupBottom from '@/components/popup-bottom';
// import Modal from '@/components/modal';
import api from '@/api';

const { $onLaunched } = useAppInstance();
const { to } = useNav();
const { loginInfoData } = useLoginInfoStore();
console.log('useLoginInfoStore', loginInfoData);

const navTitleColor = ref('color: rgba(0,0,0,1);justify-content: flex-end;');
const navBarBackgroundColor = ref('rgba(255,255,255,0)');
const coachId = ref(0);
const coachDetail = ref({});
const popup1 = ref(null);
const infoModalShow = ref(false);

const stadiumList = computed(() => {
  return coachDetail.value?.tbBizStadiumListVo || [];
});

const goStadiumDetail = (item) => {
  to('/stadium/detail', { id: item.id });
};

onPageScroll((e) => {
  const scrollTop = e.scrollTop;
  const transparent = scrollTop / 36 >= 1 ? 1 : scrollTop / 36;
  navTitleColor.value = `color:rgba(0,0,0,${transparent});justify-content: flex-end;`;
  navBarBackgroundColor.value = `rgba(255,255,255,${transparent})`;
  if (transparent >= 1) {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
  } else {
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    });
  }
});

const showModal = () => {
  infoModalShow.value = true;
};

const callPhone = () => {
  uni.makePhoneCall({
    phoneNumber: coachDetail.value.phone
  });
};

onLoad(async (options) => {
  coachId.value = options.id;
  await $onLaunched;
  const res = await api.coach.getCoachDetail(options.id);
  console.log('getCoachDetail', res);
  coachDetail.value = res;
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
}
.pageContainer {
  position: relative;
  .photoBlock {
    background: #f5f5f5;
    height: 562rpx;
    width: 100%;
    .photo {
      width: 100%;
      height: 100%;
    }
  }
  .main {
    width: 100%;
    height: calc(100vh - 562rpx);
    background: #ffffff;
    transform: translateY(-40rpx);
    padding: 32rpx 40rpx;
    border-radius: 48rpx 48rpx 0px 0px;
    backdrop-filter: blur(36px);
    overflow-y: scroll;
    .name {
      font-size: 40rpx;
      font-weight: 700;
      color: #333333;
      line-height: 56rpx;
      .seniority {
        font-size: 28rpx;
        font-weight: 400;
        color: #A0A0A0;
        line-height: 44rpx;
      }
    }
    .labels {
      @include flex-start;
      margin-top: 16rpx;
      .label-item {
        &:not(:last-child) {
          margin-right: 8rpx;
        }
        &.red {
          background: #FFEFE9;
          color: #FF6829;
          border: none;
        }
        border-radius: 4rpx;
        border: 1rpx solid #979797;
        font-size: 24rpx;
        color: #A0A0A0;
        line-height: 24rpx;
        padding: 4rpx 8rpx;
      }
    }
    .stadium {
      @include flex-between;
      margin-top: 32rpx;
      .place {
        font-size: 28rpx;
        color: #333333;
        line-height: 44rpx;
      }
      .rightIcon {
        height: 32rpx;
        width: 32rpx;
      }
    }
    .content {
      font-size: 28rpx;
      color: #333333;
      line-height: 44rpx;
      margin-top: 32rpx;
    }
  }
}
.detailPopupBottom {
  .actionBlock {
    padding: 16rpx 40rpx;
    border-top: 2rpx solid #eee;
    .actionBtn {
      @include btn-normal;
    }
  }
}
</style>
