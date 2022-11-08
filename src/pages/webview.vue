<template>
  <web-view :src="url" />
</template>

<script>
export default {
  data() {
    return {
      url: ''
    };
  },
  async onLoad({ url }) {
    this.url = decodeURIComponent(url);
  }
};
</script>

<style lang="scss" scoped></style>
