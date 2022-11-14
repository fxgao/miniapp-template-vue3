<template>
  <view class="container">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :showBackIcon="'black'"
      title="场馆详情"
      :navCenterStyle="'flex-end'"
    />
    <view class="pageContainer">
      <!-- 顶部滚动信息 -->
      <Marquee></Marquee>
      <view class="stadiumInfoContainer">
        <view class="title">{{ stadiumInfo.stadiumName }}</view>
        <view class="labelList">
          <view class="labelItem">室内</view>
          <view class="labelItem">幼少儿</view>
          <view class="labelItem">可预约</view>
        </view>
        <scroll-view class="imgBlock" :scroll-x="true">
          <view
            class="imgItem"
            v-for="(item, index) in stadiumInfo.imageVoList"
            :key="index"
            @click="showLargeImg(item)"
          >
            <image class="bgImg" :src="item.imageUrl" mode="aspectFit" />
            <view class="text">({{ item.length }})</view>
          </view>
        </scroll-view>
        <view class="bottomInfo">
          <view class="leftLocation">
            <view class="location">{{ stadiumInfo.areaDetail }}</view>
            <view class="chargeInfo">
              <image class="avatar" src="" mode="aspectFit" />
              <view class="name">郭教练</view>
              <view class="tag">场馆负责人</view>
            </view>
          </view>
          <view class="rightIcon">
            <view class="iconItem map" @click="showMap"></view>
            <view class="iconItem share" @click="showWechatModal"></view>
            <view class="iconItem phone" @click="copyPhone"></view>
          </view>
        </view>
      </view>
      <!-- 活动信息 -->
      <view class="stadiumActivityContainer" v-if="stadiumId">
        <view class="header">
          <view class="title" hover-class="none" hover-stop-propagation="false">预约活动</view>
          <view class="moreText" @click="handleGoMore">
            全部活动
            <image
              class="icon"
              src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png"
            />
          </view>
        </view>
        <activity-schedule :stadiumId="stadiumId"></activity-schedule>
      </view>
      <!-- 教练团队信息 -->
      <view class="coachInfoContainer" v-if="coachList.length > 0">
        <view class="title">教练团队</view>
        <view class="coachList">
          <coach-card
            v-for="item in coachList"
            :key="item.id"
            :id="item.id"
            :name="item.nickName"
            :img="item.photo"
            :level="item.level"
            :content="item.remarks"
            :size="'small'"
            @click="goCoachDetail(item)"
          ></coach-card>
        </view>
      </view>
    </view>
    <Modal v-model:show="wechatModalShow" title="咨询客服">
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
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAppInstance, useNav } from '@/hooks';
import api from '@/api';
import Marquee from '@/components/marquee';
import ActivitySchedule from '../components/activity-schedule';
import CoachCard from '@/components/list-card/coach-card';
import activitySchedule from '../components/activity-schedule.vue';
import Modal from '@/components/modal';

const { $onLaunched } = useAppInstance();
const { to } = useNav();

const stadiumId = ref(null);
const stadiumInfo = ref({});
const initStadiumInfo = async (id) => {
  const resInfo = await api.stadium.getStadiumDetailInfo(id);
  console.log('getStadiumDetailInfo res', resInfo);
  stadiumInfo.value = resInfo;
};

const initActivityInfo = (id) => {};

const coachList = ref([]);
const initCoachInfo = async (id) => {
  const res = await api.stadium.getStadiumCoachInfo(id);
  console.log('getStadiumCoachInfo res', res);
  coachList.value = res;
};

// 跳转教练详情
const goCoachDetail = (item) => {
  console.log('goCoachDetail', item);
  to();
};

// 打开地图
const showMap = () => {
  uni.openLocation({
    latitude: stadiumInfo.value.lat,
    longitude: stadiumInfo.value.lng,
    scale: 18
  });
};

const wechatModalShow = ref(false);
// 打开微信二维码弹窗
const showWechatModal = () => {
  wechatModalShow.value = true;
};

const copyPhone = () => {
  uni.setClipboardData({
    data: stadiumInfo.value.landlinePhone,
    success(res) {
      uni.showToast({ title: '复制电话成功', icon: 'none' });
    }
  });
};

onLoad(async (options) => {
  console.log('stadium detail onload', options);
  if (options.id) {
    stadiumId.value = options.id;
  } else {
    uni.showToast({ title: '参数中无场馆ID', icon: 'none' });
    return;
  }
  await $onLaunched;
  // 加载场馆信息
  await initStadiumInfo(options.id);
  // 加载场馆活动信息
  initActivityInfo();
  // 加载教练信息
  initCoachInfo(options.id);
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}
.pageContainer {
  .stadiumInfoContainer {
    padding-top: 16rpx;
    background: #fff;
    .title {
      @include text-ellipsis-2;
      font-size: 40rpx;
      font-weight: 600;
      color: #333333;
      line-height: 56rpx;
      padding: 0 40rpx;
    }
    .labelList {
      @include flex-start;
      padding: 0 40rpx;
      margin-top: 16rpx;
      .labelItem {
        &:not(:last-child) {
          margin-right: 8rpx;
        }
        border-radius: 4rpx;
        border: 1rpx solid #979797;
        font-size: 24rpx;
        color: #a0a0a0;
        line-height: 24rpx;
        padding: 4rpx 8rpx;
      }
    }
    .imgBlock {
      margin-top: 32rpx;
      padding-left: 40rpx;
      .imgItem {
        &:last-child {
          margin-right: 32rpx;
        }
        position: relative;
        border-radius: 16rpx;
        margin-right: 16rpx;
        .bgImg {
          width: 272rpx;
          height: 204rpx;
        }
        .text {
          position: absolute;
          bottom: 8rpx;
          right: 8rpx;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 20rpx;
          font-size: 20rpx;
          color: #ffffff;
          line-height: 36rpx;
          padding: 2rpx 16rpx;
        }
      }
    }
    .bottomInfo {
      @include flex-between;
      padding: 32rpx 40rpx;
      .leftLocation {
        display: flex;
        flex-direction: column;
        .location {
          @include text-ellipsis-2;
          font-size: 28rpx;
          color: #333333;
          line-height: 44rpx;
          max-width: 368rpx;
        }
        .chargeInfo {
          @include flex-start;
          margin-top: 16rpx;
          .avatar {
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            background: #a0a0a0;
          }
          .name {
            font-size: 28rpx;
            font-weight: 500;
            color: #333333;
            line-height: 44rpx;
            margin-left: 16rpx;
          }
          .tag {
            background: #ffeeee;
            border-radius: 4rpx;
            font-size: 24rpx;
            color: #ff5a5a;
            line-height: 32rpx;
            padding: 0 8rpx;
            margin-left: 16rpx;
          }
        }
      }
      .rightIcon {
        @include flex-start;
        .iconItem {
          &.map {
            background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/navigation-icon.png')
              0 0 no-repeat;
            background-size: contain;
            margin-right: 32rpx;
          }
          &.share {
            background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/wechat-icon.png')
              0 0 no-repeat;
            background-size: contain;
            margin-right: 32rpx;
          }
          &.phone {
            background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/phone-icon.png')
              0 0 no-repeat;
            background-size: contain;
          }
          width: 64rpx;
          height: 64rpx;
          background: #ffefe9;
          border-radius: 50%;
        }
      }
    }
  }
  .stadiumActivityContainer {
    margin-top: 16rpx;
    background: #fff;
    .header {
      @include flex-between;
      padding: 32rpx 40rpx;
      .title {
        font-size: 36rpx;
        font-weight: 500;
        color: #333333;
        line-height: 52rpx;
      }
      .moreText {
        @include flex-center;
        font-size: 28rpx;
        color: #a0a0a0;
        line-height: 32rpx;
        margin-right: -8rpx;
        .icon {
          height: 32rpx;
          width: 32rpx;
          margin-left: 8rpx;
        }
      }
    }
  }
  .coachInfoContainer {
    background: linear-gradient(180deg, #ffffff 0rpx, #f5f5f5 196rpx);
    backdrop-filter: blur(36rpx);
    margin-top: 16rpx;
    padding: 0 40rpx;
    .title {
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      line-height: 52rpx;
      padding: 32rpx 0;
    }
    .coachList {
      @include flex-between;
      flex-wrap: wrap;
      padding-bottom: 32rpx;
    }
  }
}
.modalContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  .wechatImg {
    width: 362rpx;
    height: 362rpx;
    margin: 0 68rpx;
  }
  .text {
    font-size: 24rpx;
    color: #a0a0a0;
    line-height: 40rpx;
    text-align: center;
    margin-top: 32rpx;
  }
}
.actionBlock {
  @include flex-between;
  width: 100%;
  .saveBtn {
    border-radius: 40rpx;
    border: 2rpx solid #ff6829;
    backdrop-filter: blur(1rpx);
    font-size: 32rpx;
    font-weight: 600;
    color: #ff6829;
    line-height: 48rpx;
    padding: 20rpx 36rpx;
  }
  .copyBtn {
    background: linear-gradient(135deg, #ffab43 0%, #ff6829 100%);
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    line-height: 48rpx;
    padding: 20rpx 36rpx;
  }
}
</style>
