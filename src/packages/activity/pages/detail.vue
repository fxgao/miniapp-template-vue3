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
        <view
          class="reportInfoBlock"
          v-if="activityInfo.participantVo && activityInfo.participantVo.participanCount > 0"
        >
          <report-info
            :total="activityInfo.participantVo.participanCountMax"
            :infoList="activityInfo.participantVo.participantUserVo"
          ></report-info>
        </view>
      </view>
      <view class="infoBlock">
        <view class="title">基本信息</view>
        <view class="infoItem">
          <view class="leftText">活动时间：</view>
          <view class="right">{{ activityInfo.activeStartTime }} - {{ activityInfo.endTime }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">截止报名：</view>
          <view class="right">{{ activityInfo.lastSignUpTimeStr }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">活动场馆：</view>
          <view class="right">{{ activityInfo.stadiumName || '暂无' }}</view>
        </view>
        <!-- <view class="infoItem">
          <view class="leftText">场馆地址：</view>
          <view class="right">{{ activityInfo.areaDetail || '暂无' }}</view>
        </view> -->
        <view class="infoItem">
          <view class="leftText">活动场地：</view>
          <view class="right">{{ activityInfo.placeName || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">活动等级：</view>
          <!-- <view class="right">{{ Constant.LEVEL_GRADE_2STRING_MAP[activityInfo.levelStart] || '暂无' }} - {{ Constant.LEVEL_GRADE_2STRING_MAP[activityInfo.levelEnd] || '暂无' }}</view> -->
          <view class="right">{{ activityInfo.levelValue || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">活动费用：</view>
          <view class="right">{{
            activityInfo.activityPrice ? '¥' + activityInfo.activityPrice : '暂无'
          }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">最小成局人数：</view>
          <view class="right">{{ activityInfo.completePersonCount + '人' || '暂无' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">有无停车场：</view>
          <view class="right">{{ activityInfo.isParkValue || '无' }}</view>
        </view>
        <!-- <view class="infoItem">
          <view class="leftText">活动介绍：</view>
          <view class="right">{{ activityInfo.activeRemark || '无' }}</view>
        </view> -->
      </view>
      <view class="infoBlock">
        <view class="title">活动说明</view>
        <!-- <mp-html v-model:content="activityInfo.activeRule"></mp-html> -->
        <mp-html v-model:content="activityInfo.activeRemark"></mp-html>
        <!-- <template v-if="activityInfo.activeRule">
          <mp-html v-model:content="activityInfo.activeRule"></mp-html>
        </template> -->
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
            <!-- C端活动详情不可报名情况下活动状态判断逻辑及展示优先级：
                  已开始：用户进入详情时间晚于活动开始时间，如活动开始时间为1月18日10点-11点，若用户进入活动详情页时间在1月18日10点（含）-11点（含）之间，则活动支付按钮置灰，且文案展示【已开始】
                  已结束：用户进入详情时间晚于活动结束时间，如活动开始时间为1月18日10点-11点，若用户进入活动详情页时间在1月18日11点（不含）之后，则活动支付按钮置灰，且文案展示【已结束】
                  人数已满：若用户进入详情页后，活动已报名人数已达到活动最大人数，则活动支付按钮置灰，且文案展示【人数已满】
                  未成局：若用户进入详情页后，活动已报名人数未达到活动成局人数，则活动支付按钮可用，文案展示【金额+报名】
                  已取消：若在后台取消了该活动，则用户进入详情页后，则活动支付按钮置灰，且文案展示【已取消】——目前BC端交互逻辑是B端取消后，该活动就不再在C端活动列表展示，对于新用户而言无感知。

                  不可报名的状态展示优先级：当活动命中了多个不可报名状态时，在C端展示文案优先级为：人数已满＞已结束＞已开始＞未成局＞已取消 -->
            <view
              class="actionBtn"
              :class="{ disable: activityInfo.isApply === 2 }"
              @click="goOrderConfirm"
              v-if="activityInfo.isOrder === 0"
            >
              <template v-if="activityInfo.isApply === 2"> 已报名 </template>
              <template v-else> ¥{{ activityInfo.activityPrice }} 报名 </template>
            </view>
            <view class="actionBtn disable" v-else-if="activityInfo.isOrder === 1">已开始</view>
            <view class="actionBtn disable" v-else-if="activityInfo.isOrder === 2">已结束</view>
            <view class="actionBtn disable" v-else-if="activityInfo.isOrder === 3">人数已满</view>
            <view class="actionBtn disable" v-else-if="activityInfo.isOrder === 4">已取消</view>
            <view class="actionBtn disable" v-else>¥{{ activityInfo.activityPrice }} 报名</view>
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
import { onLoad, onShow, onShareAppMessage } from '@dcloudio/uni-app';
import DetailHeader from '@/components/detail/header';
import ReportInfo from '@/components/detail/report-info';
import MpHtml from '@/components/mp-html/mp-html.vue';
import PopupBottom from '@/components/popup-bottom';
import Modal from '@/components/modal';
import StadiumCard from '@/components/list-card/stadium-card';
import { useAppInstance, useNav } from '@/hooks';
import { randomString } from '@/utils';
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
  if (activityInfo.value.isOrder !== 0) return;
  if (activityInfo.value.isApply === 2) return;

  if (isFromMine.value) {
    uni.showToast({ title: '您已报名该活动', icon: 'none' });
    return;
  }
  const activityRuleStorageKey = randomString(10, true);
  uni.setStorageSync(
    'confirmInfo_activityRule_' + activityRuleStorageKey,
    activityInfo.value.activeRule || ''
  );
  to('/mine/create-order', {
    type: Constant.ACTIVITY_TYPE_2PAYTYPE[activityInfo.value.activeType],
    price: activityInfo.value.activityPrice,
    activityId: activityId.value,
    publishId: publishId.value,
    activityRuleStorageKey,
    info: JSON.stringify({
      img: activityInfo.value.activeHeadFigure,
      stadiumName: activityInfo.value.stadiumName,
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

onShareAppMessage(() => {
  return {
    title: `${activityInfo.value.stadiumName}:${activityInfo.value.activeName}`,
    imageUrl:
      activityInfo.value.activeHeadFigure ||
      'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/main.png',
    path: `/packages/activity/pages/detail?actId=${activityId.value}&pubId=${publishId.value}`
  };
});
onShow(async () => {
  await $onLaunched;
  initDetail();
});

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
      background: linear-gradient(180deg, #ffffff 0, #f5f5f5 240rpx, #f5f5f5 100%);
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
      &.disable {
        color: #fff;
        background: #c0c0c0;
        border: 4rpx solid #c0c0c0;
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
