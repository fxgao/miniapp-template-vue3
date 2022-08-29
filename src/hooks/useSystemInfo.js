import { computed } from 'vue';
import { useSystemInfoStore } from '@/stores/systemInfo';

export const useSystemInfo = () => {
  const systemInfoStore = useSystemInfoStore();
  const systemInfo = computed(() => {
    return systemInfoStore.systemInfo || uni.globalSystemInfo || {};
  });
  const getSystemInfo = () => {
    const systemInfo = uni.getSystemInfoSync() || {
      model: '',
      system: ''
    };
    const ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
    const height = systemInfo.screenHeight - systemInfo.safeArea.bottom || 0;
    // const px2Rpx = 750 / systemInfo.windowWidth;
    let rect;
    let navBarHeight = '';

    try {
      rect = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null;
      if (rect === null) {
        throw new Error('getMenuButtonBoundingClientRect error');
      }
      // 取值为0的情况  有可能width不为0 top为0的情况
      if (!rect.width || !rect.top || !rect.left || !rect.height) {
        throw new Error('getMenuButtonBoundingClientRect error');
      }
    } catch (error) {
      let gap = ''; // 胶囊按钮上下间距 使导航内容居中
      let width = 96; // 胶囊的宽度
      if (systemInfo.platform === 'android') {
        gap = 8;
        width = 96;
      } else if (systemInfo.platform === 'devtools') {
        if (ios) {
          gap = 5.5; // 开发工具中ios手机
        } else {
          gap = 7.5; // 开发工具中android和其他手机
        }
      } else {
        gap = 4;
        width = 88;
      }
      if (!systemInfo.statusBarHeight) {
        // 开启wifi的情况下修复statusBarHeight值获取不到
        systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
      }
      rect = {
        // 获取不到胶囊信息就自定义重置一个
        bottom: systemInfo.statusBarHeight + gap + 32,
        height: 32,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        top: systemInfo.statusBarHeight + gap,
        width
      };
    }

    if (!systemInfo.statusBarHeight) {
      // 开启wifi和打电话下
      systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
      navBarHeight = (function () {
        const gap = rect.top - systemInfo.statusBarHeight;
        return 2 * gap + rect.height;
      })();
      systemInfo.statusBarHeight = 0;
      systemInfo.navBarExtendHeight = 0; // 下方扩展4像素高度 防止下方边距太小
    } else {
      navBarHeight = (function () {
        const gap = rect.top - systemInfo.statusBarHeight;
        return 2 * gap + rect.height;
      })();
      if (ios) {
        systemInfo.navBarExtendHeight = 4; // 下方扩展4像素高度 防止下方边距太小
      } else {
        systemInfo.navBarExtendHeight = 0;
      }
    }
    if (systemInfo.titleBarHeight) {
      // 支付宝小程序可以获取到状态栏高度
      systemInfo.navBarHeight = systemInfo.titleBarHeight;
    } else if (systemInfo.navigationBarHeight) {
      // 百度小程序
      systemInfo.navBarHeight = systemInfo.navigationBarHeight;
    } else {
      systemInfo.navBarHeight = navBarHeight; // 导航栏高度不包括statusBarHeight
    }
    systemInfo.capsulePosition = rect; // 右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
    systemInfo.ios = ios; // 是否ios
    systemInfo.navFullHeight = `${
      (systemInfo.navBarHeight || 0) +
      (systemInfo.navBarExtendHeight || 0) +
      (systemInfo.statusBarHeight || 0)
    }`;
    if (systemInfo.screenHeight / systemInfo.screenWidth <= 1.8) {
      systemInfo.longPhone = false;
    } else {
      systemInfo.longPhone = true;
    }
    systemInfo.safeBottomHeight = height > 40 ? 40 : height;
    uni.globalSystemInfo = systemInfo; // 将信息保存到全局变量中,后边再用就不用重新异步获取了
    systemInfoStore.setSystemInfo(systemInfo); // 保存到store中
  };

  return {
    systemInfo,
    getSystemInfo
  };
};
