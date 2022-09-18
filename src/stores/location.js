import { defineStore } from 'pinia';

export const useLocationInfoStore = defineStore('locationInfo', {
  state: () => {
    return { locationInfo: null };
  },
  actions: {
    setLocationInfo(info) {
      this.locationInfo = info || '';
    }
  }
});
