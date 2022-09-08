<template>
  <view class="page">
    <nav-bar
      ref="navbar"
      :backgroundColor="'rgba(255,255,255,1)'"
      :isTransparent="false"
      title="得乐网球"
    />
    <view class="container">首页页面</view>
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
