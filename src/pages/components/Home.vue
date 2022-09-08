<template>
  <view class="page-container">
    <div class="container">首页页面</div>
    <button @click="slientLogin">登录</button>
  </view>
</template>

<script setup>
import api from '@/api';
const slientLogin = () => {
  uni.login({
    provider: 'weixin',
    success: function (loginRes) {
      console.log('slientLogin', loginRes);
      const code = loginRes.code;
      api.common.login(code).then((res) => {
        console.log('login res', res);
      });
    }
  });
};
</script>

<style lang="scss" scoped></style>
