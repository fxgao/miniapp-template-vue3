import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import Unocss from 'unocss/vite';
import transformWeClass from 'unplugin-transform-we-class/vite';
import { presetAttributifyWechat } from 'unplugin-unocss-attributify-wechat/vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    uni(),
    // https://github.com/MellowCo/unplugin-unocss-attributify-wechat
    presetAttributifyWechat({
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]my-folder[\\/]/],
      include: [/\.vue$/, /\.vue\?vue/]
    }),
    // https://github.com/antfu/unocss
    Unocss(),
    // https://github.com/MellowCo/unplugin-unocss-attributify-wechat
    transformWeClass()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/style/index.scss";'
      }
    }
  }
});
