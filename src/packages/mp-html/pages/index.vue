<template>
  <view
    class="page"
    :style="
      'padding-bottom:' +
      (systemInfo.safeBottomHeight === 0
        ? systemInfo.safeBottomHeight + 68
        : systemInfo.safeBottomHeight) +
      'px'
    "
  >
    <nav-bar
      ref="navBar"
      :title="tipTitle"
      showBackIcon="black"
      titleColor="color:#2F2E3B;"
      backgroundColor="rgba(255,255,255,1)"
    ></nav-bar>
    <view
      class="container"
      :style="{
        'padding-bottom': systemInfo.safeBottomHeight + 'px'
      }"
    >
      <!-- <mp-html v-model:content="tipsContent"></mp-html> -->
      <!-- <loading-spin v-if="loading" /> -->
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import api from '@/api';
// import LoadingSpin from '@/components/base/LoadingSpin';
// import MpHtml from '@/components/mp-html/mp-html.vue';
import { useSystemInfo, useAppInstance } from '@/hooks';

const { systemInfo } = useSystemInfo();
const { $globalEnv } = useAppInstance();
const loading = ref(true);
const tipTitle = ref('');
const tipsContent = ref('');

const getRulesInfo = async (alias) => {
  const VUE_APP_PROCESS_ENV = $globalEnv;
  // const { title, content } = await api.common.getRuleContent(alias, VUE_APP_PROCESS_ENV);
  tipTitle.value = '测试';
  tipsContent.value = `<h1 style="text-align: left;">Welcome to the TinyMCE demo!</h1>
<p style="font-size: 15px; text-align: left;"><img src="https://www.baidu.com/img/bd_logo1.png" alt="My alt text" width="540" height="258" /></p >
<p style="font-size: 15px; text-align: left;">f<strong>adsfdasfas</strong>df</p >
<p style="font-size: 15px; text-align: left;">fad<em>sfasd</em>fasd</p >`;

  nextTick(() => {
    loading.value = false;
  });
};

onLoad((options) => {
  getRulesInfo(options.alias);
});
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  min-height: 100vh;
  .container {
    padding: 0 32rpx;
  }
}
</style>
