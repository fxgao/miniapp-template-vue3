<template>
  <view class="page">
    <nav-bar
      ref="navBar"
      title="活动详情"
      showBackIcon="black"
      titleColor="color:#2F2E3B;"
      backgroundColor="rgba(255,255,255,1)"
      :navCenterStyle="'flex-end'"
    ></nav-bar>
    <view class="pageContainer" :style="popup1 ? 'padding-bottom:' + popup1.topSlotHeight : ''">
      <view class="infoBlock">
        <detail-header :title="activityInfo.activeName" :labelList="labelList"></detail-header>
        <view class="reportInfoBlock">
          <report-info :total="activityInfo.completePersonCount"></report-info>
        </view>
      </view>
      <view class="infoBlock">
        <view class="title">基本信息</view>
        <view class="infoItem">
          <view class="leftText">活动时间：</view>
          <view class="right"
            >{{ activityInfo.activeStartTime }} - {{ activityInfo.activeEndTime }}</view
          >
        </view>
        <view class="infoItem">
          <view class="leftText">截止报名：</view>
          <view class="right"
            >{{ activityInfo.activeStartTime }} - {{ activityInfo.activeEndTime }}</view
          >
        </view>
        <view class="infoItem">
          <view class="leftText">活动地点：</view>
          <view class="right">{{ activityInfo.areaDetail || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">活动等级：</view>
          <view class="right">{{ activityInfo.areaDetail || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">活动费用：</view>
          <view class="right">{{ activityInfo.activityPrice || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">有无停车场：</view>
          <view class="right">{{ activityInfo.isParkValue || '无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">流程安排：</view>
          <view class="right">{{ activityInfo.activeRemark || '无' }}</view>
        </view>
      </view>
      <view class="infoBlock">
        <view class="title">活动说明</view>
        <mp-html v-model:content="activityInfo.activeRule"></mp-html>
      </view>
      <view class="infoBlock list">
        <view class="title">热门场馆</view>
        <view @click="goStadiumDetail(item)" v-for="item in stadiumList" :key="item.id">
          <stadium-card :info="item"></stadium-card>
        </view>
      </view>
    </view>
    <view class="detailPopupBottom" v-if="activityInfo.activityPrice">
      <PopupBottom ref="popup1">
        <template v-slot:outer-main>
          <view class="actionBlock">
            <view class="actionBtn plain" @click="showWechatModal">立即咨询</view>
            <view class="actionBtn">¥{{ activityInfo.activityPrice }} 报名</view>
          </view>
        </template>
      </PopupBottom>
    </view>
    <view class="modalContainer">
      <Modal v-model:show="wechatModalShow" title="活动咨询">
        <view class="modalBlock">
          <image class="wechatImg" :src="activityInfo.wechatCardUrl" />
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
  </view>
</template>

<script setup>
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import DetailHeader from '@/components/detail/header';
import ReportInfo from '@/components/detail/report-info';
import MpHtml from '@/components/mp-html/mp-html.vue';
import PopupBottom from '@/components/popup-bottom';
import Modal from '@/components/modal';
import StadiumCard from '@/components/list-card/stadium-card';
import { useAppInstance } from '@/hooks';
import api from '@/api';
const { $onLaunched } = useAppInstance();

const activityId = ref(null);
const publishId = ref(null);
const popup1 = ref(null);

const activityInfo = ref({});
const labelList = computed(() => {
  const resLabel = [];
  if (activityInfo.value.activeTypeValue) {
    resLabel.push({
      label: activityInfo.value.activeTypeValue,
      style: 'font-size: 24rpx;color: #5DB612;line-height: 32rpx;background: #EEF7E6;border:none;'
    });
  }
  if (activityInfo.value.placeEnvFormValue) {
    resLabel.push({
      label: activityInfo.value.placeEnvFormValue
    });
  }
  if (activityInfo.value.placeApplyPeopleValue) {
    resLabel.push({
      label: activityInfo.value.placeApplyPeopleValue
    });
  }
  return resLabel;
});

const initDetail = async (refresh = false) => {
  uni.showLoading();
  try {
    const res = await api.activity.getActivityDetail(activityId.value);
    console.log('getActivityDetail res', res);
    res.activeRule = `<h1 style="text-align: left;">Welcome to the TinyMCE demo!</h1>
<p style="font-size: 15px; text-align: left;"><img src="https://www.baidu.com/img/bd_logo1.png" alt="My alt text" width="540" height="258" /></p >
<p style="font-size: 15px; text-align: left;">f<strong>adsfdasfas</strong>df</p >
<p style="font-size: 15px; text-align: left;">fad<em>sfasd</em>fasd</p >`;
    activityInfo.value = res;
  } catch (error) {
    uni.showToast({ title: error, icon: 'none' });
  } finally {
    uni.hideLoading();
    refresh && uni.showToast({ title: '刷新成功!', icon: 'none' });
  }
};

const wechatModalShow = ref(false);

const showWechatModal = () => {
  wechatModalShow.value = true;
};

const stadiumList = ref([]);
const getHotStadiumList = () => {
  api.homePage.getHotStadiumList().then((res) => {
    stadiumList.value = res || [];
  });
};

onLoad(async (options) => {
  const { id, pubId } = options;
  activityId.value = id;
  publishId.value = pubId;
  await $onLaunched;
  console.log('activity detail onload', options);
  initDetail();
  getHotStadiumList(); // 热门场馆
});
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100vh;
}
.pageContainer {
  background: #f5f5f5;
  .infoBlock {
    &:not(:first-child) {
      margin-top: 16rpx;
    }
    &.list {
      background: linear-gradient(180deg, #FFFFFF 0, #F5F5F5 80rpx, #F5F5F5 100%);
    }
    background: #fff;
    padding: 32rpx 40rpx;
    .reportInfoBlock {
      margin-top: 32rpx;
    }
    .title {
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      line-height: 52rpx;
      margin-bottom: 32rpx;
    }
    .infoItem {
      &:not(:first-child) {
        margin-top: 16rpx;
      }
      @include flex-start;
      align-items: flex-start;
      .leftText {
        font-size: 28rpx;
        color: #a0a0a0;
        line-height: 44rpx;
        flex: none;
      }
      .right {
        font-size: 28rpx;
        color: #333333;
        line-height: 44rpx;
      }
    }
  }
}
.detailPopupBottom {
  .actionBlock {
    @include flex-between;
    padding: 14rpx 38rpx;
    .actionBtn {
      &.plain {
        color: #ff6829;
        background: #fff;
        border: 4rpx solid #ff6829;
      }
      @include btn-normal;
      width: 320rpx;
    }
  }
}

.modalContainer {
  .modalBlock {
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
}
</style>
