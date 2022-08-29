class Translators {
  // 处理 GraphqlQuery 查询出的 分页列表
  translatorGraphqlQueryPageList(res, page, pageSize) {
    const { total } = res?.pageInfo?.[0] || {};
    return {
      list: res.list,
      total,
      page,
      pageSize,
      pages: Math.floor((total + pageSize - 1) / pageSize)
    };
  }

  // 处理使用游标分页
  translatorNextTokenPageList(res) {
    const { token, list, total, pageSize } = res;
    return {
      list,
      next: token,
      pages: token ? Math.floor((total + pageSize - 1) / pageSize) : 1
    };
  }

  // 处理GraphQL的时间问题
  translatorGraphqlQueryTime(time) {
    const nowTime = new Date(time);
    const timestamp2 = new Date(nowTime).valueOf() - 3600000 * 8;
    const dateTime = new Date(timestamp2);

    const Y = dateTime.getFullYear() + '-';
    const M =
      (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1) +
      '-';
    const D = dateTime.getDate() + ' ';
    const h = dateTime.getHours() + ':';
    const m = dateTime.getMinutes() + ':';
    const s = dateTime.getSeconds();
    return Y + M + D + h + m + s;
  }
}

export default new Translators();
