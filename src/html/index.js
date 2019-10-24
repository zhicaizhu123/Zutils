/**
 * 获取元素相对父元素的距离
 *
 * @export
 * @param {*} el
 * @param {*} parent
 */
export function getElementDistance(el, parent) {}

/**
 * 设置元素滚动
 *
 * @export
 * @param {*} el
 * @param {*} [{ position = 0, target }={}]
 */
export function scrollTo(el, { position = 0, target } = {}) {}

/**
 * 滚动到顶部
 *
 * @export
 * @param {*} el
 */
export function scrollToTop(el) {}

/**
 * 滚动到底部
 *
 * @export
 * @param {*} el
 */
export function scrollToBottom(el) {}

/**
 * 为元素添加类名
 *
 * @export
 * @param {*} el
 * @param {*} className
 */
export function addClass(el, className) {}

/**
 * 移除元素的类名
 *
 * @export
 * @param {*} el
 * @param {*} className
 */
export function removeClass(el, className) {}

/**
 * 动态加载js文件
 *
 * @export
 * @param {string} url
 * @returns {Promise}
 */
export function loadJs(url) {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
      script.onreadystatechange = function() {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      script.onload = function() {
        resolve();
      };
    }
    script.src = url;
    document.body.appendChild(script);
  });
}

export default {
  getElementDistance,
  scrollTo,
  scrollToTop,
  scrollToBottom,
  addClass,
  removeClass,
  loadJs
};
