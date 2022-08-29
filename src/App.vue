<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
// import SystemInfo from '@/utils/getSystemInfo';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import CheckVersion from '@/utils/checkVersion';

const { systemInfo, getSystemInfo } = useSystemInfo();

const loadFont = () => {
  uni.loadFontFace({
    family: 'DINPro-Bold',
    source: 'url("https://res.paquapp.com/boxonline/font/DINPro-Bold.otf")',
    global: true
  });
};

onLaunch(() => {
  console.log('App Launch');
  getSystemInfo(); // 获取系统信息
  // SystemInfo.getSystemInfo();
  CheckVersion.doCheck(); // 检查版本
  loadFont(); // 加载字体
});

onShow((options) => {
  console.log('App Show', options, systemInfo.value);
});

onHide(() => {
  console.log('App Hide');
});
</script>

<style>
/* 每个页面公共css */
</style>
