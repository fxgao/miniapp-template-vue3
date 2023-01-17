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
          <view class="date">{{ item.weekStr }}</view>
          <view class="dateNum">
            <view class="small">{{ item.monthStr }}/</view>
            <view class="large">{{ item.dayStr }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <scroll-view :scroll-x="true" class="placeInfo">
      <view class="placeContainer">
        <view
          class="placeItem"
          :class="{ active: index === nowPlaceIndex }"
          v-for="(item, index) in activityInfoList"
          :key="index"
          @click="choosePlace(index)"
        >
          {{ item.placeName }}
        </view>
      </view>
    </scroll-view>
    <scroll-view class="main" :scroll-y="true" :scroll-top="scrollTop">
      <view class="scheduleBg"></view>
      <view
        class="activityBlock"
        :class="{mini: calcHeight(item.start, item.end) < 60}"
        @click="goDetail(item)"
        :style="{
          background: item.isOrder === 1 ? item.textColor : '#F5F5F5',
          color: item.color,
          top: calcTop(item.start) + 4 + 'rpx',
          height: (calcHeight(item.start, item.end) > 60 ? calcHeight(item.start, item.end) - 12 : calcHeight(item.start, item.end) - 2) + 'rpx'
        }"
        v-for="(item, index) in activityList"
        :key="index"
      >
        <view
          class="title"
          :style="{
            color: item.isOrder === 1 ? item.color : '#a0a0a0'
          }"
          >{{ item.title }}</view
        >
        <view
          class="info"
          :style="{
            color: item.isOrder === 1 ? item.color : '#a0a0a0'
          }"
        >
          {{ formatMinite(item.start) }}-{{ formatMinite(item.end) }} {{ item.isOrder === 1 ? '可报名' : '已结束报名' }}
          <view
            v-if="item.isOrder === 1"
            class="icon"
            :style="{
              background: item.color
            }"
          ></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, toRefs, computed, watch } from 'vue';
import { useGenerateDateInfo, useNav } from '@/hooks';
import api from '@/api';

const { to } = useNav();

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
const nowPlaceIndex = ref(-1);
const scrollTop = ref(0);
const loading = ref(false);

const getActivityInfo = async (activityTime) => {
  loading.value = true;
  try {
    const res = await api.stadium.getStadiumActivityList(stadiumId.value, activityTime.dateStr);
    console.log('getStadiumActivityList', res);
    activityInfoList.value = res || [];
    nowPlaceIndex.value = 0;
  } catch (error) {
    uni.showToast({ title: '请求数据出错！', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const activityList = computed(() => {
  if (
    nowPlaceIndex.value < 0 ||
    !activityInfoList.value[nowPlaceIndex.value] ||
    activityInfoList.value[nowPlaceIndex.value].publishPlaceDetails.length === 0
  ) {
    return [];
  }
  return activityInfoList.value[nowPlaceIndex.value].publishPlaceDetails;
});

watch(activityList, (newVal) => {
  if (newVal.length <= 0) return;
  const nowActivity = newVal[newVal.length - 1];
  const nowActivityTop = calcTop(nowActivity.start);
  scrollTop.value = nowActivityTop - 56 + 'rpx';
});

const changeDate = (index) => {
  if (index === nowIndex.value || loading.value) return;
  nowIndex.value = index;
  getActivityInfo(dateInfo[index]);
};

const choosePlace = (index) => {
  nowPlaceIndex.value = index;
};

const calcTop = (startTime) => {
  const timeArr = startTime.split(':');
  const Hour = Number(timeArr[0]);
  const Minutes = Number(timeArr[1]);
  const height = 36 + (Hour - 6 + Minutes / 60) * 115.6;
  console.log('calcTop', Hour, Minutes);
  return height;
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
  const height = ((dateEnd.getTime() - dateStart.getTime()) / 60 / 60 / 1000) * 118;

  console.log(
    'calcHeight',
    HourStart,
    HourEnd,
    MinutesStart,
    MinutesEnd,
    dateEnd.getTime(),
    dateStart.getTime()
  );

  return height;
};

const isOverTime = (startTime) => {
  const timeStartArr = startTime.split(':');
  const HourStart = Number(timeStartArr[0]);
  const MinutesStart = Number(timeStartArr[1]);
  const dateStart = new Date();
  dateStart.setHours(HourStart);
  dateStart.setMinutes(MinutesStart);
  const nowDateHours = new Date();
  console.log(dateStart.getTime(), nowDateHours.getTime());
  return dateStart.getTime() < nowDateHours.getTime();
};

const formatMinite = (time) => {
  const timeArr = time.split(':');
  const Hour = Number(timeArr[0]);
  const Minutes = Number(timeArr[1]);
  return `${Hour}:${Minutes < 10 ? '0' + Minutes : Minutes}`;
};

const goDetail = (item) => {
  /** 用途 4活动  6课程  8比赛 */
  const { useble, resourceId, pubId, actId } = item;
  console.log('goDetail', useble, resourceId, pubId, actId);
  let path = '';
  if (useble === 4) {
    path = '/activity/detail';
    to(path, {
      actId,
      pubId
    });
  } else if (useble === 6) {
    path = '/course/detail';
    to(path, {
      id: actId,
      pubId
    });
  } else if (useble === 8) {
    path = '/match/detail';
    to(path, {
      id: actId,
      pubId
    });
  }
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
      .dateItem {
        &.active {
          color: #fff;
          background: #FF6829;
          .date {
            color: #fff;
          }
          .dateNum {
            .small, .large {
              color: #fff;
            }
          }
        }
        border-radius: 16rpx;
        padding: 36rpx 14rpx 8rpx;
        position: relative;
        background: #F5F5F5;
        margin-right: 32rpx;
        .date {
          position: absolute;
          top: 10rpx;
          left: 12rpx;
          font-size: 20rpx;
          color: #A0A0A0;
          line-height: 20rpx;
        }
        .dateNum {
          @include flex-start;
          align-items: flex-end;
          .small {
            font-size: 20rpx;
            color: #A0A0A0;
            line-height: 20rpx;
            margin-bottom: 6rpx;
          }
          .large {
            font-size: 36rpx;
            color: #A0A0A0;
            line-height: 40rpx;
            font-weight: 700;
          }
        }
      }
    }
  }
  .placeInfo {
    position: relative;
    z-index: 20;
    padding: 12rpx 0 32rpx;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0,0,0,0.05);
    .placeContainer {
      @include flex-start;
      flex-wrap: nowrap;
      margin-left: 40rpx;
      .placeItem {
        &.active {
          font-weight: 700;
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
    height: 728rpx;
    .scheduleBg {
      position: relative;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 2032rpx;
      background: url('https://dele.htennis.net/proApi/little-moth-server/moth/file/mp/bg/schedule-bg.png')
        0 0 no-repeat;
      background-size: contain;
    }
    .activityBlock {
      position: absolute;
      left: 132rpx;
      z-index: 10;
      border-radius: 8rpx;
      padding: 16rpx 14rpx;
      width: 584rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &.mini {
        .title {
          font-size: 28rpx;
          line-height: 28rpx;
        }
        .info {
          margin-top: 0;
          font-size: 24rpx;
          line-height: 24rpx;
        }
      }
      .title {
        @include text-ellipsis;
        font-size: 28rpx;
        font-weight: 700;
        line-height: 44rpx;
        flex: none;
      }
      .info {
        @include flex-start;
        margin-top: 8rpx;
        padding-left: 32rpx;
        font-size: 24rpx;
        line-height: 40rpx;
        color: #a0a0a0;
        .icon {
          width: 32rpx;
          height: 32rpx;
          margin-left: 8rpx;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg t='1671417145989' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2676' width='200' height='200'%3E%3Cpath d='M722.438 510.815c-0.246-0.246-0.513-0.454-0.766-0.69l-299.893-299.892c-14.231-14.24-37.291-14.24-51.529 0-14.241 14.231-14.241 37.291 0 51.529l274.851 274.859-274.849 274.851c-14.241 14.237-14.241 37.301 0 51.532 7.116 7.119 16.436 10.682 25.764 10.682 9.321 0 18.644-3.563 25.763-10.682l299.905-299.901c0.246-0.234 0.51-0.438 0.751-0.678 7.129-7.13 10.685-16.469 10.674-25.804 0.006-9.337-3.55-18.676-10.674-25.804z' fill='%23272636' p-id='2677'%3E%3C/path%3E%3C/svg%3E");
          mask-image: url("data:image/svg+xml,%3Csvg t='1671417145989' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2676' width='200' height='200'%3E%3Cpath d='M722.438 510.815c-0.246-0.246-0.513-0.454-0.766-0.69l-299.893-299.892c-14.231-14.24-37.291-14.24-51.529 0-14.241 14.231-14.241 37.291 0 51.529l274.851 274.859-274.849 274.851c-14.241 14.237-14.241 37.301 0 51.532 7.116 7.119 16.436 10.682 25.764 10.682 9.321 0 18.644-3.563 25.763-10.682l299.905-299.901c0.246-0.234 0.51-0.438 0.751-0.678 7.129-7.13 10.685-16.469 10.674-25.804 0.006-9.337-3.55-18.676-10.674-25.804z' fill='%23272636' p-id='2677'%3E%3C/path%3E%3C/svg%3E");
          -webkit-mask-size: cover;
          mask-size: cover;
        }
      }
    }
  }
}
</style>
