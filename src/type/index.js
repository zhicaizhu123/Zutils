// 获取各数据数据类型
export const isType = type => val =>
  Object.prototype.toString.call(val) === `[object ${type}]`;

// 判断是否为对象
export const isObject = val =>
  typeof val === "function" || (typeof val === "object" && !!val);

// 判断是否为null或undefined
export const isEmpty = val => isNull(val) || isUndefined(val);

// 判断是否为{}空对象
export const isEmptyObject = val =>
  isObject(val) && JSON.stringify(val) == "{}";

// 判断是否为数组
export const isArray = val => Array.isArray(val);

// 判断是否为参数列
export const isArguments = isType("Arguments");

// 判断是否为Null类型
export const isNull = isType("Null");

// 判断是否为Number类型
export const isNumber = isType("Number");

// 判断是否为String类型
export const isString = isType("String");

// 判断是否为Function类型
export const isFunction = isType("Function");

// 判断是否为Promise类型
export const isPromise = isType("Promise");

// 判断是否为Date类型
export const isDate = isType("Date");

// 判断是否为RegExp类型
export const isRegExp = isType("RegExp");

// 判断是否为Map类型
export const isMap = isType("Map");

// 判断是否为Set类型
export const isSet = isType("Set");

// 判断是否为Symbol类型
export const isSymbol = isType("Symbol");

// 判断是否为Error类型
export const isError = isType("Error");

// 判断是否为Undefined类型
export const isUndefined = isType("Undefined");

// 判断是否为NaN
export const isNaN = val => Number.isNaN(val);

// 判断是否为DOM元素
export const isElement = val =>
  isObject(HTMLElement)
    ? val instanceof HTMLElement
    : isObject(val) && isString(val.nodeName) && val.nodeType === 1;

export default {
  isType,
  isObject,
  isEmptyObject,
  isEmpty,
  isArray,
  isNumber,
  isString,
  isNull,
  isUndefined,
  isNaN,
  isArguments,
  isSet,
  isMap,
  isSymbol,
  isPromise,
  isError,
  isDate,
  isRegExp,
  isElement
};
