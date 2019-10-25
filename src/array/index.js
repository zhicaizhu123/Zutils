import { isArray, isFunction } from "../type";
import { removeKeys } from "../object";

function forEachType(type = "left") {
  return function(arr, cb) {
    const list = type === "left" ? arr : [...arr].reverse();
    list.forEach(cb);
  };
}

/**
 * 判断是否为类数组
 *
 * @export
 * @param {*} val
 * @returns {boolean}
 */
export function isArrayLike(val) {
  return "length" in val;
}

/**
 * 拉平数组
 *
 * @export
 * @param {Array} arr
 * @param {number} [level=1] level=0表示为全部层级拉平
 * @returns {Array}
 */
export function flatten(arr, level = 1) {
  return arr.reduce((result, item) => {
    if ((level > 1 || level === 0) && isArray(item)) {
      return [...result, ...flatten(item, level > 1 ? level - 1 : 0)];
    }
    return [...result, item];
  }, []);
}

/**
 * 数组去重
 *
 * @export
 * @param {Array} arr
 * @returns
 */
export function unique(arr) {
  return [...Set(arr)];
}

/**
 * 取两个数组的交集
 *
 * @export
 * @param {*} arr1
 * @param {*} arr2
 * @returns
 */
export function intersection(arr1, arr2) {
  const arr = new Set(arr1);
  return arr2.filter(item => arr.has(item));
}

/**
 * 取多个数组的交集
 *
 * @export
 * @param {*} args
 * @returns
 */
export function intersectionAll(...args) {
  return args.reduce((acc, val) => {
    return intersection(val, acc);
  });
}

/**
 * 多个元素的并集
 *
 * @export
 * @param {*} args
 * @returns
 */
export function union(...args) {
  return unique(flatten(args, 2));
}

/**
 * 两个数组的差集
 *
 * @export
 * @param {*} arr1
 * @param {*} arr2
 * @returns
 */
export function difference(arr1, arr2) {
  const allList = union(arr1, arr2);
  const intersectionList = intersection(arr1, arr2);
  return allList.filter(item => !intersectionList.includes(item));
}

/**
 * 多个数组的差集
 *
 * @export
 * @param {*} args
 * @returns
 */
export function differenceAll(...args) {
  return args.reduce((acc, val) => {
    return difference(val, acc);
  });
}

/**
 * 将单层级数组转化为树形结构
 *
 * @export
 * @param {*} arr
 * @param {number} [parentId=0]
 * @param {*} [{ id = "id", pid = "pid", children = "children" }={}]
 * @returns
 */
export function array2Tree(
  arr,
  parentId = 0,
  { id = "id", pid = "pid", children = "children" } = {}
) {
  return arr
    .filter(item => item[pid] === parentId)
    .map(item => {
      return {
        ...item,
        [children]: array2Tree(arr, item[id], { id, pid, children })
      };
    });
}

/**
 * 树状结构转为一维数组
 *
 * @export
 * @param {*} tree
 * @param {*} [{ id = "id", pid = "pid", children = "children" }={}]
 * @returns
 */
export function tree2Array(tree, { id = "id", children = "children" } = {}) {
  let list = tree.reduce((acc, item) => {
    if (Array.isArray(item[children]) && item[children].length) {
      return [...acc, item, ...tree2Array(item[children], { id, children })];
    }
    return [...acc, item];
  }, []);
  return list.map(item => {
    return removeKeys(item, [children]);
  });
}

/**
 * 通过searchId查看完整的链条
 *
 * @export
 * @param {*} searchId
 * @param {*} [{ id = "id" }={}]
 * @returns
 */
export function getTreeChainByKey(searchId, { id = "id" } = {}) {
  return [];
}

/**
 * 数组转为对象
 *
 * @export
 * @param {Array} arr
 * @param {string} key // 如果数组元素为对象时指定对象的某个唯一字段为key值
 * @returns
 */
export function array2Object(arr, key) {
  if (!arr.length) {
    console.warn("传入数组为空");
    return null;
  }
  return arr.reduce((acc, val, index) => {
    acc[key && val[key] ? val[key] : index] = val;
    return acc;
  }, {});
}

/**
 * 类数组转为数组
 *
 * @export
 * @param {*} obj 类数组
 * @returns
 */
export function arrayLike2Array(obj) {
  if (!isArrayLike(obj)) {
    console.warn("当前传入数据不是类数组");
    return [];
  }
  return Array.from(obj);
}

// forEach 元素由 左->右 执行
const forEach = forEachType();

// forEach 元素由 右->左 执行
const forEachRight = forEachType("right");

/**
 * 根据给定长度进行分组
 *
 * @export
 * @param {Array} arr
 * @param {number} size 每组最大长度
 * @returns {Array}
 */
export function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (item, index) =>
    arr.slice(size * index, size * (index + 1))
  );
}

/**
 * 过滤给定过滤列表的数据
 *
 * @export
 * @param {Array} arr
 * @returns {Array}
 */
export function compact(arr) {
  return arr.filter(Boolean);
}

/**
 * 根据条件获取元素的出现次数
 *
 * @export
 * @param {Array} arr
 * @param {*} fn
 * @returns
 */
export function countBy(arr, fn = item => item) {
  return arr
    .map(item => (isFunction(fn) ? fn(item) : item))
    .reduce((acc, item) => {
      acc[item] = acc[item] ? ++acc[item] : 1;
      return acc;
    }, {});
}

/**
 * 获取元素的出现次数
 *
 * @export
 * @param {Array} arr
 * @param {*} val
 * @returns
 */
export function countByValue(arr, val) {
  return countSameBy(arr)[val];
}

/**
 * 获取指定元素的下标值
 *
 * @export
 * @param {*} arr
 * @param {*} val
 */
export function indexOfAll(arr, val) {
  return arr.reduce(
    (acc, item, index) => (item === val ? [...acc, index] : acc),
    []
  );
}

/**
 * 随机排序
 *
 * @export
 * @param {*} arr
 * @returns
 */
export function shuffe(arr) {
  const list = [...arr];
  let len = list.length;
  while (len) {
    const i = Math.floor(Math.random() * len--);
    [list[len], list[i]] = [list[i], list[len]];
  }
  return list;
}

/**
 * 随机出去数组数据
 *
 * @export
 * @param {Array} arr
 * @param {number} [size=1]
 * @returns
 */
export function sample(arr, size = 1) {
  const list = shuffe(arr);
  return list.slice(0, size);
}

export default {
  isArrayLike,
  flatten,
  intersection,
  intersectionAll,
  union,
  difference,
  differenceAll,
  array2Tree,
  array2Object,
  arrayLike2Array,
  unique,
  forEach,
  forEachRight,
  chunk,
  countBy,
  countByValue,
  indexOfAll,
  shuffe,
  sample
};
