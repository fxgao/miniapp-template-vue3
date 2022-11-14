<template>
  <view class="page">
    <nav-bar
      ref="navBar"
      :title="pageTitle"
      showBackIcon="black"
      titleColor="color:#2F2E3B;"
      backgroundColor="rgba(255,255,255,1)"
      :navCenterStyle="'flex-end'"
    ></nav-bar>
    <view class="container">
      <view class="settingContainer">
        <view class="setting_block required">
          <view class="text">头像</view>
          <view class="content avatar">
            <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
              <image class="avatar" :src="avatar"></image>
            </button>
          </view>
        </view>
        <view class="setting_block required">
          <view class="text">报名人</view>
          <view class="content">
            <input
              class="inputBlock"
              type="nickname"
              :value="nickName"
              :maxlength="20"
              placeholder="请输入报名人"
              @change="handleInput"
              @input="handleInput"
            />
          </view>
        </view>
        <view class="setting_block required">
          <view class="text">手机号</view>
          <view class="content">
            <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="inputBlock">
              {{ telPhone ? telPhone : '请选择手机号' }}
            </button>
          </view>
        </view>
        <view class="setting_block required">
          <view class="text">出生日期</view>
          <view class="content">
            <picker class="inputBlock" mode="date" :value="birthDay" @change="birthDayChange">
              {{ birthDay ? birthDay : '请选择出生日期' }}
            </picker>
          </view>
        </view>
        <view class="setting_block required">
          <view class="text">
            等级
            <image
              class="icon"
              src="https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/icon/i-icon.png"
              mode="aspectFit"
            />
          </view>
          <view class="content">
            <picker
              class="inputBlock"
              :range="levelOptionList"
              range-key="label"
              :value="level"
              @change="levelChange"
            >
              {{ level ? level : '请选择等级' }}
            </picker>
          </view>
        </view>
        <view class="setting_block">
          <view class="text">性别</view>
          <view class="content">
            <picker
              class="inputBlock"
              :range="sexOptionList"
              range-key="label"
              :value="sex"
              @change="sexChange"
            >
              {{ sex !== null ? sexValue2String[sex] : '请选择性别' }}
            </picker>
          </view>
        </view>
        <view class="setting_block column">
          <view class="text">您的诉求</view>
          <textarea
            class="textArea"
            :value="demand"
            @blur="demandChange"
            @input="demandChange"
            :maxlength="300"
            placeholder="请输入您参加活动/课程的诉求，如：入门学习，提升技能"
            placeholder-style="color: #C0C0C0;"
          />
        </view>
      </view>
      <view
        class="actionContainer"
        :style="{
          'padding-bottom': systemInfo.safeBottom + 'px'
        }"
      >
        <view class="save_btn" @click="handleConfirm"> 保存 </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useSystemInfoStore } from '@/stores/systemInfo';
import { useLoginInfoStore } from '@/stores/loginInfo';
import { useAppInstance } from '@/hooks';
import api from '@/api';
import { debounce, randomString } from '@/utils';
import uploadImage from '@/lib/upload-img';
const systemInfo = useSystemInfoStore();
const loginInfoStore = useLoginInfoStore();
const { loginInfoData } = storeToRefs(loginInfoStore);
const { $onLaunched } = useAppInstance();

// 规则
const pattern = /^[\uD800-\uDBFF-\uDC00-\uDFFF-\u4E00-\u9FA5A-Za-z0-9_+~]+$/;

const pageMode = ref('new');
const pageTitle = ref('个人信息');

const avatar = ref('');
const isChoose = ref(false);
const isNavBack = ref(false);
// 选择头像
const onChooseAvatar = (e) => {
  console.log('onChooseAvatar', e);
  const { avatarUrl } = e.detail;

  const isValidate =
    ['jpg', 'jpeg', 'png', 'webp', 'bmp'].indexOf(avatarUrl.split('.')?.slice(-1)[0]) > -1;

  if (!isValidate) {
    uni.showToast({
      icon: 'none',
      title: '只支持jpg、jpeg、png、webp、bmp等图片格式'
    });
    return false;
  }

  avatar.value = avatarUrl || '';
  isChoose.value = true;
};
// 上传图片
const uploadImg = () => {
  const key = `${loginInfoData.value.id}${randomString(10, true)}.${
    avatar.value.split('.')[avatar.value.split('.').length - 1]
  }`;

  uni.compressImage({
    src: avatar.value,
    quality: 80,
    success(r) {
      uni.getImageInfo({
        src: r.tempFilePath,
        success: (res) => {
          const data = {
            path: r.tempFilePath,
            width: res.width,
            height: res.height,
            key
          };
          console.log('uploadImage before', data);
          uploadImage(data).then(({ status, files }) => {
            console.log('uploadImage after', status, files);
            if (status === 'fail') {
              return uni.showToast({ title: '上传头像失败', icon: 'none' });
            }

            const lastAvatarImg = files[0].imgUrl;
            handleSave(lastAvatarImg); // 保存用户信息
            isChoose.value = false;
          });
        },
        fail: (err) => {
          console.log('uploadImage fail', err);
          uni.showToast({ title: '上传头像失败', icon: 'none' });
        }
      });
    },
    fail: (err) => {
      console.log('err', err);
      uni.showToast({ title: '上传头像失败', icon: 'none' });
    }
  });
};

const nickName = ref('');
// 处理昵称输入
const handleInput = (e) => {
  const value = e.detail.value || '';
  const nickNameValue = value.replace(/\s+/g, '');
  nickName.value = nickNameValue;
  return nickNameValue;
};

const telPhone = ref('');
const getPhoneNumber = async (res) => {
  console.log('getPhoneNumber', res);
  const result = await api.common.getPhoneNumber({
    code: res.detail.code
  });
  telPhone.value = result;
  return result;
};

const birthDay = ref('');
const birthDayChange = (e) => {
  console.log('birthDayChange', e);
  const value = e.detail.value || '';
  birthDay.value = value;
  return value;
};

const level = ref('');
const levelOptionList = ref([
  { label: '0基础' },
  { label: '初级' },
  { label: '进阶' },
  { label: '高水平' }
]);
const levelChange = (e) => {
  console.log('levelChange', e);
  const index = e.detail.value || '';
  level.value = levelOptionList.value[index].label;
  return index;
};

const sex = ref(1);
const sexOptionList = ref([
  { value: 0, label: '女' },
  { value: 1, label: '男' }
]);
const sexValue2String = ref({
  0: '女',
  1: '男'
});
const sexChange = (e) => {
  console.log('sexChange', e);
  const index = e.detail.value || '';
  sex.value = sexOptionList.value[index].value;
  return index;
};

const demand = ref('');
const demandChange = (e) => {
  console.log('demandChange', e);
  const value = e.detail.value || '';
  demand.value = value;
  return value;
};

// 验证表单
const validateFormData = () => {
  // 头像验证
  if (!avatar.value) {
    uni.showToast({
      title: '头像不能为空！',
      icon: 'none'
    });
    return true;
  }
  // 报名人验证
  const str = nickName.value;
  // 规则
  const pattern = /^[\uD800-\uDBFF-\uDC00-\uDFFF-\u4E00-\u9FA5A-Za-z0-9_~]+$/;
  // 长度（按字符） <2 或 >20 非法
  let len = 0;
  for (const char of str) {
    // eslint-disable-next-line no-control-regex
    len += char.match(/[^\x00-\xff]/gi) != null ? 2 : 1;
  }
  if (!pattern.test(str) || len < 2 || len > 20) {
    uni.showToast({
      title: '报名人需要2-20个字符，且没有特殊字符',
      icon: 'none'
    });
    return true;
  }
  // 手机号验证
  if (!telPhone.value) {
    uni.showToast({
      title: '手机号不能为空！',
      icon: 'none'
    });
    return true;
  }
  // 生日
  if (!birthDay.value) {
    uni.showToast({
      title: '生日不能为空！',
      icon: 'none'
    });
    return true;
  }
  // 等级
  if (!level.value) {
    uni.showToast({
      title: '等级为必填项！',
      icon: 'none'
    });
    return true;
  }

  return false;
};

// 确认按钮点击
const confirm = () => {
  if (validateFormData()) return;

  if (!isChoose.value) {
    handleSave(); // 没有头像更改，直接保存用户信息
  } else {
    uploadImg(); // 存在头像更改，先上传图片
  }
};

const handleConfirm = debounce(confirm, 2000, true);

// 保存信息
const handleSave = async (lastAvatarImg = '') => {
  const params = {
    id: loginInfoData.value.id,
    photo: lastAvatarImg || avatar.value,
    nickname: nickName.value,
    tel: telPhone.value,
    birthday: birthDay.value,
    level: level.value,
    sex: sexValue2String.value[sex.value],
    demand: demand.value
  };
  // 调用接口
  const result = await api.common.updateUserInfo(params);
  console.log('updateUserInfo', result);
  // 结果更新
  if (result.code === 200) {
    loginInfoStore.setLoginInfo(result);
    uni.showToast({
      title: '保存成功！',
      icon: 'none'
    });
    if (isNavBack.value) {
      setTimeout(() => {
        uni.navigateBack();
      }, 1000);
    }
  }
};

onLoad(async (option) => {
  await $onLaunched;
  console.log('edit-profile onload', loginInfoData.value);
  const { navBack = false } = option;
  isNavBack.value = navBack;
  if (!loginInfoData.value.tel) {
    pageTitle.value = '创建个人信息';
    pageMode.value = 'new';
  } else {
    pageTitle.value = '编辑个人信息';
    pageMode.value = 'edit';
    // 初始化信息
    avatar.value = loginInfoData.value.photo;
    nickName.value = loginInfoData.value.nickname;
    telPhone.value = loginInfoData.value.tel;
    birthDay.value = loginInfoData.value.birthDay;
    level.value = loginInfoData.value.level;
    sex.value = loginInfoData.value.sex === '男' ? 1 : loginInfoData.value.sex === '女' ? 0 : 1;
    demand.value = loginInfoData.value.demand;
  }
  isChoose.value = false;
});
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  min-height: 100vh;
  background: #f5f5f5;
}
.container {
  .settingContainer {
    display: flex;
    flex-direction: column;
    padding: 0 40rpx;
    margin-top: 16rpx;
    background: #fff;
    .setting_block {
      &:not(:last-child) {
        border-bottom: 1rpx solid #eeeeee;
      }
      &.column {
        display: flex;
        flex-direction: column;
        justify-content: baseline;
        align-items: flex-start;
        .textArea {
          padding-top: 32rpx;
          width: 100%;
        }
      }
      &.required {
        &::before {
          content: '*';
          position: absolute;
          left: -20rpx;
          top: 50%;
          transform: translateY(-50%);
          font-size: 32rpx;
          color: #ff5a5a;
          line-height: 48rpx;
        }
      }
      @include flex-between();
      padding: 32rpx 0;
      position: relative;
      .text {
        @include flex-start;
        font-size: 32rpx;
        color: #a0a0a0;
        line-height: 48rpx;
        flex: none;
        .icon {
          width: 40rpx;
          height: 40rpx;
          margin-left: 16rpx;
        }
      }
      .content {
        width: 60%;
        .inputBlock {
          text-align: right;
          font-size: 32rpx;
          color: #333;
          line-height: 48rpx;
        }
        font-size: 32rpx;
        color: #333;
        line-height: 48rpx;
        text-align: right;
      }
      .avatar {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
        background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/bg/upload-avatar-bg.png')
          0 0 no-repeat;
        background-size: contain;
      }
    }
  }

  .actionContainer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: #fff;
    padding: 0 40rpx;
    .save_btn {
      // &.disabled {
      //   background: #dddddd;
      // }
      @include btn-normal();
      width: 100%;
      margin: 16rpx 0;
    }
  }
}
</style>
