<template>
  <view class="page">
    <nav-bar
      ref="navBar"
      title="报名"
      showBackIcon="black"
      titleColor="color:#2F2E3B;"
      backgroundColor="rgba(255,255,255,1)"
      :navCenterStyle="'flex-end'"
    ></nav-bar>
    <view class="pageContainer" :style="popup1 ? 'padding-bottom:' + popup1.topSlotHeight : ''">
      <!-- 用户信息 -->
      <view class="userInfoBlock" @click="goEditProfile">
        <view class="title">报名信息</view>
        <view class="content">
          <image
            class="userAvatar"
            :src="
              loginInfoData?.photo
                ? loginInfoData.photo
                : 'https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/icon/default-avatar.png'
            "
            mode="aspectFit"
          />
          <view class="userInfo">
            <view class="infoRow">
              <view class="userName" hover-class="none" hover-stop-propagation="false">
                {{
                  loginInfoData?.nickname && loginInfoData?.openId
                    ? loginInfoData.nickname +
                      (loginInfoData?.age ? `(${loginInfoData?.age}岁)` : '')
                    : '请登录'
                }}
              </view>
              <image
                v-if="loginInfoData?.sex"
                class="sex"
                :src="
                  loginInfoData?.sex === '男'
                    ? 'https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/icon/sex-male.png'
                    : 'https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/icon/sex-female.png'
                "
              />
              <view class="level"> 0基础1级 </view>
            </view>
            <view class="infoRow" v-if="loginInfoData?.openId">
              <view class="phone" v-if="loginInfoData?.tel">
                {{ loginInfoData.tel }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="orderInfoBlock">
        <view class="title">订单信息</view>
        <view class="orderBlock">
          <view class="orderInfo">
            <image src="" class="infoImg" />
            <view class="infoRight">
              <view class="infoTitle"></view>
              <view class="infoSub"></view>
              <view class="infoSub"></view>
            </view>
          </view>
          <view class="priceInfo">
            <view class="priceExplain"></view>
            <view class="price">
              <span></span>
            </view>
          </view>
        </view>
      </view>
      <!-- 订单备注 -->
      <view class="orderRemarkBlock">
        <view class="title">订单备注</view>
        <view class="content">
          <textarea
            class="textArea"
            :value="demand"
            @blur="demandChange"
            @input="demandChange"
            :maxlength="300"
            placeholder="选填，请输入需备注内容，如：指定教练性别"
            placeholder-style="color: #C0C0C0;font-size: 14px;"
          />
        </view>
      </view>
      <!-- 购买须知 -->
      <view class="buyNoticeBlock">
        <view class="title">购买须知</view>
        <view class="content">
          <view class="row">
            1、根据北京防疫规定，参与者需提供72小时内核酸证明和健康宝绿码，如因自身原因无法提供不能参与活动，概不退款
          </view>
          <view class="row">
            2、一旦支付，活动开始24小时前可全额退款（根据总金额，微信支付平台将扣除一定手续费），超过24小时不可退款
          </view>
        </view>
      </view>
      <!-- 协议 -->
      <view class="rule">
        请您在支付前仔细阅读
        <span class="ruleText" @click="goPayRule"> 《用户支付协议》 </span> ， 付款即代表您同意此协议。
      </view>
    </view>
    <view class="detailPopupBottom">
      <PopupBottom ref="popup1">
        <template v-slot:outer-main>
          <view class="popupContainer">
            <view class="info">
              金额（元）： <span class="priceText">{{ confirmInfo.price }}</span>
            </view>
            <view class="payBtn" @click="pay">去付款</view>
          </view>
        </template>
      </PopupBottom>
    </view>
    <view class="modalContainer">
      <Modal v-model:show="successModalShow">
        <view class="modalBlock">
          <image class="successImg" src="" />
          <view class="text">订单支付成功</view>
        </view>
        <template v-slot:bottom>
          <view class="saveBtn" @click="share">分享给好友/群聊</view>
          <view class="copyBtn" @click="goOrderDetail">查看订单详情</view>
        </template>
      </Modal>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useSystemInfoStore } from '@/stores/systemInfo';
import { useLoginInfoStore } from '@/stores/loginInfo';
import { useAppInstance } from '@/hooks';
import api from '@/api';
import PopupBottom from '@/components/popup-bottom';
import Modal from '@/components/modal';
import MpHtml from '@/components/mp-html/mp-html.vue';

const systemInfo = useSystemInfoStore();
const loginInfoStore = useLoginInfoStore();
const { loginInfoData } = storeToRefs(loginInfoStore);
const { $onLaunched } = useAppInstance();

const popup1 = ref(null);
const successModalShow = ref(false);
const confirmInfo = ref({});

onLoad(async (options) => {
  const { confirmInfo } = options;
  await $onLaunched;
  console.log(confirmInfo);
  confirmInfo.value = confirmInfo
    ? JSON.parse(confirmInfo)
    : {
        price: 100,
        num: 1
      };
});
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100vh;
}
.pageContainer {
  background: #f5f5f5;
  overflow: hidden;
  .userInfoBlock {
    .content {
      @include flex-start;
      margin-top: 32rpx;
      .userAvatar {
        width: 92rpx;
        height: 92rpx;
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
          background: url('https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png');
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
            font-size: 28rpx;
            font-weight: 500;
            color: #333333;
            line-height: 44rpx;
          }
          .sex {
            width: 32rpx;
            height: 32rpx;
            margin-left: 16rpx;
          }
          .age,
          .phone {
            font-size: 24rpx;
            color: #a0a0a0;
            line-height: 40rpx;
          }
          .level {
            font-size: 24rpx;
            color: #ffffff;
            line-height: 24rpx;
            background: linear-gradient(135deg, #ade767 0%, #4cac00 100%);
            border-radius: 4rpx;
            padding: 4rpx 8rpx;
            margin-left: 16rpx;
          }
        }
      }
    }
  }
  .userInfoBlock, .orderInfoBlock, .orderRemarkBlock, .buyNoticeBlock {
    margin-top: 16rpx;
    padding: 32rpx 40rpx;
    background: #fff;
    .title {
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 52rpx;
    }
    .content {
      margin-top: 32rpx;
      .row {
        &:not(:first-child) {
          margin-top: 16rpx;
        }
        font-size: 28rpx;
        color: #A0A0A0;
        line-height: 44rpx;
      }
      .textArea {
        font-size: 28rpx;
        line-height: 44rpx;
        height: 150rpx;
      }
    }
  }
  .rule {
    margin: 32rpx 40rpx;
    font-size: 24rpx;
    color: #A0A0A0;
    line-height: 40rpx;
    .ruleText {
      color: #ff6829;
    }
  }
  .infoBlock {
    &:not(:first-child) {
      margin-top: 16rpx;
    }
    &.list {
      background: linear-gradient(180deg, #ffffff 0, #f5f5f5 80rpx, #f5f5f5 100%);
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
  .popupContainer {
    @include flex-between;
    padding: 16rpx 40rpx;
    border-top: 2rpx solid #EEEEEE;
  }
  .info {
    font-size: 28rpx;
    color: #333333;
    line-height: 44rpx;
    .priceText {
      font-size: 40rpx;
      font-weight: 600;
      color: #FF6829;
      line-height: 56rpx;
    }
  }
  .payBtn {
    font-size: 32rpx;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 48rpx;
    padding: 20rpx 48rpx;
    background: linear-gradient(135deg, #FFAB43 0%, #FF6829 100%);
    border-radius: 44rpx;
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
