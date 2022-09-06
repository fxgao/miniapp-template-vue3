<template>
  <div>
    <!-- 用户信息授权 -->
    <view @tap="getUserInfo">
      <slot name="user"></slot>
    </view>

    <!-- 手机号授权 -->
    <button class="clear-default-style" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
      <slot name="phone"></slot>
    </button>
  </div>
</template>

<script setup>
const emits = defineEmits(['getUserInfo', 'getPhoneNumber']);
// 获取用户信息
const getUserInfo = () => {
  uni.getUserProfile({
    lang: 'zh_CN',
    desc: '用于完善会员资料',
    success(res) {},
    fail(err) {
      console.log('getUserProfile fail~', err);
    },
    complete(res) {
      emits('getUserInfo', res);
    }
  });
};
// 手机号授权
const getPhoneNumber = (res) => {
  emits('getPhoneNumber', res);
};
</script>

<style lang="scss" scoped>
.clear-default-style {
  width: max-content;
  margin: 0;
  padding: 0;
}
button::after {
  border: none;
}
</style>
