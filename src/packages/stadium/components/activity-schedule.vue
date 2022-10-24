<template>
  <view class="scheduleContainer">
    <scroll-view :scroll-x="true" class="dateInfo">
      <view class="dateContainer">
        <view
          class="dateItem"
          :class="{ active: index === nowIndex }"
          v-for="(item, index) in dateInfo"
          :key="index"
          @click="changeDate(index)"
        >
          {{ item.weekStr }} {{ item.showDateStr }}
        </view>
      </view>
    </scroll-view>
    <scroll-view :scroll-x="true" class="placeInfo" v-if="placeList.length">
      <view class="placeContainer">
        <view
          class="placeItem"
          :class="{ active: index === nowPlaceIndex }"
          v-for="(item, index) in placeList"
          :key="index"
        >
          {{ item.name }}
        </view>
      </view>
    </scroll-view>
    <scroll-view class="main" :scroll-y="true">
      <view class="scheduleBg"></view>
      <view
        class="activityBlock"
        @click="goDetail(item)"
        :style="{
          background: item.color,
          color: item.textColor,
          top: calcTop(item.start) + 'rpx',
          height: calcHeight(item.start, item.end) + 'rpx'
        }"
        v-for="(item, index) in activityList"
        :key="index"
      >
        <view class="title">{{ item.title }}</view>
        <view
          class="info"
          :style="{
            color: item.textColor
          }"
        >
          {{ item.start }}-{{ item.end }} {{ isOverTime(item.start) ? '可报名' : '已结束' }}
          <image
            class="icon"
            src="https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/icon/right-arrow-icon.png"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, toRefs, computed } from 'vue';
import { useGenerateDateInfo } from '@/hooks';
import api from '@/api';

const props = defineProps({
  stadiumId: {
    type: Number,
    required: true
  }
});
const { stadiumId } = toRefs(props);

const dateInfo = useGenerateDateInfo(7);
const activityInfoList = ref([]);
const nowIndex = ref(0);
const nowPlaceIndex = ref(0);
const loading = ref(false);
const getActivityInfo = async (activityTime) => {
  loading.value = true;
  try {
    const res = await api.stadium.getStadiumActivityList(stadiumId.value, activityTime.dateStr);
    console.log('getStadiumActivityList', res);
    activityInfoList.value = res;
    nowPlaceIndex.value = 0;
  } catch (error) {
    uni.showToast({ title: '请求数据出错！', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const placeList = computed(() => {
  if (activityInfoList.value.length <= 0) return [];
  const res = [];
  const exisitId = [];

  activityInfoList.value.forEach((item) => {
    if (!exisitId.includes(item.resourceId)) {
      exisitId.push(item.resourceId);
      res.push({
        name: item.placeName,
        resourceId: item.resourceId
      });
    }
  });
  return res;
});

const activityList = computed(() => {
  if (!placeList.value[nowPlaceIndex.value]) return [];
  const nowResourceId = placeList.value[nowPlaceIndex.value].resourceId;
  return activityInfoList.value.filter((item) => {
    return item.resourceId === nowResourceId;
  });
});

const changeDate = (index) => {
  if (index === nowIndex.value || loading.value) return;
  nowIndex.value = index;
  getActivityInfo(dateInfo[index]);
};

const changePlace = (index) => {
  if (index === nowIndex.value || loading.value) return;
  nowIndex.value = index;
  getActivityInfo(dateInfo[index]);
};

const calcTop = (startTime) => {
  const timeArr = startTime.split(':');
  const Hour = Number(timeArr[0]);
  const Minutes = Number(timeArr[1]);

  return (Hour - 6) * 75 + (Minutes / 60) * 75;
};

const calcHeight = (startTime, endTime) => {
  const timeStartArr = startTime.split(':');
  const timeEndArr = endTime.split(':');
  const HourStart = Number(timeStartArr[0]);
  const HourEnd = Number(timeEndArr[0]);
  const MinutesStart = Number(timeStartArr[1]);
  const MinutesEnd = Number(timeEndArr[1]);

  const dateStart = new Date();
  dateStart.setHours(HourStart);
  dateStart.setMinutes(MinutesStart);
  const dateEnd = new Date();
  dateEnd.setHours(HourEnd);
  dateEnd.setMinutes(MinutesEnd);

  console.log(
    'calcHeight',
    HourStart,
    HourEnd,
    MinutesStart,
    MinutesEnd,
    dateEnd.getTime(),
    dateStart.getTime()
  );

  return ((dateEnd.getTime() - dateStart.getTime()) / 60 / 60 / 1000) * 72;
};

const isOverTime = (startTime) => {
  const timeStartArr = startTime.split(':');
  const HourStart = Number(timeStartArr[0]);
  const MinutesStart = Number(timeStartArr[1]);
  const dateStart = new Date();
  dateStart.setHours(HourStart);
  dateStart.setMinutes(MinutesStart);
  const nowDateHours = new Date();

  return dateStart.getTime() < nowDateHours.getTime();
};

const goDetail = (item) => {
  const { useble, resourceId, pubId } = item;
  console.log('goDetail', useble, resourceId, pubId);
  /** 用途 4   课程6  比赛 8 */
};

onMounted(() => {
  console.log('schedule onMounted', stadiumId.value);
  getActivityInfo(dateInfo[nowIndex.value]);
});
</script>

<style lang="scss" scoped>
.scheduleContainer {
  .dateInfo {
    padding-bottom: 16rpx;
    white-space: nowrap;
    .dateContainer {
      @include flex-start;
      flex-wrap: nowrap;
      margin-left: 40rpx;
      height: 64rpx;
      .dateItem {
        &.active {
          &::after {
            content: '';
            position: absolute;
            bottom: -8rpx;
            left: 44%;
            transform: translateX(-50%);
            width: 48rpx;
            height: 8rpx;
            background: #ff6829;
            border-radius: 4rpx;
          }
          font-weight: 600;
          color: #333333;
        }
        font-size: 28rpx;
        color: #a0a0a0;
        line-height: 44rpx;
        padding-right: 40rpx;
        display: inline-block;
        position: relative;
        flex: none;
        height: 48rpx;
      }
    }
  }
  .placeInfo {
    padding: 12rpx 0 32rpx;
    border-bottom: 2rpx solid #eeeeee;
    .placeContainer {
      @include flex-start;
      flex-wrap: nowrap;
      margin-left: 40rpx;
      .placeItem {
        &.active {
          font-weight: 600;
          color: #ff6829;
        }
        font-size: 28rpx;
        color: #a0a0a0;
        line-height: 44rpx;
        margin-right: 44rpx;
      }
    }
  }
  .main {
    width: 100%;
    height: 684rpx;
    .scheduleBg {
      position: relative;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 1152rpx;
      background: url('https://moth-admin-vue.webdyc.com/mothApi/little-moth-server/moth/file/mp/bg/schedule-bg.png')
        0 0 no-repeat;
      background-size: contain;
    }
    .activityBlock {
      position: absolute;
      left: 132rpx;
      z-index: 10;
      border-radius: 16rpx;
      padding: 16rpx 14rpx;
      width: 578rpx;
      .title {
        font-size: 28rpx;
        font-weight: 600;
        line-height: 44rpx;
      }
      .info {
        @include flex-start;
        margin-top: 8rpx;
        font-size: 24rpx;
        line-height: 40rpx;
        .icon {
          width: 32rpx;
          height: 32rpx;
          margin-left: 8rpx;
        }
      }
    }
  }
}
</style>
