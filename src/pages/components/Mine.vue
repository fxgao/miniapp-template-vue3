<template>
  <view class="page">
    <nav-bar
      ref="navbar"
      :isTransparent="true"
      :titleColor="navTitleColor"
      :backgroundColor="navBarBackgroundColor"
    />
    <view class="pageContainer">
      <view class="userInfoBlock" @click="goEditProfile" @longpress="toDevPage">
        <image
          class="userAvatar"
          :src="
            loginInfoData?.photo
              ? loginInfoData.photo
              : 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/default-avatar.png'
          "
          mode="aspectFit"
          @longpress="toDevPage"
        />
        <view class="userInfo">
          <view class="infoRow">
            <view class="userName" hover-class="none" hover-stop-propagation="false">
              {{ loginInfoData?.nickname && loginInfoData?.openId ? loginInfoData.nickname : '请填写信息' }}
            </view>
            <image
              v-if="loginInfoData?.sex"
              class="sex"
              :src="
                loginInfoData?.sex === '男'
                  ? 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/sex-male.png'
                  : 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/sex-female.png'
              "
            />
            <view class="age" v-if="loginInfoData?.age"> {{ loginInfoData.age }}岁 </view>
          </view>
          <view class="infoRow" v-if="loginInfoData?.openId">
            <view class="level" v-if="loginInfoData?.level">
              级别{{ Constant.LEVEL_GRADE_2STRING_MAP[loginInfoData?.level] }}
            </view>
            <view class="phone" v-if="loginInfoData?.tel">
              {{ hideMiddlePhone(loginInfoData.tel) }}
            </view>
          </view>
        </view>
      </view>
      <view class="userJoinBlock">
        <view class="title"> 我参与的 </view>
        <view class="joinBlock" hover-class="none" hover-stop-propagation="false">
          <view
            class="joinItem"
            v-for="(item, index) in joinList"
            :key="index"
            @click="goJoinPath(item)"
          >
            <image class="joinIcon" :src="item.img" />
            <view class="joinText">
              {{ item.text }}
            </view>
          </view>
        </view>
      </view>
      <view class="settingListBlock">
        <view class="settingListItem" @click="goSettingPath(item)" v-for="(item, index) in settingList" :key="index">
          <view class="left">
            <image class="settingIcon" :src="item.icon" />
            <view class="settingText">
              {{ item.title }}
            </view>
          </view>
          <image class="rightIcon" src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { onLoad } from '@dcloudio/uni-app';
import { useAppInstance, useNav } from '@/hooks';
import { useLoginInfoStore } from '@/stores/loginInfo';
import Constant from '@/lib/constant';
import { hideMiddlePhone } from '@/utils';

const { $onLaunched } = useAppInstance();
const { to } = useNav();
const loginInfoStore = useLoginInfoStore();
const { loginInfoData } = storeToRefs(loginInfoStore);
console.log('useLoginInfoStore', loginInfoData);

const navTitleColor = ref('color: rgba(0,0,0,1);justify-content: flex-end;');
const navBarBackgroundColor = ref('rgba(255,255,255,0)');

const pageScroll = (e) => {
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
};

const joinList = ref([
  {
    path: '/mine/join-activity',
    text: '活动',
    img: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/bg/join-activity-bg.png'
  },
  {
    path: '/mine/join-match',
    text: '赛事',
    img: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/bg/join-game-bg.png'
  },
  {
    path: '/mine/join-course',
    text: '课程',
    img: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/bg/join-course-bg.png'
  }
]);

const settingList = ref([
  {
    title: '我的订单',
    icon: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/setting-order-icon.png',
    path: '/mine/order-list'
  },
  {
    title: '等级说明',
    icon: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/setting-level-icon.png',
    path: '/mp-html?alias=descriptionGrade&title=等级说明'
  },
  {
    title: '关于得乐',
    icon: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/setting-about-icon.png',
    path: '/mp-html?alias=aboutUs&title=关于得乐'
  },
  {
    title: '联系我们',
    icon: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/setting-concat-icon.png',
    path: '/mp-html?alias=contactUs&title=联系我们'
  },
  {
    title: '建议反馈',
    icon: 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/setting-question-icon.png',
    path: '/suggest'
  }
]);

const goEditProfile = () => {
  to('/edit-profile?navBack=true');
};

const goJoinPath = (item) => {
  console.log('goJoinPath', item.path);
  to(item.path);
};

const goSettingPath = (item) => {
  console.log('goSettingPath', item.path);
  if (item.path === '/suggest' && !loginInfoData?.value?.tel) {
    to('/edit-profile');
  }
  to(item.path);
};

const toDevPage = () => {
  /* eslint-disable */
  if (__wxConfig.envVersion === 'release') return;
  to('/dev-page');
}

onLoad(async (options) => {
  await $onLaunched;
});

defineExpose({
  pageScroll
});
</script>

<style lang="scss" scoped>
.page {
  min-height: auto;
  .pageContainer {
    padding: 0 40rpx ;
    .userInfoBlock {
      @include flex-start;
      .userAvatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        flex-shrink: 0;
        background: #f5f5f5;
      }
      .userInfo {
        &::after {
          content: '';
          position: absolute;
          right: -32rpx;
          top: 50%;
          transform: translateY(-50%);
          height: 32rpx;
          width: 32rpx;
          font-size: 32rpx;
          background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png');
          background-size: contain;
        }
        margin-left: 32rpx;
        position: relative;
        .infoRow {
          &:not(:first-child) {
            margin-top: 16rpx;
          }
          width: 500rpx;
          @include flex-start;
          .userName {
            font-size: 36rpx;
            font-weight: 700;
            color: #333333;
            line-height: 52rpx;
          }
          .sex {
            width: 32rpx;
            height: 32rpx;
            margin-left: 16rpx;
          }
          .age, .phone {
            font-size: 28rpx;
            color: #A0A0A0;
            line-height: 44rpx;
            margin-left: 16rpx;
          }
          .level {
            font-size: 24rpx;
            color: #FFFFFF;
            line-height: 24rpx;
            background: linear-gradient(135deg, #ADE767 0%, #4CAC00 100%);
            border-radius: 4rpx;
            padding: 4rpx 8rpx;
          }
        }
      }
    }
    .userJoinBlock {
      background: #FFFFFF;
      border-radius: 16rpx;
      margin-top: 48rpx;
      padding: 24rpx;
      .title {
        font-size: 32rpx;
        font-weight: 700;
        color: #333333;
        line-height: 48rpx;
      }
      .joinBlock {
        @include flex-between;
        margin-top: 24rpx;
        padding: 0 44rpx;
        .joinItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          .joinIcon {
            width: 64rpx;
            height: 64rpx;
          }
          .joinText {
            font-size: 28rpx;
            color: #333333;
            line-height: 44rpx;
            margin-top: 16rpx;
          }
        }
      }
    }
    .settingListBlock {
      background: #FFFFFF;
      border-radius: 16rpx;
      margin-top: 32rpx;
      .settingListItem {
        @include flex-between;
        padding: 32rpx 24rpx;
        .left {
          @include flex-start;
          .settingIcon {
            width: 40rpx;
            height: 40rpx;
          }
          .settingText {
            margin-left: 16rpx;
            font-size: 32rpx;
            color: #333333;
            line-height: 48rpx;
          }
        }
        .rightIcon {
          height: 32rpx;
          width: 32rpx;
        }
      }
    }
  }
}
</style>
