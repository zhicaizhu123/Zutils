/**
 * 克隆对象
 *
 * @export
 * @param {*} data
 */
export function clone(data) {}

/**
 * 深克隆对象
 *
 * @export
 * @param {*} data
 */
export function deepClone(data) {}

/**
 * 合并对象
 *
 * @export
 * @param {*} src
 */
export function extend(target, ...args) {
  return Object.assign(target, ...args);
}

function filterKeys(type) {
  return function(obj, keys = []) {
    return Object.keys(obj).reduce((acc, key) => {
      if (type === "keep" ? keys.includes(key) : !keys.includes(key)) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  };
}

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
export function replaceKeys(obj, rules = {}) {
  const keys = Object.keys(rules);
  return Object.keys(obj).reduce((acc, key) => {
    acc[keys.includes(key) ? rules[key] : key] = obj[key];
    return acc;
  }, {});
}

export default {
  clone,
  deepClone,
  extend,
  keepKeys,
  removeKeys,
  replaceKeys
};
