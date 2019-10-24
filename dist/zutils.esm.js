function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/**
 * 节流：用于有连续事件响应，每间隔一定时间触发一次
 *
 * @param {Function} func
 * @param {number} wait 触发长度间隔时间
 * @param {boolean} leading  leading=false首次不会触发(如果触发了多次)
 * @returns
 */
function throttle(func, interval, leading) {
  var previous = 0;
  var timer = null;

  var handler = function handler(context, args) {
    func.apply(context, args);
  };

  return function () {
    var now = Date.now();

    if (!previous && leading === false) {
      previous = now;
    }

    var remaining = interval - (now - previous);
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

function debounce(func, wait, immediate) {
  var timer = null;

  var handler = function handler(context, args) {
    func.apply(context, args);
  };

  return function () {
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

function syncPromise(promise, error) {
  return promise.then(function (data) {
    return [null, data];
  })["catch"](function (err) {
    if (error) {
      Object.assign(err, error);
    }

    return [err, undefined];
  });
} // requestAnimationFrame和cancelAnimationFrame兼容封装

var animationFrame = function () {
  var animationTimer = null;

  var request = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
      animationTimer = setTimeout(callback, 1000 / 60);
    };
  }();

  var cancel = function () {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function () {
      clearTimeout(animationTimer);
    };
  }();

  return {
    request: request,
    cancel: cancel
  };
}();
/**
 * 延时函数
 *
 * @export
 * @param {*} time
 * @returns
 */

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
function compose() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var start = args.length - 1; // 倒序调用

  return function () {
    var i = start;
    var result = args[start].apply(this, args);

    while (i--) {
      result = args[i].call(this, result);
    }

    return result;
  };
}
var index = {
  throttle: throttle,
  debounce: debounce,
  syncPromise: syncPromise,
  animationFrame: animationFrame,
  delay: delay,
  compose: compose
};

// 获取各数据数据类型
function isType(type) {
  return function (val) {
    return Object.prototype.toString.call(val) === "[object ".concat(type, "]");
  };
} // 是否匹配提供的正则表达式规则

function isRule(rule) {
  return function (val) {
    return rule.test(val);
  };
} // 判断是否为对象

function isObject(val) {
  var type = _typeof(val);

  return type === "function" || type === "object" && !!obj;
}
function isEmpty(val) {
  return isNull(val) || isUndefined(val);
}
function isEmptyObject(val) {
  return isObject(val) && JSON.stringify(val) == "{}";
} // 判断是否为数组

function isArray(val) {
  return Array.isArray ? Array.isArray(val) : isType("Array")(val);
} // 判断是否为参数列

var isArguments = isType("Arguments"); // 判断是否为Null类型

var isNull = isType("Null"); // 判断是否为Number类型

var isNumber = isType("Number"); // 判断是否为String类型

var isString = isType("String"); // 判断是否为Function类型

var isFunction = isType("Function"); // 判断是否为Promise类型

var isPromise = isType("Promise"); // 判断是否为Date类型

var isDate = isType("Date"); // 判断是否为RegExp类型

var isRegExp = isType("RegExp"); // 判断是否为Map类型

var isMap = isType("Map"); // 判断是否为Set类型

var isSet = isType("Set"); // 判断是否为Symbol类型

var isSymbol = isType("Symbol"); // 判断是否为Error类型

var isError = isType("Error"); // 判断是否为Undefined类型

var isUndefined = isType("Undefined"); // 判断是否为NaN

function isNaN(val) {
  return isNumber(val) && isNaN(val);
} // 判断是否为DOM元素

function isElement(val) {
  return isObject(HTMLElement) ? val instanceof HTMLElement : isObject(val) && isString(val.nodeName) && val.nodeType === 1;
} // 是否为合法链接

var isLink = isRule(/link/); // 是否为合法邮箱

var isEMail = isRule(/email/); // 是否为合法手机号码

var isTel = isRule(/tel/); // 是否为合法身份证

var isIdCard = isRule(/idcard/); // 是否为合法QQ

var isQQ = isRule(/qq/); // 是否为合法微信

var isWechat = isRule(/wechat/); // 是否为html字符串

var isHtmlString = isRule(/html/); // 是否为img标签字符串

var isImgTagString = isRule(/img/);
var type = {
  isType: isType,
  isRule: isRule,
  isObject: isObject,
  isEmptyObject: isEmptyObject,
  isEmpty: isEmpty,
  isArray: isArray,
  isNumber: isNumber,
  isString: isString,
  isNull: isNull,
  isUndefined: isUndefined,
  isNaN: isNaN,
  isArguments: isArguments,
  isSet: isSet,
  isMap: isMap,
  isSymbol: isSymbol,
  isPromise: isPromise,
  isError: isError,
  isDate: isDate,
  isRegExp: isRegExp,
  isElement: isElement,
  isLink: isLink,
  isEMail: isEMail,
  isTel: isTel,
  isWechat: isWechat,
  isQQ: isQQ,
  isIdCard: isIdCard,
  isHtmlString: isHtmlString,
  isImgTagString: isImgTagString
};

/**
 * 转化为驼峰值
 *
 * @export
 * @param {string} val
 * @returns
 */
function camelize(val) {
  return val.replace(/[-_]+(.)?/g, function (match, item) {
    return item ? item.toUpperCase() : "";
  });
}
/**
 * 转化为中划线值
 *
 * @export
 * @param {string} val
 * @returns
 */

function dasherize(val) {
  return val.replace(/([A-Z])/g, "-$1"), replace(/_+/g, "-").toLowerCase();
}
/**
 * 根据附加属性生成指定条件的正则表达式
 *
 * @param {object} attrs 附加属性
 * @returns {Array}
 */

function getAttrsReg(attrs) {
  var attrsReg = [];
  Object.keys(attrs).forEach(function (key) {
    if (attrs[key]) {
      attrsReg.push(new RegExp("".concat(key, "\\s*=\\s*(['\"])").concat(attrs[key], "\\1"), "gim"));
    }
  });
  return attrsReg;
}
/**
 * 通过附加属性的筛选获取元素列表
 *
 * @param {Array}} list 元素列表
 * @param {object} attrs 附加属性值
 * @returns {Array}
 */


function getResultByAttr(list, attrs) {
  var result = _toConsumableArray(list);

  var attrsReg = getAttrsReg(attrs);
  attrsReg.forEach(function (attrReg) {
    var res = [];
    result.forEach(function (item) {
      if (attrReg.test(item)) {
        res.push(item);
      }
    });
    result = res;
  });
  return result;
}
/**
 * 从文本中获取指定条件的标签
 *
 * @export
 * @param {source: string, tag: str, attrs?: object}
 * source: 需要解析的源文本
 * tag: 需要解析元素的tagName
 * attrs: 附加属性添加更快查询解析元素
 * @returns {Array}
 */


function getTagfromHtmlString() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      source = _ref.source,
      tag = _ref.tag,
      _ref$attrs = _ref.attrs,
      attrs = _ref$attrs === void 0 ? {} : _ref$attrs;

  if (!source) {
    console.warn("请添加source字段");
    return [];
  }

  if (!tag) {
    console.warn("请添加tag字段");
    return [];
  }

  var singleTags = "br,hr,img,input,param,meta,link".split(",");
  var reg = new RegExp("<".concat(tag, "[^<>]*>[\\d\\D]*</").concat(tag, ">"), "gmi"); // 判断是否为但标签

  if (singleTags.includes(tag)) {
    reg = new RegExp("<".concat(tag, "[^<>]*/?>"), "gmi");
  }

  var result = source.match(reg);

  if (result && result.length && attrs && Object.keys(attrs).length) {
    result = getResultByAttr(result, attrs);
  }

  return result || [];
}
/**
 * 获取html文本中某类元素指定属性的属性值
 *
 * @export
 * @param {source: string, tag: str, attr: string, attrs?: object}
 * source: 需要解析的源文本
 * tag: 需要解析元素的tagName
 * attr: 需要获取属性值的解析元素的属性名称
 * attrs: 附加属性添加更快查询解析元素
 * @returns {Array}
 */

function getAttrFromHtmlString() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      source = _ref2.source,
      tag = _ref2.tag,
      attr = _ref2.attr,
      _ref2$attrs = _ref2.attrs,
      attrs = _ref2$attrs === void 0 ? {} : _ref2$attrs;

  if (!source) {
    console.warn("请添加source字段");
    return [];
  }

  if (!tag) {
    console.warn("请添加tag字段");
    return [];
  }

  if (!attr) {
    console.warn("请添加attr字段");
    return [];
  }

  var result = getTagfromHtmlString({
    source: source,
    tag: tag,
    attrs: attrs
  });
  var attrList = result.map(function (item) {
    var reg = new RegExp("".concat(attr, "\\s*=\\s*(['\"])([^\\1]+?)\\1"), "gmi");
    var list = reg.exec(item);

    if (list && list.length > 1) {
      return list[2];
    }

    return "";
  });
  return attrList;
}
/**
 * 获取html文本中转化为html后的纯文本信息
 *
 * @export
 * @param {string} source 需要解析的源文本
 */

function getPureTextFromHtmlString(source) {
  return source.replace(/<style[^>]*>[\d\D]*<\/style>|<[^>]*>/g, "");
}
var string = {
  camelize: camelize,
  dasherize: dasherize,
  getTagfromHtmlString: getTagfromHtmlString,
  getAttrFromHtmlString: getAttrFromHtmlString,
  getPureTextFromHtmlString: getPureTextFromHtmlString
};

/**
 * 获取元素相对父元素的距离
 *
 * @export
 * @param {*} el
 * @param {*} parent
 */
function getElementDistance(el, parent) {}
/**
 * 设置元素滚动
 *
 * @export
 * @param {*} el
 * @param {*} [{ position = 0, target }={}]
 */

function scrollTo(el) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$position = _ref.position,
      target = _ref.target;
}
/**
 * 滚动到顶部
 *
 * @export
 * @param {*} el
 */

function scrollToTop(el) {}
/**
 * 滚动到底部
 *
 * @export
 * @param {*} el
 */

function scrollToBottom(el) {}
/**
 * 为元素添加类名
 *
 * @export
 * @param {*} el
 * @param {*} className
 */

function addClass(el, className) {}
/**
 * 移除元素的类名
 *
 * @export
 * @param {*} el
 * @param {*} className
 */

function removeClass(el, className) {}
/**
 * 动态加载js文件
 *
 * @export
 * @param {string} url
 * @returns {Promise}
 */

function loadJs(url) {
  return new Promise(function (resolve) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState === "loaded" || script.readyState === "complete") {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      script.onload = function () {
        resolve();
      };
    }

    script.src = url;
    document.body.appendChild(script);
  });
}
var html = {
  getElementDistance: getElementDistance,
  scrollTo: scrollTo,
  scrollToTop: scrollToTop,
  scrollToBottom: scrollToBottom,
  addClass: addClass,
  removeClass: removeClass,
  loadJs: loadJs
};

/**
 * 克隆对象
 *
 * @export
 * @param {*} data
 */
function clone(data) {}
/**
 * 深克隆对象
 *
 * @export
 * @param {*} data
 */

function deepClone(data) {}
/**
 * 合并对象
 *
 * @export
 * @param {*} src
 */

function extend(target) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return Object.assign.apply(Object, [target].concat(args));
}

function filterKeys(type) {
  return function (obj) {
    var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return Object.keys(obj).reduce(function (acc, key) {
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


var keepKeys = filterKeys("keep");
/**
 * 删除给定字段
 *
 * @export
 * @param {*} obj
 * @param {*} [keys=[]]
 * @returns
 */

var removeKeys = filterKeys("remove");
/**
 * 替换对象字段名
 *
 * @export
 * @param {*} obj
 * @param {*} [rule={}] 键值对，key 为 原字段，value为替换字段
 * @returns
 */

function replaceKeys(obj) {
  var rules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var keys = Object.keys(rules);
  return Object.keys(obj).reduce(function (acc, key) {
    acc[keys.includes(key) ? rules[key] : key] = obj[key];
    return acc;
  }, {});
}
var object = {
  clone: clone,
  deepClone: deepClone,
  extend: extend,
  keepKeys: keepKeys,
  removeKeys: removeKeys,
  replaceKeys: replaceKeys
};

function forEachType() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "left";
  return function (arr, cb) {
    var list = type === "left" ? arr : _toConsumableArray(arr).reverse();
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


function isArrayLike(val) {
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

function flatten(arr) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return arr.reduce(function (result, item) {
    if ((level > 1 || level === 0) && isArray(item)) {
      return [].concat(_toConsumableArray(result), _toConsumableArray(flatten(item, level > 1 ? level - 1 : 0)));
    }

    return [].concat(_toConsumableArray(result), [item]);
  }, []);
}
/**
 * 数组去重
 *
 * @export
 * @param {Array} arr
 * @returns
 */

function unique(arr) {
  return _toConsumableArray(Set(arr));
}
/**
 * 取两个数组的交集
 *
 * @export
 * @param {*} arr1
 * @param {*} arr2
 * @returns
 */

function intersection(arr1, arr2) {
  var arr = new Set(arr1);
  return arr2.filter(function (item) {
    return arr.has(item);
  });
}
/**
 * 取多个数组的交集
 *
 * @export
 * @param {*} args
 * @returns
 */

function intersectionAll() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.reduce(function (acc, val) {
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

function union() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

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

function difference(arr1, arr2) {
  var allList = union(arr1, arr2);
  var intersectionList = intersection(arr1, arr2);
  return allList.filter(function (item) {
    return !intersectionList.includes(item);
  });
}
/**
 * 多个数组的差集
 *
 * @export
 * @param {*} args
 * @returns
 */

function differenceAll() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return args.reduce(function (acc, val) {
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

function array2Tree(arr) {
  var parentId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? "id" : _ref$id,
      _ref$pid = _ref.pid,
      pid = _ref$pid === void 0 ? "pid" : _ref$pid,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? "children" : _ref$children;

  return arr.filter(function (item) {
    return item[pid] === parentId;
  }).map(function (item) {
    return _objectSpread2({}, item, _defineProperty({}, children, array2Tree(arr, item[id], {
      id: id,
      pid: pid,
      children: children
    })));
  });
}
/**
 * 数组转为对象
 *
 * @export
 * @param {Array} arr
 * @param {string} key // 如果数组元素为对象时指定对象的某个唯一字段为key值
 * @returns
 */

function array2Object(arr, key) {
  if (!arr.length) {
    console.warning("传入数组为空");
    return null;
  }

  return arr.reduce(function (acc, val, index) {
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

function arrayLike2Array(obj) {
  if (!isArrayLike(obj)) {
    console.warning("当前传入数据不是类数组");
    return [];
  }

  return Array.from(obj);
} // forEach 元素由 左->右 执行

var forEach = forEachType(); // forEach 元素由 右->左 执行

var forEachRight = forEachType("right");
/**
 * 根据给定长度进行分组
 *
 * @export
 * @param {Array} arr
 * @param {number} size 每组最大长度
 * @returns {Array}
 */

function chunk(arr, size) {
  return Array.from({
    length: Math.ceil(arr.length / size)
  }, function (item, index) {
    return arr.slice(size * index, size * (index + 1));
  });
}
/**
 * 根据条件获取元素的出现次数
 *
 * @export
 * @param {Array} arr
 * @param {*} fn
 * @returns
 */

function countBy(arr) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (item) {
    return item;
  };
  return arr.map(function (item) {
    return isFunction(fn) ? fn(item) : item;
  }).reduce(function (acc, item) {
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

function countByValue(arr, val) {
  return countSameBy(arr)[val];
}
/**
 * 获取指定元素的下标值
 *
 * @export
 * @param {*} arr
 * @param {*} val
 */

function indexOfAll(arr, val) {
  return arr.reduce(function (acc, item, index) {
    return item === val ? [].concat(_toConsumableArray(acc), [index]) : acc;
  }, []);
}
/**
 * 随机排序
 *
 * @export
 * @param {*} arr
 * @returns
 */

function shuffe(arr) {
  var list = _toConsumableArray(arr);

  var len = list.length;

  while (len) {
    var i = Math.floor(Math.random() * len--)[(list[len], list[i])] = [list[i], list[len]];
  }

  return list;
}
function sample(arr) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var list = shuffe(arr);
  return list.slice(0, size);
}
var array = {
  isArrayLike: isArrayLike,
  flatten: flatten,
  intersection: intersection,
  intersectionAll: intersectionAll,
  union: union,
  difference: difference,
  differenceAll: differenceAll,
  array2Tree: array2Tree,
  array2Object: array2Object,
  arrayLike2Array: arrayLike2Array,
  unique: unique,
  forEach: forEach,
  forEachRight: forEachRight,
  chunk: chunk,
  countBy: countBy,
  countByValue: countByValue,
  indexOfAll: indexOfAll,
  shuffe: shuffe,
  sample: sample
};

var isPlatform = function isPlatform(regexp) {
  return regexp.test(navigator.userAgent);
};

var isMobile = isPlatform(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
var isPc = !isMobile();
var isIPhone = isPlatform(/\(i[^;]+;( U;)? CPU.+Mac OS X/gi);
var isIPad = isPlatform(/iPad/gi);
var isAndroid = isPlatform(/android|adr/gi);
var isChrome = isPlatform(/Chrome/i);
var isFirefox = isPlatform(/Firefox/i);
var isSafari = isPlatform(/Safari/i);
var isMicroMessenger = isPlatform(/MicroMessenger/i);
var isQQBrowser = isPlatform(/qq/gi);
var isWeibo = isPlatform(/weibo/gi);
var isDevice = function isDevice(regexp) {
  return isPlatform(regexp);
};
var platform = {
  isMobile: isMobile,
  isPc: isPc,
  isIPhone: isIPhone,
  isIPad: isIPad,
  isAndroid: isAndroid,
  isChrome: isChrome,
  isFirefox: isFirefox,
  isSafari: isSafari,
  isMicroMessenger: isMicroMessenger,
  isQQBrowser: isQQBrowser,
  isWeibo: isWeibo,
  isDevice: isDevice
};

var store = {};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// 获取数据类型
function isType$1(type) {
  return function (val) {
    return Object.prototype.toString.call(val) === "[object ".concat(type, "]");
  };
}

function array2Object$1(arr, key) {
  if (!arr.length) {
    console.warning("传入数组为空");
    return null;
  }

  return arr.reduce(function (acc, val, index) {
    acc[key && val[key] ? val[key] : index] = val;
    return acc;
  }, {});
} // 判断是否为Date类型

var isDate$1 = isType$1("Date"); // 判断是否为String类型

var isString$1 = isType$1("String"); // 判断是否为Undefined类型

var isUndefined$1 = isType$1("Undefined");
var isNumber$1 = isType$1("Number");

var INVALID_DATE = "Invalid Date";
var MS_PER_SECOND = 1000;
var MS_PER_MINUTE = 60 * MS_PER_SECOND;
var MS_PER_HOUR = 60 * MS_PER_MINUTE;
var MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;
var RULE_PARSE = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/;
var RULE_FORMAT = /\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|SS{1,2}/g;
var SET_API_HASH = {
  year: "setFullYear",
  month: "setMonth",
  date: "setDate",
  hour: "setHours",
  minute: "setMinutes",
  second: "setSeconds",
  millisecond: "setMilliseconds"
};
var WEEK_HASH = array2Object$1("日一二三四五六".split(""));
var UNIT_HASH = {
  y: "year",
  M: "month",
  D: "day",
  H: "hour",
  m: "minute",
  s: "second",
  ms: "millisecond"
};

var getUnit = function getUnit(unit) {
  return UNIT_HASH[unit] || unit.toLowerCase();
};

var dateInstance = function dateInstance(date) {
  return date ? new Date(date) : new Date();
};

var startOfYMDHandler = function startOfYMDHandler(y, m, d) {
  return y < 100 && y >= 0 ? new Date(y + 400, m, d) - MS_PER_400_YEARS : new Date(y, m, d).valueOf();
};

var Zdate = function Zdate(date) {
  if (date instanceof ZDate) {
    return date;
  }

  var config = {};

  if (date) {
    config.date = date;
  }

  return new ZDate(config);
};

var ZDate =
/*#__PURE__*/
function () {
  function ZDate(config) {
    _classCallCheck(this, ZDate);

    this._date = this.parse(config.date);
  }

  _createClass(ZDate, [{
    key: "parse",
    value: function parse(date) {
      if (isUndefined$1(date)) return dateInstance();
      if (isDate$1(date) || isNumber$1(date)) return dateInstance(date);

      if (isString$1(date) && RULE_PARSE.test(date)) {
        var list = date.match(RULE_PARSE);

        if (list) {
          return new Date(list[1], list[2] - 1, list[3] || 1, list[4] || 0, list[5] || 0, list[6] || 0, list[7] || 0);
        }
      }

      return dateInstance();
    }
  }, {
    key: "format",
    value: function format() {
      var _format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "YYYY-MM-DD HH:mm:ss";

      var year = this.year,
          month = this.month,
          date = this.date,
          hour = this.hour,
          minute = this.minute,
          second = this.second,
          millisecond = this.millisecond,
          week = this.week;

      var formatHandler = function formatHandler(val, size) {
        return size > 0 ? String(val).padStart(size, "0") : String(val);
      };

      var matches = {
        YY: formatHandler(year).slice(-2),
        YYYY: formatHandler(year),
        M: formatHandler(month + 1),
        MM: formatHandler(month + 1, 2),
        D: formatHandler(date),
        DD: formatHandler(date, 2),
        d: week,
        dd: WEEK_HASH[week],
        H: formatHandler(hour),
        HH: formatHandler(hour, 2),
        h: formatHandler(hour % 12),
        hh: formatHandler(hour % 12, 2),
        m: formatHandler(minute),
        mm: formatHandler(minute, 2),
        s: formatHandler(second),
        ss: formatHandler(second, 2),
        S: formatHandler(millisecond),
        SS: formatHandler(millisecond, 2)
      };
      return _format.replace(RULE_FORMAT, function (match) {
        return matches[match] || match;
      });
    }
  }, {
    key: "startEnd",
    value: function startEnd(u) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "start";
      if (!u || !this.isValid() || u === "millisecond") return this;
      var _date = this._date,
          year = this.year,
          month = this.month,
          date = this.date;
      var unit = getUnit(u);
      var time;
      var offset = type === "end" ? 1 : 0;
      var childOffset = type === "end" ? -1 : 0;

      var HMS = function HMS(unitLength) {
        if (type === "end") {
          return _date.valueOf() + unitLength - _date.valueOf() % unitLength - 1;
        }

        return Math.floor(_date.valueOf() / unitLength);
      };

      switch (unit) {
        case "year":
          time = startOfYMDHandler(year + offset, 0, 1) + childOffset;
          break;

        case "month":
          time = startOfYMDHandler(year, month + offset, 1) + childOffset;
          break;

        case "day":
          time = startOfYMDHandler(year, month, date + offset) + childOffset;
          break;

        case "hour":
          time = HMS(MS_PER_HOUR);
          break;

        case "minute":
          time = HMS(MS_PER_MINUTE);
          break;

        case "second":
          time = HMS(MS_PER_SECOND);
          break;
      }

      this._date.setTime(time);

      return this;
    }
  }, {
    key: "startOf",
    value: function startOf(u) {
      return this.startEnd(u, "start");
    }
  }, {
    key: "endOf",
    value: function endOf(u) {
      return this.startEnd(u, "end");
    }
  }, {
    key: "addSubtract",
    value: function addSubtract(offset, u, direction) {
      var unit = getUnit(u);
      var deviation = direction > 0 ? offset : -offset;

      this._date[SET_API_HASH[unit]](this[unit] + deviation);
    }
  }, {
    key: "add",
    value: function add(offset) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      this.addSubtract(offset, u, 1);
      return this;
    }
  }, {
    key: "subtract",
    value: function subtract(offset) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      this.addSubtract(offset, u, -1);
      return this;
    }
  }, {
    key: "getTime",
    value: function getTime(date) {
      return dateInstance(this.parse(date)).getTime();
    }
  }, {
    key: "isLeapYear",
    value: function isLeapYear(date) {
      var currentDate = this.parse(date);
      var year = currentDate.getFullYear();
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }
  }, {
    key: "isBefore",
    value: function isBefore(date) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      return this.endOf(u) > this.parse(date);
    }
  }, {
    key: "isAfter",
    value: function isAfter(date) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      return this.startOf(u) > this.parse(date);
    }
  }, {
    key: "isSame",
    value: function isSame(date) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      return this.startOf(u) === Zdate(date).startOf(u);
    }
  }, {
    key: "isBetween",
    value: function isBetween(date1, date2) {
      var u = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "s";
      var start = this.startOf(u);
      var end = this.endOf(u);
      var d1 = this.parse(date1);
      var d2 = this.parse(date2);
      return start >= d1 && end <= d2 || start >= d2 && end <= d1;
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return !(this._date.toString() === INVALID_DATE);
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return this.getTime();
    }
  }, {
    key: "year",
    get: function get() {
      return this._date.getFullYear();
    }
  }, {
    key: "month",
    get: function get() {
      return this._date.getMonth();
    }
  }, {
    key: "date",
    get: function get() {
      return this._date.getDate();
    }
  }, {
    key: "hour",
    get: function get() {
      return this._date.getHours();
    }
  }, {
    key: "minute",
    get: function get() {
      return this._date.getMinutes();
    }
  }, {
    key: "second",
    get: function get() {
      return this._date.getSeconds();
    }
  }, {
    key: "millisecond",
    get: function get() {
      return this._date.getMilliseconds();
    }
  }, {
    key: "week",
    get: function get() {
      return this._date.getDay();
    }
  }]);

  return ZDate;
}();

var zutil = utils;
var ztype = type;
var zstring = string;
var zhtml = html;
var zarray = array;
var zobject = object;
var zplatform = platform;
var zstore = store;
var zdate = Zdate;
var index$1 = _objectSpread2({}, zutil, {}, ztype, {}, zstring, {}, zhtml, {}, zarray, {}, zobject, {}, zplatform, {}, zstore, {
  zdate: zdate
});

export default index$1;
export { index as utils, zarray, zdate, zhtml, zobject, zplatform, zstore, zstring, ztype, zutil };
