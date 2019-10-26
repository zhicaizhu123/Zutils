import ResizeObserver from "resize-observer-polyfill";
import { getElement } from "../html";
import Observer from "./observer";

const resizeHandler = function(entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach(fn => {
        fn();
      });
    }
  }
};

/**
 * 添加resize事件
 *
 * @export
 * @param {HTMLElment|string|Window} element
 * @param {Function} fn
 * @returns
 */
export const addResizeListener = (element, fn) => {
  const el = getElement(element, false);
  if (!el) return;
  if (!el.__resizeListeners__) {
    el.__resizeListeners__ = [];
    el.__ro__ = new ResizeObserver(resizeHandler);
    el.__ro__.observe(el);
  }
  el.__resizeListeners__.push(fn);
};

/**
 * 销毁resize事件
 *
 * @export
 * @param {HTMLElment|string|Window} element
 * @param {Function} fn
 * @returns
 */
export const removeResizeListener = (element, fn) => {
  const el = getElement(element, false);
  if (!el || !el.__resizeListeners__) return;
  el.__resizeListeners__.splice(el.__resizeListeners__.indexOf(fn), 1);
  if (!el.__resizeListeners__.length) {
    el.__ro__.disconnect();
  }
};

export const observer = Observer;

export default {
  addResizeListener,
  removeResizeListener,
  observer
};
