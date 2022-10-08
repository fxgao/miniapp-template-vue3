import { defineStore } from 'pinia';

export const useLocationInfoStore = defineStore('locationInfo', {
  state: () => {
    return { locationInfo: null };
  },
  getters: {
    getAreaList: (state) => {
      console.log('locationInfo getter', state);
      if (!state.locationInfo) {
        return [{
          name: '',
          code: 0
        }];
      } else {
        return state.locationInfo?.areaList ? state.locationInfo.areaList : [];
      }
    },
    getCode: (state) => {
      if (!state.locationInfo) {
        return 0;
      } else {
        return state.locationInfo?.code ? state.locationInfo.code : [];
      }
    }
  },
  actions: {
    setLocationInfo(info) {
      console.log('setLocationInfo', info);
      this.locationInfo = info || '';
    }
  }
});
