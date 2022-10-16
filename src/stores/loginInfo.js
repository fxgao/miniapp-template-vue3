import { defineStore } from 'pinia';

export const useLoginInfoStore = defineStore('loginInfo', {
  state: () => {
    return { loginInfo: null };
  },
  getters: {
    loginInfoData: (state) => {
      if (!state.loginInfo) {
        return {};
      } else {
        return state.loginInfo || {};
      }
    }
  },
  actions: {
    setLoginInfo(info) {
      this.loginInfo = info || {};
    }
  }
});
