import { defineStore } from 'pinia';

export const useLoginInfoStore = defineStore('loginInfo', {
  state: () => {
    return { loginInfo: null };
  },
  actions: {
    setLoginInfo(info) {
      this.loginInfo = info || '';
    }
  }
});
