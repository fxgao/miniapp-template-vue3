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
    }
  },
  actions: {
    setSystemInfo(info) {
      this.systemInfo = info || {};
    }
  }
});
