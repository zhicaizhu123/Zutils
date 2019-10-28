import Screenfull from "./screenfull";

/**
 * 节流：用于有连续事件响应，每间隔一定时间触发一次
 *
 * @param {Function} func
 * @param {number} wait 触发长度间隔时间
 * @param {boolean} leading  leading=false首次不会触发(如果触发了多次)
 * @returns
 */
export const throttle = (func, interval, leading) => {
  let previous = 0;
  let timer = null;
  const handler = function(context, args) {
    func.apply(context, args);
  };
  return function() {
    const now = Date.now();
    if (!previous && leading === false) {
      previous = now;
    }
    const remaining = interval - (now - previous);
    timer && clearTimeout(timer);
    if (remaining <= 0) {
      previous = now;
      handler(this, arguments);
    } else {
      timer = setTimeout(handler, remaining, this, arguments);
    }
  };
};

/**
 * 防抖：用于连续事件触发结束后只触发一次
 *
 * @param {Func} func
 * @param {number} wait
 * @param {boolean} immediate 是否立即执行
 * @returns
 */
export const debounce = (func, wait, immediate) => {
  let timer = null;
  const handler = function(context, args) {
    func.apply(context, args);
  };
  return function() {
    if (immediate && !timer) {
      handler(this, arguments);
    }
    timer && clearTimeout(timer);
    timer = setTimeout(handler, wait, this, arguments);
  };
};

/**
 * 拦截Promise处理结果以数组形式返回信息，主要用于async/await
 * 如果成功则返回的第一个元素（错误信息）为null，否则为错误信息
 *
 * 如：
 * async function () {
 *    const [err, res] = await syncPromise(promiseFunc)
 *    if (!err) {
 *      // 成功
 *    } else {
 *      // 失败
 *    }
 * }
 *
 * @export
 * @param {Promise} promise
 * @param {any} error
 * @returns {Array} 第一个元素为错误信息，第二个元素为返回结果
 */
export const syncPromise = (promise, error) =>
  promise
    .then(data => [null, data])
    .catch(err => {
      if (error) {
        Object.assign(err, error);
      }
      return [err, undefined];
    });

// requestAnimationFrame和cancelAnimationFrame兼容封装
export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    animationTimer = setTimeout(callback, 1000 / 60);
  };

export const cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  function() {
    clearTimeout(animationTimer);
  };

/**
 * 延时函数
 *
 * @export
 * @param {*} time
 * @returns
 */
export const delay = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

/**
 * 组合函数
 *
 * @export
 * @param {*} args
 * @returns
 */
export function compose(...args) {
  const start = args.length - 1; // 倒序调用
  return function() {
    let i = start;
    let result = args[start].apply(this, args);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

/**
 * 复制到剪切板
 *
 * @export
 * @param {string} str 需要复制的文本
 * @returns
 */
export const copy = str =>
  new Promise((resolve, reject) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    let isSuccess = false;
    if (document.execCommand && document.execCommand("copy")) {
      document.execCommand("copy");
      document.body.removeChild(el);
      isSuccess = true;
    }
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
    isSuccess ? resolve() : reject("当前浏览器不支持复制API");
  });

// 是否匹配提供的正则表达式规则
export const isRule = rule => val => rule.test(val);

// 是否为合法链接
export const isLink = isRule(
  /((https|http|ftp|rtsp|mms)?:\/\/)(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/
);

// 是否为合法邮箱
export const isEMail = isRule(
  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
);

// 是否为合法手机号码
export const isTel = isRule(/^(\+?0?86-?)?1(3|4|5|6|7|8|9)\d{9}$/);

// 是否为合法固话
export const isLandline = isRule(/^(\d{3,4}-)?\d{7,8}$/);

// 是否为合法身份证
export const isIdCard = isRule(/(^\d{15}$)|(^\d{17}([0-9xX])$)/);

// 是否为合法QQ
export const isQQ = isRule(/^[1-9][0-9]{4,11}$/);

// 是否为合法微信
export const isWechat = isRule(/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/);

// 是否为邮政编码
export const isPost = isRule(/^[1-9]\d{5}(?!\d)$/);

// 是否为汉字
export const isCharacters = isRule(/^[\u4e00-\u9fa5]+$/);

// 全屏功能
export const screenfull = Screenfull;

export default {
  throttle,
  debounce,
  syncPromise,
  requestAnimationFrame,
  cancelAnimationFrame,
  delay,
  compose,
  copy,
  isRule,
  isLink,
  isEMail,
  isTel,
  isLandline,
  isWechat,
  isQQ,
  isIdCard,
  isPost,
  isCharacters,
  screenfull
};
