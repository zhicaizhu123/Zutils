/**
 * 节流：用于有连续事件响应，每间隔一定时间触发一次
 *
 * @param {Function} func
 * @param {number} wait 触发长度间隔时间
 * @param {boolean} leading  leading=false首次不会触发(如果触发了多次)
 * @returns
 */
export function throttle(func, interval, leading) {
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
}

/**
 * 防抖：用于连续事件触发结束后只触发一次
 *
 * @param {Func} func
 * @param {number} wait
 * @param {boolean} immediate 是否已经执行
 * @returns
 */
export function debounce(func, wait, immediate) {
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
}

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
export function syncPromise(promise, error) {
  return promise
    .then(data => [null, data])
    .catch(err => {
      if (error) {
        Object.assign(err, error);
      }
      return [err, undefined];
    });
}

// requestAnimationFrame和cancelAnimationFrame兼容封装
export const animationFrame = (function() {
  let animationTimer = null;
  const request = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(callback) {
        animationTimer = setTimeout(callback, 1000 / 60);
      }
    );
  })();

  const cancel = (function() {
    return (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      function() {
        clearTimeout(animationTimer);
      }
    );
  })();
  return {
    request,
    cancel
  };
})();

/**
 * 延时函数
 *
 * @export
 * @param {*} time
 * @returns
 */
export function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

export function compose(...args) {
  const start = args.length - 1; // 倒序调用
  return function() {
    let i = start;
    let result = args[start].apply(this, args);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

export default {
  throttle,
  debounce,
  syncPromise,
  animationFrame,
  delay,
  compose
};
