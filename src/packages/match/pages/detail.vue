<template>
  <view class="page">
    <nav-bar
      ref="navBar"
      title="赛事详情"
      showBackIcon="black"
      titleColor="color:#2F2E3B;"
      backgroundColor="rgba(255,255,255,1)"
      :navCenterStyle="'flex-end'"
    ></nav-bar>
    <view class="pageContainer" :style="popup1 ? 'padding-bottom:' + popup1.topSlotHeight : ''">
      <view class="infoBlock">
        <detail-header :title="matchInfo.gameName" :labelList="labelList"></detail-header>
        <!-- <view class="reportInfoBlock">
          <report-info :total="matchInfo.completePersonCount"></report-info>
        </view> -->
      </view>
      <view class="infoBlock">
        <view class="title">基本信息</view>
        <!-- <view class="infoItem">
          <view class="leftText">赛事举办方：</view>
          <view class="right"
            >{{ matchInfo.stadiumName || '得乐体育' }}</view
          >
        </view> -->
        <!-- <view class="infoItem">
          <view class="leftText">比赛时间：</view>
          <view class="right"
            >{{ matchInfo.startTime }} - {{ matchInfo.endTime }}</view
          >
        </view> -->
        <!-- <view class="infoItem">
          <view class="leftText">活动场馆：</view>
          <view class="right">{{ matchInfo.stadiumName || '暂无' }}</view>
        </view> -->
        <!-- <view class="infoItem">
          <view class="leftText">活动地点：</view>
          <view class="right">{{ matchInfo.areaDetail || '暂无' }}</view>
        </view> -->
        <view class="infoItem">
          <view class="leftText">比赛形式：</view>
          <view class="right">{{ matchInfo.gameTypeValue || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">适用年龄：</view>
          <view class="right">{{ matchInfo.applicableAgeValue || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">适用性别：</view>
          <view class="right">{{ matchInfo.applicableSexValue || '男女均可' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">报名费用：</view>
          <view class="right">{{ '¥' + matchInfo.entryFee || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">最低等级：</view>
          <view class="right">{{ matchInfo.levelStartValue || '-' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">最高等级：</view>
          <view class="right">{{ matchInfo.levelEndValue || '-' }}</view>
        </view>
      </view>
      <view class="infoBlock">
        <view class="title">比赛说明</view>
        <view class="text">{{matchInfo.gameIntroduction}}</view>
        <mp-html v-model:content="matchInfo.graphicDetails"></mp-html>
      </view>
      <view class="infoBlock list">
        <view class="title">热门场馆</view>
        <view @click="goStadiumDetail(item)" v-for="item in stadiumList" :key="item.id">
          <stadium-card :info="item"></stadium-card>
        </view>
      </view>
    </view>
    <view class="detailPopupBottom" v-if="matchInfo.entryFee">
      <PopupBottom ref="popup1">
        <template v-slot:outer-main>
          <view class="actionBlock">
            <view class="actionBtn plain" :class="{'w100': !matchInfo.isOrder}" @click="showWechatModal">立即咨询</view>
            <!-- <view class="actionBtn" v-if="matchInfo.isOrder" @click="goOrderConfirm">¥{{ matchInfo.entryFee }} 报名</view> -->
            <view class="actionBtn" v-if="matchInfo.isOrder">¥{{ matchInfo.entryFee }} 报名</view>
          </view>
        </template>
      </PopupBottom>
    </view>
    <view class="modalContainer">
      <Modal v-model:show="wechatModalShow" title="比赛咨询">
        <view class="modalBlock">
          <image class="wechatImg" show-menu-by-longpress :src="wechatCardUrl" />
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
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import DetailHeader from '@/components/detail/header';
import ReportInfo from '@/components/detail/report-info';
import MpHtml from '@/components/mp-html/mp-html.vue';
import PopupBottom from '@/components/popup-bottom';
import Modal from '@/components/modal';
import StadiumCard from '@/components/list-card/stadium-card';
import { useAppInstance, useNav } from '@/hooks';
import api from '@/api';
import Constant from '@/lib/constant';
import uniAsync from '@/lib/uni-async';
const { $onLaunched } = useAppInstance();
const { to } = useNav();

const matchId = ref(null);
const publishId = ref(null);
const popup1 = ref(null);
const wechatCardUrl = ref('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/matchShareQR.png');

const copyWechatNumber = () => {
  uni.setClipboardData({
    data: '13910283357', // 暂时写死
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'none' });
    }
  });
};

const saveQrCode = async () => {
  const url = wechatCardUrl.value; // 暂时写死
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

const matchInfo = ref({});
const labelList = computed(() => {
  const resLabel = [];
  if (matchInfo.value.gameTypeValue) {
    resLabel.push({
      label: matchInfo.value.gameTypeValue,
      style: 'color: #FF5A5A;line-height: 28rpx;background: #FFEEEE;border:none;'
    });
  }
  if (matchInfo.value.applicableAgeValue) {
    resLabel.push({
      label: matchInfo.value.applicableAgeValue
    });
  }
  if (matchInfo.value.stadiumName) {
    resLabel.push({
      label: matchInfo.value.stadiumName
    });
  }
  return resLabel;
});

const initDetail = async (refresh = false) => {
  uni.showLoading();
  try {
    const res = await api.match.getMatchDetail(matchId.value);
    console.log('getActivityDetail res', res);
    res.gameIntroduction = res.gameIntroduction || '暂无比赛说明';
    matchInfo.value = res;
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

const goStadiumDetail = (item) => {
  to('/stadium/detail', { id: item.id });
};

const goOrderConfirm = () => {
  to('/mine/create-order', {
    type: Constant.ACTIVITY_TYPE_2PAYTYPE[7],
    price: matchInfo.value.entryFee,
    activityId: matchInfo.value.activityId,
    publishId: matchId.value,
    info: JSON.stringify({
      img: matchInfo.value.gameImageUrl,
      name: matchInfo.value.gameName,
      area: matchInfo.value.stadiumAreaDetail,
      time: `${matchInfo.value.startTime}-${matchInfo.value.endTime}`
    })
  });
};

const stadiumList = ref([]);
const getHotStadiumList = () => {
  api.homePage.getHotStadiumList().then((res) => {
    stadiumList.value = res || [];
  });
};

onShareAppMessage(() => {
  return {
    title: `${matchInfo.value.gameName}比赛真不错，快来参与围观吧！`,
    imageUrl: matchInfo.value.gameImageUrl || 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/match.png',
    path: `/packages/match/pages/detail?id=${matchId.value}&pubId=${publishId.value}`
  };
});

onLoad(async (options) => {
  console.log('match detail onload', options);
  const { id, pubId } = options;
  matchId.value = id;
  publishId.value = pubId;
  await $onLaunched;
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
    .text {
      font-size: 28rpx;
      color: #333333;
      line-height: 44rpx;
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
      backdrop-filter: blur(2rpx);
      font-size: 32rpx;
      font-weight: 700;
      color: #ff6829;
      line-height: 48rpx;
      padding: 20rpx 36rpx;
    }
    .copyBtn {
      background: linear-gradient(135deg, #ffab43 0%, #ff6829 100%);
      border-radius: 44rpx;
      font-size: 32rpx;
      font-weight: 700;
      color: #ffffff;
      line-height: 48rpx;
      padding: 20rpx 36rpx;
    }
  }
}
</style>
