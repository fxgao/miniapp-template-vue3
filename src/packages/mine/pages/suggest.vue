<template>
  <view class="page">
    <nav-bar
      ref="navBar"
      title="建议反馈"
      showBackIcon="black"
      titleColor="color:#2F2E3B;"
      backgroundColor="rgba(255,255,255,1)"
      :navCenterStyle="'flex-end'"
    ></nav-bar>
    <view class="pageContainer">
      <view class="main">
        <textarea
          class="textArea"
          :value="demand"
          @input="demandChange"
          :maxlength="300"
          placeholder="请输入您的建议或使用反馈"
          placeholder-style="color: #C0C0C0;"
        />
      </view>
      <view
        class="actionContainer"
        :style="{
          'padding-bottom': safeBottom + 'px'
        }"
      >
        <view class="save_btn" @click="handleConfirm"> 提交 </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSystemInfoStore } from '@/stores/systemInfo';
import { storeToRefs } from 'pinia';
import api from '@/api';
import { debounce } from '@/utils';
const systemInfoStore = useSystemInfoStore();
const { safeBottom } = storeToRefs(systemInfoStore);

const demand = ref('');
const demandChange = (e) => {
  console.log('demandChange', e);
  const value = e.detail.value || '';
  demand.value = value;
};

// 验证表单
const validateFormData = () => {
  // 验证
  if (!demand.value) {
    uni.showToast({
      title: '建议或反馈不能为空！',
      icon: 'none'
    });
    return true;
  }

  return false;
};

// 确认按钮点击
const confirm = () => {
  if (validateFormData()) return;

  handleSave();
};

const handleConfirm = debounce(confirm, 2000, true);

// 保存信息
const handleSave = async () => {
  const params = {
    content: demand.value
  };
  // 调用接口
  const result = await api.common.feedBack(params);
  console.log('feedBack', result);
  // 结果更新
  if (result === 1) {
    uni.showToast({ title: '提交成功！感谢您的反馈，客服会尽快联系您~', icon: 'none' });
  }
};

</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
}
.pageContainer {
  .main {
    background: #fff;
    padding: 32rpx 40rpx;
    margin-top: 16rpx;
    .textArea {
      height: 458rpx;
    }
  }
  .actionContainer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: #fff;
    padding: 0 40rpx;
    .save_btn {
      // &.disabled {
      //   background: #dddddd;
      // }
      @include btn-normal();
      width: 100%;
      margin: 16rpx 0;
    }
  }
}
</style>
