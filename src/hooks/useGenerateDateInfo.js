const weekDayStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const circleGenerate = (date, nowTimes, times) => {
  let weekStr = '';
  console.log(date, nowTimes, times);
  if (times - nowTimes === 0) {
    weekStr = '今天';
  } else if (times - nowTimes === 1) {
    weekStr = '明天';
  } else if (times - nowTimes === 2) {
    weekStr = '后天';
  } else {
    weekStr = weekDayStr[date.getDay()];
  }
  return {
    date,
    dateStr: `${date.getFullYear()}-${
      date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    }-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`,
    showDateStr: `${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${
      date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    }`,
    monthStr: `${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}`,
    dayStr: `${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`,
    weekStr
  };
};

const useGenerateDateInfo = (times) => {
  let nowTimes = times;
  let nowDate = new Date();
  nowDate.setHours(0);
  nowDate.setMinutes(0);
  nowDate.setSeconds(1);
  const dateList = [];
  while (nowTimes > 0) {
    dateList.push(circleGenerate(nowDate, nowTimes, times));
    nowDate = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000);
    nowTimes -= 1;
  }
  return dateList;
};

export default useGenerateDateInfo;
