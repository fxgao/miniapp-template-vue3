<script setup>
import { getCurrentInstance } from 'vue';
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useSystemInfo, useCheckVersion } from '@/hooks';
import { useLoginInfoStore } from '@/stores/loginInfo';

const { systemInfo, getSystemInfo } = useSystemInfo();
const { checkClientVersion } = useCheckVersion();

// 静默登录
const slientLogin = (successFunc = null) => {
  const params = {};
  const { appContext } = getCurrentInstance();
  const loginInfoStore = useLoginInfoStore();
  const { $loginMP, $isResolve, $reject } = appContext.config.globalProperties;

  params.everyLogin = true;
  params.timeout = 10000;
  params.retryTimes = 3; // 静默登录重试次数改为0
  $loginMP.login(
    params,
    (res) => {
      console.log('成功结束静默登录', new Date(), res);
      // 业务代码
      if (res.data.code === 200) {
        const loginInfo = res.data.data;
        // 存储pinia
        loginInfoStore.setLoginInfo(loginInfo);

        try {
          loginedSaveStorage(loginInfo);
        } catch (error) {
          console.log('EEEERRRRROOOOORRRR', error);
        } finally {
          console.log('slientLoginslientLogin');
          successFunc && successFunc();
          // 登录后阻塞放开
          $isResolve && $isResolve();
        }
      } else {
        console.log('静默登录失败Code！==200', new Date(), res);
        // 登录后阻塞放开
        $reject && $reject(res);
      }
    },
    (err) => {
      // 登录后阻塞放开
      $reject && $reject(res);
    }
  );
};

// 存储登录信息
const loginedSaveStorage = (loginInfo) => {
  uni.setStorageSync('TOKEN', loginInfo);
  // uni.setStorageSync('SHORT_TOKEN', loginInfo.sampleToken);
  // uni.setStorageSync('UNION_ID', loginInfo.user.union_id);
  // uni.setStorageSync('SESSION_ID', loginInfo.session_id);
};

// 加载字体
const loadFont = () => {
  uni.loadFontFace({
    family: 'DINPro-Bold',
    source: 'url("https://res.paquapp.com/boxonline/font/DINPro-Bold.otf")',
    global: true
  });
};

onLaunch(() => {
  console.log('App Launch');
  // 获取系统信息
  getSystemInfo();
  // 检查版本
  checkClientVersion();
  // 静默登录
  slientLogin();
  // 加载字体
  loadFont();
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
