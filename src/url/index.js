/**
 * 将链接参数转为JSON格式返回
 *
 * @export
 * @param {string} url
 * @returns
 */
export function getParam2Json(url = location.href) {
  const search = url.substring(url.lastIndexOf("?") + 1);
  const result = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (res, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    result[name] = val;
    return res;
  });
  return result;
}

/**
 * 获取链接指定字段名的值
 *
 * @export
 * @param {string} url
 * @param {Array|string} key 指定获取的字段名
 * @returns {any} 如果参数key为数组则返回对象
 */
export function getUrlParam(key, url = location.href) {
  const params = getParam2Json(url);
  if (Array.isArray(key)) {
    let res = {};
    key.forEach(item => {
      res[item] = params[item];
    });
    return res;
  } else if (typeof key === "string") {
    return params[key];
  }
  return void 0;
}

/**
 * @description 转换json为链接参数字符串
 * @param {Object} json
 * @returns {String}
 */
export function getJson2Param(json) {
  if (!json) return "";
  return Object.keys(json)
    .map(key => {
      if (json[key] === void 0) return "";
      return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
    })
    .join("&");
}

export default {
  getParam2Json,
  getJson2Param,
  getUrlParam
};
