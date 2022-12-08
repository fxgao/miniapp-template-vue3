const useLogin = () => {
  const loginStorageKey = 'loginStorageKey';
  let RequestMethods = 'get'; // 请求方式
  let LoginCode = 200; // 登录成功的code
  let CodeAlias = 'code'; // 静默登录接口key
  let LoginURL = ''; // 登录的接口url
  let RetryTimes = 3; // 错误重试次数
  let LoginPageRoute = ''; // 登录页面url
  let ReturnClickFuncObj = {}; // 回流事件存储区

  // 登录配置信息设置
  const basicSet = ({ methods, url, loginPageRoute }) => {
    RequestMethods = methods;
    LoginURL = url;
    LoginPageRoute = loginPageRoute;
  };

  /**
   * 静默登录
   * params.everyLogin 每次onlaunch都调用login
   * params.retryTimes 重试次数
   * params.loginSuccessCode 业务成功码
   * timeout 延迟时间
   * codeAlias 静默登录，别名，默认为code
   */
  const login = (params, completeFunc, failFunc) => {
    const { everyLogin, retryTimes = 3, loginSuccessCode = 200, codeAlias = 'code' } = params;
    RetryTimes = retryTimes;
    LoginCode = loginSuccessCode;
    CodeAlias = codeAlias;
    if (everyLogin) {
      console.log('everyLogin >>>>>>>>');
      clearLoginStorage();
    }
    wx.checkSession({
      success() {
        if (uni.getStorageSync(loginStorageKey)) {
          completeFunc(uni.getStorageSync(loginStorageKey));
        } else {
          loginStatusHandle(params, completeFunc, failFunc);
        }
      },
      fail() {
        loginStatusHandle(params, completeFunc, failFunc);
      }
    });
  };

  const loginStatusHandle = (params, completeFunc, failFunc) => {
    wx.login({
      success(res) {
        if (res.code) {
          params.data = params.data ? params.data : {};
          params.data[CodeAlias] = res.code;
          params.url = LoginURL;
          params.method = RequestMethods;
          callLogin(params, completeFunc, failFunc);
        } else {
          failFunc(res);
        }
      },
      fail(err) {
        failFunc(err);
      }
    });
  };

  const callLogin = (params, completeFunc, failFunc) => {
    uni.request({
      ...params,
      success: (res) => {
        if (res && res.data?.code == LoginCode) {
          uni.setStorageSync(loginStorageKey, res);
        }
        completeFunc(res);
      },
      fail: (err) => {
        console.log('callLogin', err);
        if (RetryTimes) {
          retryFn(params, completeFunc, failFunc, err);
        } else {
          failFunc(err);
        }
      }
    });
  };

  const retryFn = (params, completeFunc, failFunc, res) => {
    wx.getNetworkType({
      success(networkRes) {
        wx.login({
          success(codeRes) {
            if (codeRes.code) {
              // 赋值新的code
              params.data[CodeAlias] = codeRes.code;
              if (['wifi', '5g', '4g'].indexOf(networkRes.networkType) !== -1) {
                setTimeout(() => {
                  RetryTimes--;
                  callLogin(params, completeFunc, failFunc, true);
                }, 1000);
              } else if (networkRes.networkType === 'none') {
                RetryTimes = 0;
                failFunc(res);
              } else {
                setTimeout(() => {
                  RetryTimes--;
                  callLogin(params, completeFunc, failFunc, true);
                }, 2000);
              }
            } else {
              failFunc(res);
            }
          },
          fail(codeFail) {
            failFunc(codeFail);
          }
        });
      },
      fail() {
        // 获取网络情况失败
        failFunc(res);
      }
    });
  };
  // 清除信息
  const clearLoginStorage = () => {
    wx.removeStorage({
      key: loginStorageKey
    });
  };

  // 增加路由跳转
  const addRouteJump = (params, returnClickFunc) => {
    const { jumpBehavior, jumpPath, autoJumpLogin = true } = params;
    if (!LoginPageRoute) {
      throw new Error('loginPageRoute为必填');
    }

    // 是回流事件时
    if (returnClickFunc) {
      const pages = getCurrentPages();
      const path = pages[pages.length - 1].$page.fullPath;

      ReturnClickFuncObj = {
        fullPath: path,
        returnClickFunc
      };
    }

    if (jumpPath) {
      const encodePath = encodeURIComponent(JSON.stringify(jumpPath));
      // 登录路由记录
      uni.setStorageSync('LOGIN_ROUTE_RECODE', {
        jumpPath: encodePath,
        jumpBehavior
      });

      if (!autoJumpLogin) {
        return false;
      }
      uni.navigateTo({
        url: LoginPageRoute
      });
    } else {
      if (!autoJumpLogin) {
        return false;
      }
      uni.navigateTo({
        url: LoginPageRoute
      });
    }
  };

  // 释放路由跳转
  const releaseRouteJump = (scene) => {
    // scene: currentpage 当前页释放路由， scene: loginpage 登录页释放路由
    const loginRecord = uni.getStorageSync('LOGIN_ROUTE_RECODE');
    const { jumpBehavior, jumpPath } = loginRecord;
    let encodeURL = '';

    if (jumpPath) {
      encodeURL = JSON.parse(decodeURIComponent(jumpPath));
      switch (jumpBehavior) {
        case 'switchTab':
          uni.switchTab({
            url: encodeURL
          });
          break;
        case 'reLaunch':
          uni.reLaunch({
            url: encodeURL
          });
          break;
        case 'redirect':
          checkRouteLevel('redirect');
          uni.redirectTo({
            url: encodeURL
          });
          break;
        case 'navigate':
          checkRouteLevel('navigate');
          if (scene === 'currentpage') {
            uni.navigateTo({
              url: encodeURL
            });
            return false;
          }
          uni.redirectTo({
            url: encodeURL
          });
          break;
        default:
          uni.navigateTo({
            url: encodeURL
          });
      }

      // 清除路由缓存
      uni.setStorageSync('LOGIN_ROUTE_RECODE', {
        encodePath: '',
        jumpBehavior: ''
      });
    } else {
      // 事件回传测试, 普通的跳转才支持事件回传
      const pages = getCurrentPages();
      if (scene === 'currentpage') {
        if (
          ReturnClickFuncObj &&
          ReturnClickFuncObj.fullPath === pages[pages.length - 1].$page.fullPath
        ) {
          ReturnClickFuncObj.returnClickFunc();
          ReturnClickFuncObj = {};
        }

        // 清除路由缓存
        uni.setStorageSync('LOGIN_ROUTE_RECODE', {
          encodePath: '',
          jumpBehavior: ''
        });
      } else {
        for (let i = 0; i < pages.length; i++) {
          if (LoginPageRoute === pages[i].$page.fullPath) {
            const prevPath = pages[i - 1];

            // 执行
            uni.navigateBack({
              delta: pages.length - i,
              complete: () => {
                // 执行
                if (ReturnClickFuncObj && ReturnClickFuncObj.fullPath === prevPath.$page.fullPath) {
                  ReturnClickFuncObj.returnClickFunc();

                  ReturnClickFuncObj = {};
                }
              }
            });

            // 清除路由缓存
            uni.setStorageSync('LOGIN_ROUTE_RECODE', {
              encodePath: '',
              jumpBehavior: ''
            });
          }
        }
      }
    }
  };

  // 检查路由等级
  const checkRouteLevel = (jumpBehavior) => {
    const pages = getCurrentPages();
    for (let i = 0; i < pages.length; i++) {
      if (LoginPageRoute === pages[i].$page.fullPath) {
        const loginIndex = i;
        let defaultBackLevel = 1;
        if (loginIndex !== pages.length - 1) {
          switch (jumpBehavior) {
            case 'navigate':
              defaultBackLevel = loginIndex - (loginIndex - 1);
              break;
            case 'redirect':
              defaultBackLevel = loginIndex - (loginIndex - 2);
              break;
          }

          uni.navigateBack({
            delta: defaultBackLevel
          });
        } else {
          uni.navigateBack({
            delta: defaultBackLevel
          });
        }
      }
    }
  };
  return {
    basicSet,
    login,
    addRouteJump,
    releaseRouteJump,
    clearLoginStorage
  };
};

export default useLogin;
