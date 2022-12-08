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
          <report-info :total="activityInfo.participantVo.participanCountMax" :infoList="activityInfo.participantVo.participantUserVo" ></report-info>
        </view>
      </view>
      <view class="infoBlock">
        <view class="title">基本信息</view>
        <view class="infoItem">
          <view class="leftText">活动时间：</view>
          <view class="right"
            >{{ activityInfo.activeStartTime }} - {{ activityInfo.endTime }}</view
          >
        </view>
        <view class="infoItem">
          <view class="leftText">截止报名：</view>
          <view class="right"
            >{{ activityInfo.lastSignUpTimeStr }}</view
          >
        </view>
        <view class="infoItem">
          <view class="leftText">活动地点：</view>
          <view class="right">{{ activityInfo.areaDetail || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">活动等级：</view>
          <view class="right">{{ Constant.LEVEL_GRADE_2STRING_MAP[activityInfo.levelStart] || '暂无' }} - {{ Constant.LEVEL_GRADE_2STRING_MAP[activityInfo.levelEnd] || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">活动费用：</view>
          <view class="right">{{ activityInfo.activityPrice ? '¥' + activityInfo.activityPrice : '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">有无停车场：</view>
          <view class="right">{{ activityInfo.isParkValue || '无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">活动介绍：</view>
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
            <view class="actionBtn plain" :class="{'w100': !activityInfo.isOrder}" @click="showWechatModal">立即咨询</view>
            <view class="actionBtn" v-if="activityInfo.isOrder" @click="goOrderConfirm">¥{{ activityInfo.activityPrice }} 报名</view>
          </view>
        </template>
      </PopupBottom>
    </view>
    <view class="modalContainer">
      <Modal v-model:show="wechatModalShow" title="活动咨询">
        <view class="modalBlock">
          <image class="wechatImg" show-menu-by-longpress :src="activityInfo.wechatCardUrl" />
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
import { useAppInstance, useNav } from '@/hooks';
import api from '@/api';
import uniAsync from '@/lib/uni-async';
import Constant from '@/lib/constant';
const { $onLaunched } = useAppInstance();
const { to } = useNav();

const activityId = ref(null);
const publishId = ref(null);
const popup1 = ref(null);
const isFromMine = ref(false);

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
    const res = await api.activity.getActivityDetail(publishId.value);
    console.log('getActivityDetail res', res);
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

const goOrderConfirm = () => {
  if (isFromMine.value) {
    uni.showToast({ title: '您已报名该活动', icon: 'none' });
    return;
  }
  to('/mine/create-order', {
    type: Constant.ACTIVITY_TYPE_2PAYTYPE[activityInfo.value.activeType],
    price: activityInfo.value.activityPrice,
    activityId: activityId.value,
    publishId: publishId.value,
    info: JSON.stringify({
      img: activityInfo.value.activeHeadFigure,
      name: activityInfo.value.activeName,
      area: activityInfo.value.areaDetail || '得乐场馆',
      time: `${activityInfo.value.activeStartTime}-${activityInfo.value.endTime}`,
      levelStart: activityInfo.value.levelStart,
      levelEnd: activityInfo.value.levelEnd
    })
  });
};

const saveQrCode = async () => {
  const url = activityInfo.value.wechatCardUrl;
  const save = (path) => {
    uni.saveImageToPhotosAlbum({
      filePath: path,
      success() {
        uni.showToast({ title: '已保存到系统相册', icon: 'none' });
      },
      fail(e) {
        console.log('saveImageToPhotosAlbum fail', e);
        uni.showToast({ title: '下载失败', icon: 'none' });
      }
    });
  };

  try {
    const auth = await uniAsync.authorize({
      scope: 'scope.writePhotosAlbum'
    });
    if (auth.errMsg === 'authorize:ok') {
      if (url.startsWith('http')) {
        uni.downloadFile({
          url,
          success: (res) => save(res.tempFilePath)
        });
      } else {
        save(url);
      }
    } else {
      uni.showModal({
        title: '无法保存',
        content:
          '1.请在“设置-隐私-照片”选项中，允许微信访问你的照片 2.请点击小程序右上角"...",在“设置”中打开“添加到相册”功能',
        showCancel: false
      });
    }
  } catch (error) {
    console.log('authorize error', error);
    uni.showModal({
      title: '无法保存',
      content:
        '1.请在“设置-隐私-照片”选项中，允许微信访问你的照片 2.请点击小程序右上角"...",在“设置”中打开“添加到相册”功能',
      showCancel: false
    });
  }
};

const copyWechatNumber = () => {
  uni.setClipboardData({
    data: activityInfo.value.wechatCode,
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'none' });
    }
  });
};

const goStadiumDetail = (item) => {
  to('/stadium/detail', { id: item.id });
};

const stadiumList = ref([]);
const getHotStadiumList = () => {
  api.homePage.getHotStadiumList().then((res) => {
    stadiumList.value = res || [];
  });
};

onLoad(async (options) => {
  const { actId, pubId, fromMine = false } = options;
  activityId.value = actId;
  publishId.value = pubId;
  isFromMine.value = fromMine;
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
      background: linear-gradient(180deg, #FFFFFF 0, #F5F5F5 120rpx, #F5F5F5 100%);
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
      &.w100 {
        width: 100%;
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
