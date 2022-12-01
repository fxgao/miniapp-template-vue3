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
      <mp-html v-model:content="tipsContent"></mp-html>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import api from '@/api';
import MpHtml from '@/components/mp-html/mp-html.vue';
import { useSystemInfo, useAppInstance } from '@/hooks';

const { systemInfo } = useSystemInfo();
// const { $globalEnv } = useAppInstance();
const tipTitle = ref('');
const tipsContent = ref('');

const getRulesInfo = async (alias, title) => {
  // const VUE_APP_PROCESS_ENV = $globalEnv;
  const res = await api.common.getProtocolContent(alias);
  console.log('getProtocolContent', res);
  tipTitle.value = title;
  tipsContent.value = res.data || '暂无内容';
};

onLoad((options) => {
  getRulesInfo(options.alias, options.title);
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
