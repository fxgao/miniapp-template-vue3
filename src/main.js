import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';

import config from '@/api/config';
import { useLogin } from '@/hooks';
import tabBar from '@/components/tabbar';
import navBar from '@/components/navigation-bar';

const BASE_URL = config.REQUEST_URL_PREFIX;

export function createApp() {
  const loginMP = useLogin();
  const app = createSSRApp(App);

  // 全局方法注册
  loginMP.basicSet({
    url: BASE_URL + '/wx/user/login',
    methods: 'POST',
    loginPageRoute: '/packages/mine/pages/login/login'
  });
  app.config.globalProperties.$loginMP = loginMP;
  // 登录组件异步阻塞方法挂用
  app.config.globalProperties.$onLaunched = new Promise((resolve, reject) => {
    app.config.globalProperties.$isResolve = resolve;
    app.config.globalProperties.$reject = reject;
  });
  // 错误页再次重试，处理阻塞问题
  app.config.globalProperties.$reLaunched = function () {
    app.config.globalProperties.$onLaunched = new Promise((resolve, reject) => {
      app.config.globalProperties.$isResolve = resolve;
      app.config.globalProperties.$reject = reject;
    });
  };
  // 阻塞默认地址数据
  app.config.globalProperties.$userDefaultAddress = new Promise((resolve) => {
    app.config.globalProperties.$userDefaultAddressResolve = resolve;
  });
  // 全局组件注册
  app.component('tab-bar', tabBar);
  app.component('nav-bar', navBar);

  // 引入Pinia
  app.use(Pinia.createPinia());

  return {
    app,
    Pinia
  };
}
