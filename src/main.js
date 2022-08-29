import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';

export function createApp() {
  const app = createSSRApp(App);

  // 全局方法注册

  // 全局组件注册

  // 引入Pinia
  app.use(Pinia.createPinia());

  return {
    app,
    Pinia
  };
}
