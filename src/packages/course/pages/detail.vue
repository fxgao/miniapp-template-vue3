<template>
  <view class="page">
    <nav-bar
      ref="navBar"
      title="课程详情"
      showBackIcon="black"
      titleColor="color:#2F2E3B;"
      backgroundColor="rgba(255,255,255,1)"
      :navCenterStyle="'flex-end'"
    ></nav-bar>
    <view class="pageContainer" :style="popup1 ? 'padding-bottom:' + popup1.topSlotHeight : ''">
      <view class="infoBlock">
        <detail-header :title="courseInfo.courseName" :labelList="labelList"></detail-header>
      </view>
      <view class="infoBlock">
        <view class="title">基本信息</view>
        <view class="infoItem">
          <view class="leftText">课程类型：</view>
          <view class="right">{{ courseInfo.courseTypeValue }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">适用人群：</view>
          <view class="right">{{ courseInfo.applicablePeopleValue }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">适用等级：</view>
          <view class="right">{{ courseInfo.applicableLevelValue }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">测评等级：</view>
          <view class="right">{{ courseInfo.assessmentLevelValue }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">课程班型：</view>
          <view class="right">{{ courseInfo.classTypeValue }}</view>
        </view>
        <view class="infoItem" v-if="courseInfo.classType === 2 && courseInfo.multiPersonCourseTypeValue">
          <view class="leftText">多人课程类型：</view>
          <view class="right">{{ courseInfo.multiPersonCourseTypeValue }}</view>
        </view>
        <view class="infoItem" v-if="courseInfo.classType === 2 && courseInfo.largestNumber">
          <view class="leftText">最大报名人数：</view>
          <view class="right">{{ courseInfo.largestNumber }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">报名费用：</view>
          <view class="right">¥{{ courseInfo.courseFee || '0' }}</view>
        </view>
        <!-- <view class="infoItem">
          <view class="leftText">课程校区：</view>
          <view class="right">{{ courseInfo.courseFee || '0' }}</view>
        </view>
        <view class="infoItem">
          <view class="leftText">课程地址：</view>
          <view class="right">{{ courseInfo.place || '暂无' }}</view>
        </view> -->
      </view>
      <view class="infoBlock">
        <view class="title">课程安排</view>
        <mp-html v-model:content="courseInfo.supplementaryInformation"></mp-html>
      </view>
      <view class="infoBlock list">
        <view class="title">热门场馆</view>
        <view @click="goStadiumDetail(item)" v-for="item in stadiumList" :key="item.id">
          <stadium-card :info="item"></stadium-card>
        </view>
      </view>
    </view>
    <view class="detailPopupBottom" v-if="courseInfo.courseFee">
      <PopupBottom ref="popup1">
        <template v-slot:outer-main>
          <view class="actionBlock">
            <view class="actionBtn plain" :class="{'w100': !courseInfo.isOrder}" @click="showWechatModal">立即咨询</view>
            <!-- <view class="actionBtn" v-if="courseInfo.isOrder" @click="goOrderConfirm">¥{{ courseInfo.courseFee }} 报名</view> -->
            <view class="actionBtn" v-if="courseInfo.isOrder">¥{{ courseInfo.courseFee }} 报名</view>
          </view>
        </template>
      </PopupBottom>
    </view>
    <view class="modalContainer">
      <Modal v-model:show="wechatModalShow" title="课程咨询">
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
import { onLoad, onShow, onShareAppMessage } from '@dcloudio/uni-app';
import DetailHeader from '@/components/detail/header';
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

const courseId = ref(null);
const publishId = ref(null);
const fromWhere = ref(''); // 从哪个页面跳转过来的
const popup1 = ref(null);
const wechatCardUrl = ref('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/courseShareQR.png');

const copyWechatNumber = () => {
  uni.setClipboardData({
    data: '13910283017', // 暂时写死
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

const courseInfo = ref({});
const labelList = computed(() => {
  const resLabel = [];
  if (courseInfo.value.applicablePeopleValue) {
    resLabel.push({
      label: courseInfo.value.applicablePeopleValue
    });
  }
  if (courseInfo.value.applicableLevelValue) {
    resLabel.push({
      label: courseInfo.value.applicableLevelValue
    });
  }
  if (courseInfo.value.classTypeValue) {
    resLabel.push({
      label: courseInfo.value.classTypeValue
    });
  }
  return resLabel;
});

const initDetail = async (refresh = false) => {
  uni.showLoading();
  try {
    let res = null;
    if (fromWhere.value === 'schedule') {
      res = await api.course.getCourseDetail(courseId.value);
    } else {
      res = await api.course.getTempleteCourseDetail(courseId.value);
    }
    console.log('getCourseDetail res', res);
    courseInfo.value = res;
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

const goOrderConfirm = () => {
  const typeString = courseInfo.value.courseType === 1 ? 5 : 6;
  to('/mine/create-order', {
    type: Constant.ACTIVITY_TYPE_2PAYTYPE[typeString],
    price: courseInfo.value.courseFee,
    activityId: courseInfo.value.activityId,
    publishId: publishId.value,
    info: JSON.stringify({
      img: courseInfo.value.courseHeadFigure,
      name: courseInfo.value.courseName,
      area: courseInfo.value.stadiumAreaDetail,
      time: `${courseInfo.value.startTime}-${courseInfo.value.endTime}`
    })
  });
};

const goStadiumDetail = (item) => {
  to('/stadium/detail', {
    id: item.id
  });
};

onShareAppMessage(() => {
  return {
    title: `${courseInfo.value.courseName}课程真不错，快来参与围观吧！`,
    imageUrl: courseInfo.value.courseHeadFigure || 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/course.png',
    path: `/packages/coures/pages/detail?id=${courseId.value}&pubId=${publishId.value}`
  };
});

onShow(async () => {
  await $onLaunched;
  initDetail();
});

onLoad(async (options) => {
  console.log('course detail onload', options);
  const { id, pubId, from = 'list' } = options;
  courseId.value = id;
  publishId.value = pubId;
  fromWhere.value = from;
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
      background: linear-gradient(180deg, #ffffff 0, #f5f5f5 120rpx, #f5f5f5 100%);
    }
    background: #fff;
    padding: 32rpx 40rpx;
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
