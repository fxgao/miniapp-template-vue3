<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useSystemInfo, useCheckVersion, useAppInstance } from '@/hooks';
import { useLoginInfoStore } from '@/stores/loginInfo';
import { useLocationInfoStore } from '@/stores/location';
import api from '@/api';

const { systemInfo, getSystemInfo } = useSystemInfo();
const locationInfoStore = useLocationInfoStore();
const { checkClientVersion } = useCheckVersion();
const { $loginMP, $isResolve, $reject, $userLocationResolve } = useAppInstance();

// 静默登录
const slientLogin = (successFunc = null) => {
  const params = {};
  const loginInfoStore = useLoginInfoStore();

  params.everyLogin = true;
  params.timeout = 10000;
  params.retryTimes = 3; // 静默登录重试次数改为0
  $loginMP.login(
    params,
    (res) => {
      console.log('成功结束静默登录', new Date(), res);
      // 业务代码
      if (res.data.code === 200) {
        const loginInfo = res.data.data || {};
        // 存储pinia
        loginInfoStore.setLoginInfo(loginInfo);

        try {
          loginedSaveStorage(loginInfo);
        } catch (error) {
          console.log('EEEERRRRROOOOORRRR', error);
        } finally {
          console.log('slientLoginslientLogin');
          successFunc && successFunc();
          // 获取用户位置信息
          getUserLocation();
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
      $reject && $reject(err);
    }
  );
};

// 获取登录信息
const getUserLocation = () => {
  uni.getLocation({
    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
    geocode: true,
    success: async (res) => {
      console.log('getLocation res', res);
      const latitude = res.latitude;
      const lngitude = res.longitude;
      try {
        const positionInfo = await api.common.locationTransPosition(latitude, lngitude);
        console.log('positionInfo', positionInfo);
        locationInfoStore.setLocationInfo({
          lat: latitude,
          lng: lngitude,
          code: positionInfo.code,
          name: positionInfo.name,
          areaList: positionInfo.areaList,
          locationInfo: res
        });
      } catch (error) {
        console.log('getUserLocation >>>>>>', error)
      } finally {
        $userLocationResolve && $userLocationResolve();
      }
    },
    fail: async (err) => {
      console.log('getLocation fail', err);
      const positionInfo = await api.common.locationTransPosition(0, 0);
      console.log('positionInfo', positionInfo);
      locationInfoStore.setLocationInfo({
        lat: 0,
        lng: 0,
        locationInfo: null,
        code: positionInfo.code,
        name: positionInfo.name,
        areaList: positionInfo.areaList,
      });
      $userLocationResolve && $userLocationResolve();
    }
  });
};

// 存储登录信息
const loginedSaveStorage = (loginInfo) => {
  uni.setStorageSync('TOKEN', loginInfo.token);
  uni.setStorageSync('OPEN_ID', loginInfo.openId);
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
