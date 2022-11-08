import { defineStore } from 'pinia';

export const useSystemInfoStore = defineStore('systemInfo', {
  state: () => {
    return { systemInfo: null };
  },
  getters: {
    safeBottom: (state) => {
      if (!state.systemInfo) {
        return 4;
      } else {
        return state.systemInfo?.safeBottomHeight || 4;
      }
    },
    navHeight: (state) => {
      if (!state.systemInfo) {
        return 4;
      } else {
        const { navBarHeight = 0, navBarExtendHeight = 0, statusBarHeight = 0 } = state.systemInfo;
        return `${navBarHeight + navBarExtendHeight + statusBarHeight}px`;
      }
    }
  },
  actions: {
    setSystemInfo(info) {
      this.systemInfo = info || {};
    }
  }
});
