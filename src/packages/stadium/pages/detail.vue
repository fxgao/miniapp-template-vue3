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
        <scroll-view v-if="detailImgList.length > 0" class="imgBlock" :scroll-x="true">
          <view
            class="imgItem"
            v-for="(item, index) in detailImgList"
            :key="index"
            @click="showLargeImg(index)"
          >
            <image class="bgImg" :src="item[0].imageUrl" mode="aspectFit" />
            <view class="text">{{item.title}}({{ item.length }}张)</view>
          </view>
        </scroll-view>
        <view class="bottomInfo">
          <view class="leftLocation">
            <view class="location">{{ stadiumInfo.areaDetail }}</view>
            <view class="chargeInfo">
              <image class="avatar" :src="stadiumInfo?.managerVo?.photo" mode="aspectFill" />
              <view class="name">{{ stadiumInfo?.managerVo?.nickName }}</view>
              <view class="tag">场馆负责人</view>
            </view>
          </view>
          <view class="rightIcon">
            <view class="iconItem" @click="showMap">
              <image class="icon" src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/navigation-icon.png" />
            </view>
            <view class="iconItem" @click="showWechatModal">
              <image class="icon" src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/wechat-icon.png" />
            </view>
            <view class="iconItem" @click="copyPhone">
              <image class="icon" src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/phone-icon.png" />
            </view>
          </view>
        </view>
      </view>
      <!-- 活动信息 -->
      <view class="stadiumActivityContainer" v-if="stadiumId">
        <view class="header">
          <view class="title" hover-class="none" hover-stop-propagation="false">全部活动</view>
          <view class="moreText" @click="handleGoMore">
            预约活动
            <image
              class="icon"
              src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png"
            />
          </view>
        </view>
        <!-- 列表 -->
        <view class="listContainer">
          <List
            v-if="loadEnd"
            v-model:dataList="activityList"
            url="/wx/publish/activityList"
            listType="column"
            ref="activityListRef"
            :params="filterParams"
          >
            <template v-slot="{ data }">
              <view @click="goActivityDetail(data)">
                <activity-card :info="data"></activity-card>
              </view>
            </template>
            <template v-slot:loading>
              <view class="listBottomText"> 加载中... </view>
            </template>
            <template v-slot:noMore>
              <view class="listBottomText"> 没有更多了! </view>
            </template>
          </List>
        </view>
      </view>
      <!-- 教练团队信息 -->
      <view class="coachInfoContainer" v-if="coachList.length > 0">
        <view class="title">教练团队</view>
        <view class="coachList">
          <view
            class="componentItem"
            @click="goCoachDetail(item)"
            v-for="item in coachList"
            :key="item.id"
          >
            <coach-card
              :id="item.id"
              :name="item.nickName"
              :img="item.photo"
              :level="item.level"
              :content="item.remarks"
              :nationality="item.nationality"
              :size="'small'"
            ></coach-card>
          </view>
        </view>
      </view>
    </view>
    <Modal v-model:show="wechatModalShow" title="咨询客服">
      <view class="modalContainer">
        <image class="wechatImg" show-menu-by-longpress :src="stadiumInfo.wechatCardUrl" />
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
import { computed, reactive, ref } from 'vue';
import { onLoad, onShareAppMessage, onReachBottom } from '@dcloudio/uni-app';
import { useAppInstance, useNav } from '@/hooks';
import api from '@/api';
import uniAsync from '@/lib/uni-async';
import List from '@/components/list';
import Marquee from '@/components/marquee';
import CoachCard from '@/components/list-card/coach-card';
import ActivityCard from '@/components/list-card/activity-card';
import Modal from '@/components/modal';

const { $onLaunched } = useAppInstance();
const { to } = useNav();

const stadiumId = ref(null);
const stadiumInfo = ref({});

const detailImgList = computed(() => {
  const resList = [];
  if (stadiumInfo.value?.storeEnvironmentList && stadiumInfo.value?.storeEnvironmentList.length > 0) {
    const list = stadiumInfo.value.storeEnvironmentList;
    list.title = '门店环境';
    resList.push(list);
  }
  if (stadiumInfo.value?.infrastructureList && stadiumInfo.value?.infrastructureList.length > 0) {
    const list = stadiumInfo.value.infrastructureList;
    list.title = '基础设施';
    resList.push(stadiumInfo.value?.infrastructureList);
  }
  if (stadiumInfo.value?.stadiumImgList && stadiumInfo.value?.stadiumImgList.length > 0) {
    const list = stadiumInfo.value.stadiumImgList;
    list.title = '场馆环境';
    resList.push(stadiumInfo.value?.stadiumImgList);
  }
  if (stadiumInfo.value?.courseWillList && stadiumInfo.value?.courseWillList.length > 0) {
    const list = stadiumInfo.value.courseWillList;
    list.title = '课程实拍';
    resList.push(stadiumInfo.value?.courseWillList);
  }
  return resList;
});

const initStadiumInfo = async (id) => {
  const resInfo = await api.stadium.getStadiumDetailInfo(id);
  console.log('getStadiumDetailInfo res', resInfo);
  stadiumInfo.value = resInfo;
};

const coachList = ref([]);
const initCoachInfo = async (id) => {
  const res = await api.stadium.getStadiumCoachInfo(id);
  console.log('getStadiumCoachInfo res', res);
  coachList.value = res;
};

// 跳转教练详情
const goCoachDetail = (item) => {
  console.log('goCoachDetail', item);
  to('/coach/detail', {
    id: item.id
  });
};

// 打开地图
const showMap = () => {
  uni.openLocation({
    latitude: stadiumInfo.value.lat,
    longitude: stadiumInfo.value.lng,
    scale: 18
  });
};

const showLargeImg = (index) => {
  const urlsArr = detailImgList.value[index].map((item) => item.imageUrl);
  uni.previewImage({
    current: 0,
    urls: urlsArr
  });
};

const wechatModalShow = ref(false);
// 打开微信二维码弹窗
const showWechatModal = () => {
  wechatModalShow.value = true;
};

const copyPhone = () => {
  uni.makePhoneCall({
    phoneNumber: stadiumInfo.value.landlinePhone
  });
};

const saveQrCode = async () => {
  const url = stadiumInfo.value.wechatCardUrl;
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
    data: stadiumInfo.value.wechatCode,
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'none' });
    }
  });
};

const handleGoMore = () => {
  to('/stadium/schedule', {
    stadiumId: stadiumId.value
  });
};

// 活动列表
const activityList = ref([]);
const activityListRef = ref(null);
const loadEnd = ref(false);
const filterParams = reactive({});

const goActivityDetail = (item) => {
  console.log('goActivityDetail', item);
  to('/activity/detail', {
    actId: item.activityId,
    pubId: item.id
  });
};

onReachBottom(() => {
  activityListRef.value.requestList();
});

onShareAppMessage(() => {
  return {
    title: `我在${stadiumInfo.value.stadiumName}等你一起来打球！`,
    imageUrl: stadiumInfo.value.stadiumHeadFigure || 'https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/share/stadium.png',
    path: `/packages/stadium/pages/detail?id=${stadiumId.value}`
  };
});

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
  filterParams.stadiumId = options.id || '';
  loadEnd.value = true;
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
      font-weight: 700;
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
        background: #f8f8f8;
        font-size: 22rpx;
        color: #a0a0a0;
        line-height: 24rpx;
        padding: 4rpx 8rpx;
      }
    }
    .imgBlock {
      margin-top: 32rpx;
      padding-left: 40rpx;
      width: 100%;
      white-space: nowrap;
      @include flex-start;
      .imgItem {
        &:last-child {
          margin-right: 32rpx;
        }
        position: relative;
        border-radius: 16rpx;
        margin-right: 16rpx;
        display: inline-block;
        overflow: hidden;
        .bgImg {
          width: 272rpx;
          height: 204rpx;
          border-radius: 16rpx;
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
            line-height: 36rpx;
            padding: 2rpx 8rpx;
            margin-left: 16rpx;
          }
        }
      }
      .rightIcon {
        @include flex-start;
        .iconItem {
          @include flex-center;
          margin-left: 32rpx;
          .icon {
            width: 48rpx;
            height: 48rpx;
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
    .listContainer {
      padding: 0 40rpx 40rpx;
      background: linear-gradient(180deg, #ffffff 0, #f5f5f5 120rpx, #f5f5f5 100%);
    }
    .listBottomText {
      font-size: 28rpx;
      color: #A0A0A0;
      line-height: 28rpx;
      text-align: center;
      padding: 20rpx 0;
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
      .componentItem {
        width: auto;
        display: inline-block;
        margin-bottom: 32rpx;
      }
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
</style>
