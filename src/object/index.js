import { isObject } from "../type";

/**
 * 克隆对象
 *
 * @export
 * @param {*} origin 需要克隆的原对象
 * @param {*} target 克隆结果
 * @returns
 */
export const clone = (origin, result = {}) => {
  for (let prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      result[prop] = origin[prop];
    }
  }
  return result;
};

/**
 * 深克隆对象
 *
 * @export
 * @param {*} obj
 * @param {*} [hash=new WeakMap()]
 * @returns
 */
export const deepClone = (data, weak = new WeakMap()) => {
  if (typeof data !== "object" || data === null) return data;
  let result;
  const Constructor = data.constructor;
  switch (Constructor) {
    case RegExp:
      result = new Constructor(data);
      break;
    case Date:
      result = new Constructor(data.getTime());
      break;
    default:
      if (weak.has(data)) return weak.get(data);
      result = new Constructor();
      weak.set(data, result);
  }
  for (let key in data) {
    result[key] = isObject(data[key]) ? deepClone(data[key], weak) : data[key];
  }
  return result;
};

/**
 * 合并对象
 *
 * @export
 * @param {*} src
 */
export const extend = (target, ...args) => Object.assign(target, ...args);

/**
 * 根据保留/删除类型过滤字段
 *
 * @param {*} type
 * @returns
 */
const filterKeys = type => (obj, keys = []) =>
  Object.keys(obj).reduce((acc, key) => {
    if (type === "keep" ? keys.includes(key) : !keys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});

/**
 * 保留给定字段
 *
 * @export
 * @param {*} obj
 * @param {*} [keys=[]]
 * @returns
 */
export const keepKeys = filterKeys("keep");

/**
 * 删除给定字段
 *
 * @export
 * @param {*} obj
 * @param {*} [keys=[]]
 * @returns
 */
export const removeKeys = filterKeys("remove");

/**
 * 替换对象字段名
 *
 * @export
 * @param {*} obj
 * @param {*} [rule={}] 键值对，key 为 原字段，value为替换字段
 * @returns
 */
export const replaceKeys = (obj, rules = {}) => {
  const keys = Object.keys(rules);
  return Object.keys(obj).reduce((acc, key) => {
    acc[keys.includes(key) ? rules[key] : key] = obj[key];
    return acc;
  }, {});
};

export default {
  clone,
  deepClone,
  extend,
  keepKeys,
  removeKeys,
  replaceKeys
};
