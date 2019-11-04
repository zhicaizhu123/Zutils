import { isArray, isFunction } from "../type";
import { removeKeys } from "../object";

// 从前后遍历数组
const forEachType = (type = "left") => (arr, cb) => {
  const list = type === "left" ? arr : [...arr].reverse();
  list.forEach(cb);
};

/**
 * 判断是否为类数组
 *
 * @export
 * @param {*} val
 * @returns {boolean}
 */
export const isArrayLike = val => "length" in val;

/**
 * 拉平数组
 * @export
 * @param {Array} arr
 * @param {number} [depth=1]
 * @returns {Array}
 */
export const flatten = (arr, depth = 1) =>
  arr.reduce(
    (a, v) =>
      a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v),
    []
  );

// 深度拉平
export const deepFlatten = arr =>
  [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));

/**
 * 数组去重
 *
 * @export
 * @param {Array} arr
 * @returns
 */
export const unique = arr => [...new Set(arr)];

/**
 * 取两个数组的交集
 *
 * @export
 * @param {*} arr1
 * @param {*} arr2
 * @returns
 */
export const intersection = (arr1, arr2) => {
  const arr = new Set(arr1);
  return arr2.filter(item => arr.has(item));
};

/**
 * 取多个数组的交集
 *
 * @export
 * @param {*} args
 * @returns
 */
export const intersectionAll = (...args) =>
  args.reduce((acc, val) => intersection(val, acc));

/**
 * 多个元素的并集
 *
 * @export
 * @param {*} args
 * @returns
 */
export const union = (...args) => unique(flatten(args, 2));

/**
 * 两个数组的差集
 *
 * @export
 * @param {*} arr1
 * @param {*} arr2
 * @returns
 */
export const difference = (arr1, arr2) => {
  const allList = union(arr1, arr2);
  const intersectionList = intersection(arr1, arr2);
  return allList.filter(item => !intersectionList.includes(item));
};

/**
 * 多个数组的差集
 *
 * @export
 * @param {*} args
 * @returns
 */
export const differenceAll = (...args) =>
  args.reduce((acc, val) => difference(val, acc));

/**
 * 将单层级数组转化为树形结构
 * 说明：`parentId`为父元素的唯一标识，`id`为元素的唯一标识，默认为`'id'`, `pid`为元素的父元素标识，默认为`'pid'`，`children`为要生成多层级子元素的字段名，默认为`'children'`
 * @export
 * @param {*} arr
 * @param {number} [parentId=0]
 * @param {*} [{ id = "id", pid = "pid", children = "children" }={}]
 * @returns
 */
export const array2Tree = (
  arr,
  parentId = 0,
  { id = "id", pid = "pid", children = "children" } = {}
) =>
  arr
    .filter(item => item[pid] === parentId)
    .map(item => ({
      ...item,
      [children]: array2Tree(arr, item[id], { id, pid, children })
    }));

/**
 * 树状结构转为一维数组
 * 说明：`id`为每个元素的唯一标识，默认为`'id'`，`children`为多层级的子元素列表字段，默认为`'children'`
 * @export
 * @param {*} tree
 * @param {*} [{ id = "id", pid = "pid", children = "children" }={}]
 * @returns
 */
export const tree2Array = (tree, { id = "id", children = "children" } = {}) => {
  let list = tree.reduce((acc, item) => {
    if (Array.isArray(item[children]) && item[children].length) {
      return [...acc, item, ...tree2Array(item[children], { id, children })];
    }
    return [...acc, item];
  }, []);
  return list.map(item => {
    return removeKeys(item, [children]);
  });
};

/**
 * 根据标识获取树状结构的数据链
 *
 * @param {*} [{
 *   id,
 *   tree = [],
 *   filter = ['id'],
 *   options = {}
 * }={}]
 * @returns
 */
export const getTreeChains = ({ id, tree, filter = ["id"], options = {} }) => {
  let opts = {
    id: "id",
    pId: "pId",
    children: "children"
  };
  opts = { ...opts, ...options };
  let list = tree2Array(tree, {
    id: opts.id,
    children: opts.children
  }).reverse();
  let currentId = id;
  list = list.reduce((acc, item) => {
    if (currentId === item[opts.id]) {
      const chainItem = filter.reduce((subject, key) => {
        subject[key] = item[key];
        return subject;
      }, {});
      acc.unshift(chainItem);
      currentId = item[opts.pId];
    }
    return acc;
  }, []);
  if (filter.length === 1) {
    list = list.map(item => item[filter[0]]);
  }
  return list;
};

/**
 * 数组转为对象
 * 说明：如果数组元素为对象时指定对象的某个唯一字段为key值，没有指定则默认为下标索引值
 * @export
 * @param {Array} arr
 * @param {string} key
 * @returns
 */
export const array2Object = (arr, key) => {
  if (!arr.length) {
    console.warn("传入数组为空");
    return null;
  }
  return arr.reduce((acc, val, index) => {
    acc[key && val[key] ? val[key] : index] = val;
    return acc;
  }, {});
};

/**
 * 类数组转为数组
 *
 * @export
 * @param {*} obj 类数组
 * @returns
 */
export const arrayLike2Array = obj => {
  if (!isArrayLike(obj)) {
    console.warn("当前传入数据不是类数组");
    return [];
  }
  return Array.from(obj);
};

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
export const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (item, index) =>
    arr.slice(size * index, size * (index + 1))
  );

/**
 * 过滤列表中的空数据
 *
 * @export
 * @param {Array} arr
 * @returns {Array}
 */
export const compact = arr => arr.filter(Boolean);

/**
 * 根据条件获取元素的出现次数
 *
 * @export
 * @param {Array} arr
 * @param {*} fn
 * @returns
 */
export const countBy = (arr, fn = item => item) =>
  arr
    .map(item => (isFunction(fn) ? fn(item) : item))
    .reduce((acc, item) => {
      acc[item] = acc[item] ? ++acc[item] : 1;
      return acc;
    }, {});

/**
 * 获取元素的出现次数
 *
 * @export
 * @param {Array} arr
 * @param {*} val
 * @returns
 */
export const countByValue = (arr, val) => countSameBy(arr)[val];

/**
 * 获取指定元素的下标值
 *
 * @export
 * @param {*} arr
 * @param {*} val
 */
export const indexOfAll = (arr, val) =>
  arr.reduce((acc, item, index) => (item === val ? [...acc, index] : acc), []);

/**
 * 随机排序
 *
 * @export
 * @param {*} arr
 * @returns
 */
export const shuffe = arr => {
  const list = [...arr];
  let len = list.length;
  while (len) {
    const i = Math.floor(Math.random() * len--);
    [list[len], list[i]] = [list[i], list[len]];
  }
  return list;
};

/**
 * 随机取数组中数据
 *
 * @export
 * @param {Array} arr
 * @param {number} [size=1]
 * @returns
 */
export const sample = (arr, size = 1) => {
  const list = shuffe(arr);
  return list.slice(0, size);
};

export default {
  isArrayLike,
  flatten,
  deepFlatten,
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
  sample,
  getTreeChains
};
