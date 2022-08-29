class CheckVersion {
  doCheck() {
    if (uni.canIUse('getUpdateManager')) {
      const updateManager = uni.getUpdateManager(); // 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          // 检测到新版本，需要更新，给出提示
          uni.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            confirmText: '确定更新',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                this.downLoadAndUpdate(updateManager);
              }
            }
          });
        }
      });
    } else {
      uni.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      });
    }
  }

  downLoadAndUpdate(updateManager) {
    uni.showLoading(); // 静默下载更新小程序新版本

    updateManager.onUpdateReady(function () {
      uni.hideLoading(); // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启

      updateManager.applyUpdate();
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      uni.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
      });
    });
  }
}

export default new CheckVersion();
