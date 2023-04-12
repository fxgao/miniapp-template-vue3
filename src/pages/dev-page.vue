<template>
  <view class="page">
    <nav-bar
      ref="navBar"
      title="调试"
      :isTransparent="false"
      showBackIcon="black"
      titleColor="color:#2F2E3B"
      backgroundColor="#fff"
    ></nav-bar>
    <view class="pageContainer">
      <view class="tools">
        <view class="item">
          <picker @change="changeEnv" :range="itemList">
            <view class="title">环境</view>
            <view class="sub-title">当前环境：{{ currentEnv }}</view>
          </picker>
        </view>
        <view class="item">
          <picker @change="setStorage" :range="storageKeys">
            <view class="title">Storage</view>
            <view class="sub-title">读写本地缓存</view>
          </picker>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import apiConfig from '@/api/config';
export default {
  data() {
    return {
      currentEnv: apiConfig.ENV_ALIAS,
      storageKeys: [],
      itemList: [
        'production',
        'development'
      ]
    };
  },
  onLoad() {
    const { keys } = uni.getStorageInfoSync();
    this.storageKeys = keys;
  },
  methods: {
    changeEnv(e) {
      const key = this.itemList[e.detail.value * 1];
      const debugEnv = key;
      uni.clearStorageSync();
      uni.setStorageSync('debugEnv', debugEnv);
      uni.showToast({ icon: 'none', title: '切换成功 请点击右上角更多 重新进入小程序' });
    },
    setStorage(e) {
      const key = this.storageKeys[e.detail.value * 1];
      const content = uni.getStorageSync(key);
      const valueType = typeof content;
      uni.showModal({
        title: `设置【${key}】的内容`,
        content: valueType === 'string' ? content : JSON.stringify(content),
        editable: true,
        success(res) {
          if (res.cancel) return;
          uni.setStorageSync(key, res.content);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f7f7f7;

  .tools {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 32rpx;
    .item {
      box-sizing: border-box;
      width: 48%;
      margin-bottom: 32rpx;
      padding: 25rpx 0;
      text-align: center;
      background: #ffffff;
      border-radius: 10rpx;
      box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
      .title {
        font-weight: bold;
        font-size: 36rpx;
      }
      .sub-title {
        color: #000000;
        font-size: 24rpx;
      }
    }
  }
}
</style>
