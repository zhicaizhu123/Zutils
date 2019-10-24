import { requestAnimationFrame, cancelAnimationFrame } from "../utils";
import { isElement, isString } from "../type";

const body = document.documentElement || document.body;

/**
 * 获取元素
 *
 * @param {*} el
 * @returns
 */
export function getElement(el, root = true) {
  if (el instanceof Window) {
    return root ? body : window;
  } else if (isElement(el)) {
    return el;
  } else if (isString(el)) {
    const currentEl = document.querySelector(el);
    return isElement(currentEl) ? currentEl : null;
  }
  console.warn("当前元素不存在");
  return null;
}

/**
 * 获取元素的样式
 *
 * @export
 * @param {HTMLElement|string|Window} el
 * @param {string} style
 * @returns
 */
export function getStyle(el, style) {
  const currentEl = getElement(el);
  if (!currentEl) return;
  return currentEl.currentStyle
    ? currentEl.currentStyle[style]
    : getComputedStyle(currentEl)[style];
}

/**
 * 判断一个元素是否为另一个元素的子元素
 *
 * @export
 * @param {*} parent
 * @param {*} child
 * @returns
 */
export function elementContains(parent, child) {
  const childEl = getElement(child);
  const parentEl = getElement(parent);
  if (!childEl || !parentEl) return;
  return parentEl.contains(childEl);
}

/**
 * 获取元素相对父元素的距离
 *
 * @export
 * @param {HTMLElement|string|Window} el
 * @param {HTMLElement|string|Window} parent
 */
export function getElementOffsetTop(el, parent = body) {
  const currentEl = getElement(el);
  const parentEl = getElement(parent);
  if (!currentEl || !parentEl) return;
  if (!elementContains(parentEl, currentEl)) {
    console.warn("目标元素属于提供元素的子元素");
    return;
  }
  let isSetPosition = false;
  if (getStyle(parentEl, "position") === "staic") {
    parentEl.style.position = "relative";
    isSetPosition = true;
  }
  let offsetTop = el.offsetTop;
  let p = el.offsetParent;
  while (p && p !== parentEl && parentEl.contains(p)) {
    if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
      offsetTop += p.clientTop;
    }
    offsetTop += p.offsetTop;
    p = p.offsetParent;
  }
  if (isSetPosition) {
    parentEl.style.position = "static";
  }
  return offsetTop;
}

/**
 * 设置元素滚动
 *
 * @export
 * @param {HTMLElement|string|Window} [el=body] 滚动条所在元素
 * @param {number} position 目标位置
 * @param {boolean} [isAnimate=true] 是否使用动画
 */
export function scrollTo(el = body, position, isAnimate = true) {
  // offset > 0 => 目标位置再窗口顶部的上方
  // offset < 0 => 目标位置再窗口顶部的下方
  const currentEl = getElement(el);
  if (!currentEl) return;
  const step = position - currentEl.scrollTop > 0 ? 20 : -20;
  let requestId = null;
  function scrollHandler() {
    if (isAnimate && step * (position - currentEl.scrollTop) > 0) {
      if (step * (position - currentEl.scrollTop) > 0) {
        currentEl.scrollTop += step;
        requestId = requestAnimationFrame(scrollHandler);
      } else {
        cancelAnimationFrame(requestId);
      }
    } else {
      currentEl.scrollTop = position;
    }
  }
  scrollHandler();
}

/**
 * 让目标元素滚动到滚动元素的可视范围
 *
 * @export
 * @param {HTMLElement|string|Window} [el=body] 滚动元素
 * @param {HTMLElement|string|Window} target 要滚动到的目标元素
 * @param {boolean} [isAnimate=true]
 * @returns
 */
export function scrollToTarget(el = body, target, isAnimate = true) {
  const currentEl = getElement(el);
  const targetEl = getElement(target);
  if (!currentEl || !targetEl) return;
  const offsetTop = getElementOffsetTop(targetEl, currentEl);
  if (offsetTop === null) {
    console.warn("目标元素属于提供元素的子元素");
  } else {
    scrollTo(currentEl, offsetTop, isAnimate);
  }
}

/**
 * 滚动到顶部
 *
 * @export
 * @param {HTMLElement|string|Window} [el=body] 滚动元素
 * @param {boolean} [isAnimate=true] 是否启动动画
 * @returns
 */
export function scrollToTop(el = body, isAnimate = true) {
  const currentEl = getElement(el);
  if (!currentEl) return;
  scrollTo(currentEl, 0, isAnimate);
}

/**
 * 滚动到底部
 *
 * @export
 * @param {HTMLElement|string|Window} [el=body] 滚动元素
 * @param {boolean} [isAnimate=true] 是否启动动画
 * @returns
 */
export function scrollToBottom(el = body, isAnimate = true) {
  const currentEl = getElement(el);
  if (!currentEl) return;
  scrollTo(currentEl, currentEl.scrollHeight, isAnimate);
}

/**
 * 为元素添加类名
 *
 * @export
 * @param {HTMLElement|string|Window} el
 * @param {string} className
 */
export function addClass(el, className) {
  const currentEl = getElement(el);
  if (!currentEl) return;
  if (!isString(className)) {
    console.warn("类名必须为字符串");
    return;
  }
  if (el.classList) {
    el.classList.add(className);
  } else {
    const list = className.match(/\b\w+\b/g);
    list.push(className);
    el.className = list.join(" ");
  }
}

/**
 * 移除元素的类名
 *
 * @export
 * @param {HTMLElement|string|Window} el
 * @param {string} className
 */
export function removeClass(el, className) {
  const currentEl = getElement(el);
  if (!currentEl) return;
  if (!isString(className)) {
    console.warn("类名必须为字符串");
    return;
  }
  if (el.classList) {
    el.classList.remove(className);
  } else {
    let list = className.match(/\b\w+\b/g);
    list = list.filter(item => item !== className);
    el.className = list.join(" ");
  }
}

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
  addResizeListener,
  removeResizeListener,
  getElement,
  getElementOffsetTop,
  elementContains,
  scrollTo,
  scrollToTop,
  scrollToBottom,
  scrollToTarget,
  addClass,
  removeClass,
  loadJs
};
