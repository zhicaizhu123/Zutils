# 常用工具类封装

## 前言

由于在实际项目开发中，多个项目会同时需要相同的工具类，于是参考线上的开源项目和技术文章对常用的工具类函数进行封装和拓展；有些工具函数的实现是依赖于其他篇目的工具，读者可以留意。  
项目地址：[https://github.com/zhicaizhu123/Zutils](https://github.com/zhicaizhu123/Zutils)，欢迎 star ！

## 目录
- [安装使用](#%E5%AE%89%E8%A3%85%E4%BD%BF%E7%94%A8)
- [类型篇](#%E7%B1%BB%E5%9E%8B%E7%AF%87)
- [对象篇](#%E5%AF%B9%E8%B1%A1%E7%AF%87)
- [数组篇](#%E6%95%B0%E7%BB%84%E7%AF%87)
- [Html 篇](#html-%E7%AF%87)
- [事件篇](#%E4%BA%8B%E4%BB%B6%E7%AF%87)
- [存储篇](#%E5%AD%98%E5%82%A8%E7%AF%87)
- [平台判断篇](#%E5%B9%B3%E5%8F%B0%E5%88%A4%E6%96%AD%E7%AF%87)
- [链接篇](#%E9%93%BE%E6%8E%A5%E7%AF%87)
- [其他](#%E5%85%B6%E4%BB%96)

## 安装使用
**1. 安装**
``` sh
# 安装依赖
npm install -S zutilsjs
```
**2. 引入**
``` js
// 全局引入
import zutils from 'zutilsjs'

// 按需加载
import {
  ztype, // 类型判断模块
  zarray, // 数组模块
  znumber, // 数字模块
  zstring, // 字符串模块
  zobject, // 对象模块
  zplatform, // 平台判断模块
  zcookie, // cookie模块
  zlocal, // 本地存储localStorage模块
  zsession, // 本地存储sessionStorage模块
  zdate, // 日期模块
  zhtml, // html模块
  zutil // 其他工具模块
} from 'zutilsjs'

```

## 类型篇

**1. 获取各种数据数据类型**

```js
const isType = type => val =>
  Object.prototype.toString.call(val) === `[object ${type}]`;
```

**2. 判断是否为对象**

```js
const isObject = val =>
  typeof val === "function" || (typeof val === "object" && !!val);
```

**3. 判断是否为 `null` 或 `undefined`**

```js
const isEmpty = val => isNull(val) || isUndefined(val);
```

**4. 判断是否为`{}`空对象**

```js
const isEmptyObject = val => isObject(val) && JSON.stringify(val) == "{}";
```

**5. 判断是否为数组**

```js
const isArray = val => Array.isArray(val)
```

**6. 判断是否为参数列**

```js
const isArguments = isType("Arguments");
```

**7. 判断是否为 `Null` 类型**

```js
const isNull = isType("Null");
```

**8. 判断是否为 `Number` 类型**

```js
const isNumber = isType("Number");
```

**9. 判断是否为 `String` 类型**

```js
const isString = isType("String");
```

**10. 判断是否为 `Function` 类型**

```js
const isFunction = isType("Function");
```

**11. 判断是否为 `Promise` 类型**

```js
const isPromise = isType("Promise");
```

**12. 判断是否为 `Date` 类型**

```js
const isDate = isType("Date");
```

**13. 判断是否为 `RegExp` 类型**

```js
const isRegExp = isType("RegExp");
```

**14. 判断是否为 `Map` 类型**

```js
const isMap = isType("Map");
```

**15. 判断是否为 Set 类型**

```js
const isSet = isType("Set");
```

**16. 判断是否为 Symbol 类型**

```js
const isSymbol = isType("Symbol");
```

**17. 判断是否为 `Error` 类型**

```js
const isError = isType("Error");
```

**18. 判断是否为 `Undefined` 类型**

```js
const isUndefined = isType("Undefined");
```

**19. 判断是否为 `NaN`**

```js
const isNaN = val => Number.isNaN(val);
```

**20. 判断是否为 DOM 元素**

```js
const isElement = val =>
  isObject(HTMLElement)
    ? val instanceof HTMLElement
    : isObject(val) && isString(val.nodeName) && val.nodeType === 1;
```

## 对象篇

**1. 克隆对象(浅克隆)**

```js
const clone = (origin, result = {}) => {
  for (let prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      result[prop] = origin[prop];
    }
  }
  return result;
};

// 举例：
const obj = {name: 'ZCoder', info: {name: 'ZCoder'}}
const objClone = clone(obj)
obj === objClone // => false
obj.info === objClone.info // => true
```

**2. 深克隆**
> 说明：使用 WeakMap 存储中间数据，避免递归进入死循环导致栈内存溢出了

```js
const deepClone = (data, weak = new WeakMap()) => {
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

// 举例：
const obj = {name: 'ZCoder', info: {name: 'ZCoder'}}
const objClone = deepClone(obj)
obj === objClone // => false
obj.info === objClone.info // => false
```

**3. 合并对象**

```js
const extend = (target, ...args) => Object.assign(target, ...args);

// 举例：
const obj = {name: 'ZCoder', info: {name: 'ZCoder'}}
extend(obj, {email: '123'})
// => {name: 'ZCoder', info: {name: 'ZCoder'}, email: '123'}
```

**4. 根据保留/删除(keep/remove)类型过滤字段**
> 说明：如果`type='keep'`，则`keys`为要保留的字段名称列表，否则`keys`为要删除的字段名称组成的数组

```js
const filterKeys = type => (obj, keys = []) =>
  Object.keys(obj).reduce((acc, key) => {
    if (type === "keep" ? keys.includes(key) : !keys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
```

**5. 保留给定字段**

```js
const keepKeys = filterKeys("keep");

// 举例：
keepKeys(
  {id: 123, name: 'ZCoder', email: '123'}, 
  ['id', 'name']
) 
// => {id: 123, name: 'ZCoder'}
```

**6. 删除给定字段**

```js
const removeKeys = filterKeys("remove");

// 举例：
keepKeys(
  {id: 123, name: 'ZCoder', email: '123'},
  ['id', 'name']
) 
// => {email: '123'}
```

**7. 替换对象字段名**
> 说明：`rules` 参数为键值对，key-要替换的字段名，value-新的字段名

```js
const replaceKeys = (obj, rules = {}) => {
  const keys = Object.keys(rules);
  return Object.keys(obj).reduce((acc, key) => {
    acc[keys.includes(key) ? rules[key] : key] = obj[key];
    return acc;
  }, {});
};

// 举例：
replaceKeys(
  {id: 123, name: 'ZCoder', email: '123'},
  {name: 'username', email: 'userEmail'}
)
// => {id: 123, username: "ZCoder", userEmail: "123"}
```

## 数组篇

**1. 从左/右（left/right）遍历数组**

```js
const forEachType = (type = "left") => (arr, cb) => {
  const list = type === "left" ? arr : [...arr].reverse();
  list.forEach(cb);
};
```

**2. 左遍历**

```js
const forEach = forEachType();

// 举例：
forEach([1,2,3], (item) => console.log(item))
// => 1
// => 2
// => 3
```

**3. 右遍历**

```js
const forEachRight = forEachType("right");

// 举例：
forEachRight([1,2,3], (item) => console.log(item))
// => 3
// => 2
// => 1
```

**3. 判断是否为类数组**

```js
const isArrayLike = val => "length" in val;

// 举例：
isArrayLike({name: 'ZCoder', length: 1}) // => true
isArrayLike({name: 'ZCoder'}) // => false
```

**4. 拉平数组**
> 说明：`depth`为要最多拉平的层级

```js
const flatten = (arr, depth = 1) =>
  arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v), []);

// 举例：
flatten([1,2,3,[4,[1, 2, 3], 5, 6], [7, 8, 9]], 1) 
// => [1, 2, 3, 4, [1, 2, 3], 5, 6, 7, 8, 9]
```

**5. 深度拉平数组**
``` js
const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));

// 举例：
deepFlatten([1,2,3,[4,[1, 2, 3], 5, 6], [7, 8, 9]])
// => [1, 2, 3, 4, 1, 2, 3, 5, 6, 7, 8, 9]
```

**6. 数组去重**

```js
const unique = arr => [...new Set(arr)];

// 举例：
unique2([1,2,3,4,2,3,1,5 ]) // => [1, 2, 3, 4, 5]
```

**7. 取两个数组的交集**

```js
const intersection = (arr1, arr2) => {
  const arr = new Set(arr1);
  return arr2.filter(item => arr.has(item));
};

// 举例：
intersection([1,2,3,4,5,6], [1,4,5,9,8]) // => [1, 4, 5]
```

**8. 取多个数组的交集**

```js
const intersectionAll = (...args) =>
  args.reduce((acc, val) => intersection(val, acc));

// 举例：
intersectionAll([1,2,3,4,5,6], [1,4,5,9,8], [1, 3, 5]) // => [1, 5]
```

**9. 多个元素的并集(去重))**

```js
const union = (...args) => unique(flatten(args, 1));

// 举例：
union([1, 2, 3], [3, 4, 5], [4, 5 ,7,8]) // => [1, 2, 3, 4, 5, 7, 8]
```

**10. 两个数组的差集**

```js
const difference = (arr1, arr2) => {
  const allList = union(arr1, arr2);
  const intersectionList = intersection(arr1, arr2);
  return allList.filter(item => !intersectionList.includes(item));
};

// 举例：
difference([1, 2, 3], [2, 3, 5, 6]) //=> [1, 5, 6]
```

**11. 多个数组的差集**

```js
const differenceAll = (...args) =>
  args.reduce((acc, val) => difference(val, acc));

// 举例：
differenceAll([1, 2, 3], [2, 3, 4], [4 ,5, 6]) // => [5, 6, 1]
```

**12. 将单层级数组转化为树形结构**
> 说明：`parentId`为父元素的唯一标识，`id`为元素的唯一标识，默认为`'id'`, `pid`为元素的父元素标识，默认为`'pid'`，`children`为要生成多层级子元素的字段名，默认为`'children'`

```js
const array2Tree = (
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

// 举例：
array2Tree(
  [
    {id: 1, parent_id: 0, label: '一级'},
    {id: 2, parent_id: 1, label: '二级'},
    {id: 3, parent_id: 1, label: '二级'}
  ],
  0, 
  {pid: 'parent_id'}
)
// => 
// [
//   {
//     id: 1, 
//     parent_id: 0, 
//     label: '一级', 
//     children: [
//       {id: 2, parent_id: 1, label: '二级', children: []},
//       {id: 3, parent_id: 1, label: '二级', children: []}
//     ]
//   }
// ]
```

**13. 树状结构转为一维数组**
> 说明：`id`为每个元素的唯一标识，默认为`'id'`，`children`为多层级的子元素列表字段，默认为`'children'`

```js
const tree2Array = (tree, { id = "id", children = "children" } = {}) => {
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

// 举例：
tree2Array([
  {
    "id":1,
    "parent_id":0,
    "label":"一级",
    "children":[
      {"id":2,"parent_id":1,"label":"二级","children":[]},
      {"id":3,"parent_id":1,"label":"二级","children":[]},
    ]
  }
])
// =>
// [
//   {"id":1,"parent_id":0,"label":"一级"},
//   {"id":2,"parent_id":1,"label":"二级"},
//   {"id":3,"parent_id":1,"label":"二级"}
// ]
```

**14. 数组转为对象**
> 说明：如果数组元素为对象时指定对象的某个唯一字段为 key 值，没有指定则默认为下标索引值

```js
const array2Object = (arr, key) => {
  if (!arr.length) {
    console.warn("传入数组为空");
    return null;
  }
  return arr.reduce((acc, val, index) => {
    acc[key && val[key] ? val[key] : index] = val;
    return acc;
  }, {});
};

// 举例：
array2Object(
[
  {id: 1, name: '123'},
  {id: 2, name: '456'}
], 
'id'
)
// => {"1":{"id":1,"name":"123"},"2":{"id":2,"name":"456"}}
```
**15. 根据标识获取树状结构的数据链**
> 说明：  
> id：需要查找的层级id  
> tree：树状结构数据  
> filter：需要筛选的字段  
> options：字段名匹配规则 
``` js
const getTreeChains = ({ id, tree, filter = ["id"], options = {} }) => {
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

// 举例：
const treeList = [
  {
    id: 1,
    parentId: 0,
    name: '层级1'
    children: [
      {
        id: 3,
        parentId: 1,
        name: '层级1-1',
        children: [
          {
            id: 5,
            parentId: 3,
            name: '层级1-1-1'
          },
        ]
      },
      {
        id: 4,
        parentId: 1,
        name: '层级1-2'
      }
    ]
  }
  {
    id: 2,
    parentId: 0,
    name: '层级2'
  }
]

treeList(
  5, 
  treeList, 
  ['id'],
  {
    pId: "parentId",
  }
)
// => [1, 3, 5]

treeList(
  5,
  treeList,
  ['id', 'name'],
  {
    pId: "parentId",
  }
)

// => [{id: 1, name: '层级1'}, {id: 3, name: '层级1-1'}, {id: 5, name: '层级1-1-1'}]
```

**16. 类数组转为数组**

```js
const arrayLike2Array = obj => {
  if (!isArrayLike(obj)) {
    console.warn("当前传入数据不是类数组");
    return [];
  }
  return Array.from(obj);
};

// 举例：
arrayLike2Array ({0: '123', 1: '345', length: 2})
// => ["123", "345"]
```

**17. 根据给定长度进行分组**

```js
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (item, index) =>
    arr.slice(size * index, size * (index + 1))
  );

// 举例：
chunk([1, 2, 3 ,4 ,5, 6, 7], 2)
// => [[1,2],[3,4],[5,6],[7]]
```

**18. 过滤列表中的空数据**

```js
const compact = arr => arr.filter(Boolean);

// 举例：
compact([1, , null, 4, '', 5, 0])
// => [1, 4, 5]
```

**19. 根据条件获取元素的出现次数**

```js
const countBy = (arr, fn = item => item) =>
  arr
    .map(item => (isFunction(fn) ? fn(item) : item))
    .reduce((acc, item) => {
      acc[item] = acc[item] ? ++acc[item] : 1;
      return acc;
    }, {});

// 举例：
countBy([1, 2 ,5, 6, 7, 2, 4, 5, 7])
// => {1: 1, 2: 2, 4: 1, 5: 2, 6: 1, 7: 2}
```

**20. 获取指定元素的出现次数**

```js
const countByValue = (arr, val) => countBy(arr)[val];

// 举例：
countByValue([1, 2 ,5, 6, 7, 2, 4, 5, 7], 2) // 获取元素为2的出现次数
// => 2
```

**21. 获取指定元素的下标值**

```js
const indexOfAll = (arr, val) =>
  arr.reduce((acc, item, index) => (item === val ? [...acc, index] : acc), []);

// 举例：
indexOfAll([1, 2 ,5, 6, 7, 2, 4, 5, 7], 7) // 获取7的下标
// => [4, 8]
```

**22. 随机排序**

```js
const shuffe = arr => {
  const list = [...arr];
  let len = list.length;
  while (len) {
    const i = Math.floor(Math.random() * len--);
    [list[len], list[i]] = [list[i], list[len]];
  }
  return list;
};

// 举例：
shuffe([1, 2, 3, 4, 5, 6, 7, 8, 9])
// => [6, 1, 3, 5, 4, 7, 8, 2, 9]
```

**23. 随机取数组中数据**
> 说明：`size`为取出元素的个数
```js
const sample = (arr, size = 1) => {
  const list = shuffe(arr);
  return list.slice(0, size);
};

// 举例：
sample ([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)
// => [4, 6, 8]
```

## 日期篇

可以移步到[https://github.com/zhicaizhu123/Zdate](https://github.com/zhicaizhu123/Zdate)查看更多介绍说明！

## 字符串篇

**1. 转化为驼峰值**

```js
const camelize = val =>
  val.replace(/[-_]+(.)?/g, (match, item) => (item ? item.toUpperCase() : ""));

// 举例：
camelize('-webkit-transform') // => "WebkitTransform"
camelize('webkit-transform') // => "webkitTransform" 
```

**2. 转化为中划线值**

```js
const dasherize = val =>
  val
    .replace(/([A-Z])/g, "-$1")
    .replace(/_+/g, "-")
    .toLowerCase();

// 举例：
dasherize('WebkitTransform') // => "-webkit-transform"
dasherize('webkitTransform') // => "webkit-transform"
```

**3. 根据附加属性生成指定条件的正则表达式**
> 用于以下 html 文本处理

```js
const getAttrsReg = attrs => {
  const attrsReg = [];
  Object.keys(attrs).forEach(key => {
    if (attrs[key]) {
      attrsReg.push(new RegExp(`${key}\\s*=\\s*(['"])${attrs[key]}\\1`, "gim"));
    }
  });
  return attrsReg;
};
```

**4. 通过附加属性的筛选获取元素列表**
> 说明：用于以下 html 文本处理

```js
const getResultByAttr = (list, attrs) => {
  let result = [...list];
  const attrsReg = getAttrsReg(attrs);
  const res = [];
  attrsReg.forEach(attrReg => {
    result.forEach(item => {
      if (attrReg.test(item)) {
        res.push(item);
      }
    });
  });
  return result;
};
```

**5. 从文本中获取指定条件的标签**
> 说明：
> - source: 需要解析的源文本
> - tag: 需要解析元素的 tagName
> - attrs: 附加属性添加更快查询解析元素

```js
const getTagfromHtmlString = ({ source, tag, attrs = {} } = {}) => {
  if (!source) {
    console.warn("请添加source字段");
    return [];
  }
  if (!tag) {
    console.warn("请添加tag字段");
    return [];
  }
  const singleTags = "br,hr,img,input,param,meta,link".split(",");
  let reg = new RegExp(`<${tag}[^<>]*>[\\d\\D]+?<\/${tag}>`, "gmi");
  // 判断是否为但标签
  if (singleTags.includes(tag)) {
    reg = new RegExp(`<${tag}[^<>]*\/?>`, "gmi");
  }
  let result = source.match(reg);
  console.log(result)
  if (result && result.length && attrs && Object.keys(attrs).length) {
    result = getResultByAttr(result, attrs);
  }
  return result || [];
};

// 举例：
// 获取img标签
getTagfromHtmlString({
  source: `
    <div class="container">
      <span>123</span>
      <div>
        <img src="/haha.jpg">
      </div>
    </div>
  `, 
  tag: 'img'
})
// => ["<img src="/haha.jpg">"]

// 获取带有class属性值为'span-item'的span标签
// getTagfromHtmlString({
  source: `
    <div class="container">
      <span class="span-item">123</span>
      <div>
        <img src="/haha.jpg">
        <span class="span-item">456</span>
      </div>
    </div>
  `, 
  tag: 'span', 
  attrs: {class: 'span-item'}
})
// =>
// [
//   "<span class="span-item">123</span>", 
//   "<span class="span-item">456</span>"
// ]
```

**6. 获取 html 文本中某类元素指定属性的属性值**
> 说明：
> - source: 需要解析的源文本
> - tag: 需要解析元素的 tagName
> - attr: 需要获取属性值的解析元素的属性名称
> - attrs: 附加属性添加更快查询解析元素

```js
const getAttrFromHtmlString = ({ source, tag, attr, attrs = {} } = {}) => {
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
  const result = getTagfromHtmlString({ source, tag, attrs });
  const attrList = result.map(item => {
    const reg = new RegExp(`${attr}\\s*=\\s*(['"])([^\\1]+?)\\1`, "gmi");
    const list = reg.exec(item);
    if (list && list.length > 1) {
      return list[2];
    }
    return "";
  });
  return attrList;
};

// 举例：
// 获取img标签的src属性值
getAttrFromHtmlString({
  source: `
    <div class="container">
      <img src="/enen.jpg">
      <div>
        <img src="/haha.jpg">
        <span class="span-item">456</span>
      </div>
    </div>`, 
  tag: 'img', 
  attr: 'src'
})
// => ["/enen.jpg", "/haha.jpg"]
```

**7. 获取 html 文本中转化为 html 后的纯文本信息**

```js
const getPureTextFromHtmlString = source =>
  source.replace(/<style[^>]*>[\d\D]*<\/style>|<[^>]*>/g, "");

// 举例：
getPureTextFromHtmlString('<div class="container"><img src="/enen.jpg"><div><img src="/haha.jpg"><span class="span-item">456</span></div></div>')
// => "456"
```

**8. 转义 html**
> 说明：一般用于防止XSS攻击
```js
const escapeHtml = str => {
  const hash = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  };
  return str.replace(/[&<>'"]/g, tag => hash[tag] || tag);
};

// 举例：
escapeHtml('<div class="container"><img src="/enen.jpg"><div><img src="/haha.jpg"><span class="span-item">456</span></div></div>')
// => "&lt;div class=&quot;container&quot;&gt;&lt;img src=&quot;/enen.jpg&quot;&gt;&lt;div&gt;&lt;img src=&quot;/haha.jpg&quot;&gt;&lt;span class=&quot;span-item&quot;&gt;456&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;"
```

## 数字篇

**1. 将参数转为数组**
> 如果参数本身为数组且第一个元素也为数组则返回第一个元素（用于 min、max
、sum）

```js
const args2Array = args => {
  let params = args;
  if (args.length === 1 && isArray(args[0])) {
    params = args[0];
  }
  return params;
};
```

**2. 汇总**
> 说明：可以以数组形式，或多个参数形式参入，如`sum([1, 2, 3])`或`sum(1, 2, 3)`
```js
const sum = (...args) => {
  const params = args2Array(args);
  return [...params].reduce((acc, val) => acc + val, 0);
};

// 举例：
sum(1, 2, 3) // => 6
sum([1, 2, 3]) // => 6
```

**3. 取平均数**
> 说明：可以以数组形式，或多个参数形式参入，如`sum([1, 2, 3])`或`sum(1, 2, 3)`
```js
const average = (...args) => {
  const params = args2Array(args);
  return sum(...params) / (params.length ? params.length : 1);
};

// 举例：
average(1, 2, 3) // => 2
average([1, 2, 3]) // => 2
```

**4. 取最小值**
> 说明：可以以数组形式，或多个参数形式参入，如`sum([1, 2, 3])`或`sum(1, 2, 3)`
```js
const min = (...args) => {
  const params = args2Array(args);
  return Math.min.apply(null, params);
};

// 举例：
min(3,2,1) // => 1
```

**5. 取最大值**
> 说明：可以以数组形式，或多个参数形式参入，如`sum([1, 2, 3])`或`sum(1, 2, 3)`
```js
const max = (...args) => {
  const params = args2Array(args);
  return Math.max.apply(null, params);
};

// 举例：
max(3, 2,1) // => 3
```

**6. 转化为货币形式**

```js
const toCurrency = num => String(num).replace(/(?!^)(?=(\d{3})+$)/g, ",");

// 举例：
toCurrency(123456789) // => "123,456,789"
```

**7. 截取小数点后几位**
> 说明：默认截取两位小数
```js
const toFixed = (num, size = 2) => (isNumber(num) ? num.toFixed(size) : num);

// 举例：
toFixed(1234567.12345, 2) // => 1234567.12
```

**8. 升序**

```js
const sortAsc = (...args) => {
  const params = args2Array(args);
  return sort(1, params);
};

// 举例：
sortAsc(2, 3,1,4,2,4) // => [1, 2, 2, 3, 4, 4]
```

**9. 降序**

```js
const sortDesc = (...args) => {
  const params = args2Array(args);
  return sort(-1, params);
};

// 举例：
sortDesc (2, 3,1,4,2,4)
// => [4, 4, 3, 2, 2, 1]
```

**10. BigInteger 类型处理**
> 说明：  
请移步到[bignumber.js](https://github.com/alexbardas/bignumber.js)查看更多介绍说明。

## Html 篇

**1. 获取元素** 
> 说明：`root`如果为 `true` 则 `el`=`window` 则会转化为 document.documentElement，否则不做处理；    
> `el`可以是`String`，`HTMLElement`，`Window`类型，如`'.user-name'`,`document.documentElemen`，`window`；   
> 以下html的工具函数的参数`el`，`child`，`parent`， `target`涉及到传入元素相关的遵循这个规则。

```js
// 注意：以下的工具函数有对body的引入都取于这里
const body = document.documentElement || document.body;

const getElement = (el, root = true) => {
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
};
```

**2. 获取元素的样式**
> 说明：  
> el：当前元素  
> style: 要获取样式字段对应的字符串（驼峰值），如："zIndex"
```js
const getStyle = (el, style) => {
  const currentEl = getElement(el);
  if (!currentEl) return;
  return currentEl.currentStyle
    ? currentEl.currentStyle[style]
    : getComputedStyle(currentEl)[style];
};
```

**3. 判断一个元素是否为另一个元素的子元素**
> 说明：  
> parent：父元素  
> child：子元素     
```js
const elementContains = (parent, child) => {
  const childEl = getElement(child);
  const parentEl = getElement(parent);
  if (!childEl || !parentEl) return;
  return parentEl.contains(childEl);
};
```

**4. 获取元素相对父元素的距离**   
> 说明：  
> el：子元素  
> parent: 父元素  
```js
const getElementOffsetTop = (el, parent = body) => {
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
  let offsetTop = currentEl.offsetTop;
  let p = currentEl.offsetParent;
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
};
```

**5. 设置元素滚动**
> 说明：  
> el: 滚动元素  
> position: 滚动元素最终的`scrollTop`   
> isAnimation: 是否启动缓动效果   
```js
const scrollTo = (el = body, position = 0, isAnimate = true) => {
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
};

// 举例：
scrollTo(document.body, 10, true)
```

**6. 让目标元素滚动到滚动元素的可视范围**
> 说明：  
> target: 目标元素
```js
const scrollToTarget = (target, el = body, isAnimate = true) => {
  const currentEl = getElement(el);
  const targetEl = getElement(target);
  if (!currentEl || !targetEl) return;
  const offsetTop = getElementOffsetTop(targetEl, currentEl);
  if (offsetTop === null) {
    console.warn("目标元素属于提供元素的子元素");
  } else {
    scrollTo(currentEl, offsetTop, isAnimate);
  }
};
```

**7. 滚动到顶部**

```js
const scrollToTop = (el = body, isAnimate = true) => {
  const currentEl = getElement(el);
  if (!currentEl) return;
  scrollTo(currentEl, 0, isAnimate);
};
```

**8. 滚动到底部**

```js
const scrollToBottom = (el = body, isAnimate = true) => {
  const currentEl = getElement(el);
  if (!currentEl) return;
  scrollTo(currentEl, currentEl.scrollHeight, isAnimate);
};
```

**9. 判断 className 类型格式是否正确**
> 说明：  
> 该函数用于下面的 `addClass` 和 `removeClass` 以及 `hasClass`工具函数
```js
const checkClassNameType = (el, className) => {
  const currentEl = getElement(el);
  if (!currentEl) return;
  if (className && !isString(className)) {
    console.warn("类名必须为字符串请不能为空");
    return;
  }
  const name = className.match(/\b\w+\b/g) || [];
  return name[0] || "";
};
```

**10. 为元素添加类名**
> 说明：  
> el: 当前元素  
> className: 样式类名字符串（单个）

```js
const addClass = (el, className) => {
  const xlassName = checkClassNameType(el, className);
  if (!xlassName) return;
  if (el.classList) {
    el.classList.add(xlassName);
  } else {
    const list = el.className.match(/\b\w+\b/g) || [];
    list.push(xlassName);
    el.className = list.join(" ");
  }
};
```

**11. 移除元素的类名**
> 说明：  
> el: 当前元素  
> className: 样式类名字符串（单个）

```js
const removeClass = (el, className) => {
  const xlassName = checkClassNameType(el, className);
  if (!xlassName) return;
  if (el.classList) {
    el.classList.remove(xlassName);
  } else {
    const list = el.className.match(/\b\w+\b/g) || [];
    el.className = list.filter(item => item !== xlassName).join(" ");
  }
};
```

**12. 判断是否含有某个类**
> 说明：  
> el: 当前元素  
> className: 样式类名字符串（单个）

```js
const hasClass = (el, className) => {
  const xlassName = checkClassNameType(el, className);
  if (!xlassName) return false;
  if (el.classList) {
    return el.classList.contains(xlassName);
  }
  let list = el.className.match(/\b\w+\b/g) || [];
  return list.includes(xlassName);
};
```

**13. 动态加载 js 文件（异步方式）**

```js
const loadJs = url =>
  new Promise((resolve, reject) => {
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
    script.onerror = function () {
      reject()
    }
    script.src = url;
    document.body.appendChild(script);
  });


// 举例：
loadJs('http://www.baidu.com/a.js')
  .then(() => {
    console.log('加载成功')
  })
  .catch(() => {
    console.log('失败')
  })
```

## 事件篇

**1. 监听元素大小改变事件**
> 说明：实现代码取于 element-ui 源码的代码片段
```js
import ResizeObserver from "resize-observer-polyfill";

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

// 添加resize事件
const addResizeListener = (element, fn) => {
  const el = getElement(element, false);
  if (!el) return;
  if (!el.__resizeListeners__) {
    el.__resizeListeners__ = [];
    el.__ro__ = new ResizeObserver(resizeHandler);
    el.__ro__.observe(el);
  }
  el.__resizeListeners__.push(fn);
};

// 销毁resize事件
const removeResizeListener = (element, fn) => {
  const el = getElement(element, false);
  if (!el || !el.__resizeListeners__) return;
  el.__resizeListeners__.splice(el.__resizeListeners__.indexOf(fn), 1);
  if (!el.__resizeListeners__.length) {
    el.__ro__.disconnect();
  }
};
```

**2. 订阅-发布模式**

```js
class Observer {
  constructor() {
    this.list = {};
  }

  // 订阅
  on(key, fn) {
    if (!this.list[key]) {
      this.list[key] = [];
    }
    this.list[key].push(fn);
  }

  // 发布
  emit(key, ...params) {
    const fns = this.list[key];
    if (!fns || !fns.length) return;
    fns.forEach(fn => {
      fn.call(this, ...params);
    });
  }

  // 取消订阅
  remove(key, fn) {
    const fns = this.list[key];
    if (!fns || !fns.length) return;
    if (!fn) {
      fns = [];
    } else {
      fns = fns.filter(cb => cb !== fn);
    }
  }
}


// 举例：
const observer = new Observer()
const handler = function (data) {
  console.log('Hello ', data)
}
// 订阅
observer.on('myevent', handler)
// 发布
observer.emit('myevent', 'ZCoder') // => 'Hello ZCoder'
// 取消订阅
observer.remove('myevent', handler)

```

## 存储篇

> 因为在项目中我们可能需要对同一类型或者同一模块的数据分模块存储于本地，所以以下本地存储的工具类实现类似于命名空间的方式存储数据。

**1. localStorage/sessionStorage** 
   > 说明：以下只对 localStorage 封装进行讲解，sessionStorage 以此类推。

```js
const Store = window.localStorage;
const storeMap = new Map(); // 存储不同模块本地存储信息列表

// 创建命名空间
function localStore(namespaced = "zstore") {
  if (storeMap.has(namespaced)) {
    return storeMap.get(namespaced);
  }
  storeMap.set(namespaced, new Storage(namespaced));
  return storeMap.get(namespaced);
}

class Storage {
  constructor(namespaced) {
    this.namespaced = namespaced;
    this.state = {}; // 本地存储JSON格式数据
    this.init();
  }

  // 初始化当前命名空间的本地存储信息
  init() {
    try {
      const data = Store.getItem(this.namespaced);
      if (data) {
        this.state = JSON.parse(data);
      }
      this.saveState();
    } catch (err) {
      this.state = {};
      this.saveState();
    }
  }

  // 保存当前命名空间本地存储信息
  saveState() {
    Store.setItem(this.namespaced, JSON.stringify(this.state));
  }

  // 存储字段名对应的内容信息
  setItem(key, data) {
    this.state[key] = data;
    this.saveState();
    return this.state;
  }

  // 获取字段名对应的内容信息
  getItem(key) {
    return this.state[key];
  }

  // 删除字段名对应的内容信息
  removeItem(key) {
    this.state = removeKeys(this.state, [key]);
    this.setState();
    return this.state;
  }

  // 清空当前命名空间的全部存储信息
  clear() {
    this.state = {};
    Store.removeItem(this.namespaced);
  }
}


// 举例：
const store = localStore('mystore')
store.setItem('userInfo', {name: 'ZCoder'}) // => {userInfo: {name: "ZCoder"}}
store.setItem('token', 1234) // => {userInfo: {name: "ZCoder"}, token: 1234}

store.getItem('userInfo') // => {name: "ZCoder"}

store.removeItem('token') // => {userInfo: {name: "ZCoder"}}

store.clear('token')
```

**2. cookie**  
> 说明：cookie的工具类是参考[browser-cookies](https://github.com/voltace/)进行重写，暴露的API于其一致，具体的介绍与使用可以参考[browser-cookies](https://github.com/voltace/)

## 平台判断篇
**1. 通过正则表达式和userAgent判断平台类型（用于以下工具函数）**
``` js
const isPlatform = regexp => {
  return () => regexp.test(navigator.userAgent);
};
```
**2. 是否为移动设备**
``` js
const isMobile = isPlatform(
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
);
```
**3. 是否为PC设备**
``` js
const isPc = () => !isMobile();
```

**4. 是否为iOS**
``` js
const isIOS = isPlatform(/\(i[^;]+;( U;)? CPU.+Mac OS X/gi);
```
**5. 是否为iPad**
``` js
const isIPad = isPlatform(/iPad/gi);
```
**6. 是否为安卓**
``` js
const isAndroid = isPlatform(/android|adr/gi);
```
**7. 是否为Chrome浏览器**
``` js
const isChrome = isPlatform(/Chrome/i);
```

**8. 是否为火狐浏览器**
``` js
const isFirefox = isPlatform(/Firefox/i);
```
**9. 是否为Safari浏览器**
``` js
const isSafari = isPlatform(/Safari/i);
```
**10. 是否为QQ浏览器**
``` js
const isQQBrowser = isPlatform(/qq/gi);
```
**11. 是否为微信平台**
``` js
const isMicroMessenger = isPlatform(/MicroMessenger/i);
```
**12. 是否为微博**
``` js
const isWeibo = isPlatform(/weibo/gi);
```
**12. 其他设备判断**
``` js
const isDevice = (regexp) => isPlatform(regexp);
```

## 链接篇
**1. 将链接参数转为JSON格式返回**
``` js
const getParam2Json = (url = location.href) => {
  const search = url.substring(url.lastIndexOf("?") + 1);
  const result = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (res, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    result[name] = val;
    return res;
  });
  return result;
}

// 举例：
getParam2Json('http://www.baidu.com?name=ZCoder&email=xxx126')
// => {name: "ZCoder", email: "xxx126"}
```
**2. 获取链接指定字段名的值**   
> 说明：如果参数`key`为字符串数组则返回key-value对象
``` js
const getUrlParam = (key, url = location.href) => {
  const params = getParam2Json(url);
  if (Array.isArray(key)) {
    let res = {};
    key.forEach(item => {
      res[item] = params[item];
    });
    return res;
  } else if (typeof key === "string") {
    return params[key];
  }
  return void 0;
}

// 举例：
getUrlParam('name', 'http://www.baidu.com?name=ZCoder&email=xxx126')
// => "ZCoder"
```
**3. 转换JSON为链接参数字符串**   
> 说明：参数`json`为key-value对象，如：{name: 'ZCoder'}
``` js
const getJson2Param = json => {
  if (!json) return "";
  return Object.keys(json)
    .map(key => {
      if (json[key] === void 0) return "";
      return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
    })
    .join("&");
};

// 举例：
getJson2Param({name: 'ZCoder', email: 'xxx126'})
// => "name=ZCoder&email=xxx126"
```
**4. 添加参数到链接上**   
> 说明：参数`params`为key-value对象，如：{name: 'ZCoder'}
``` js
const addParam2Url = (params = {}, url = location.href) => {
  const path = url.split("?")[0];
  let json = getParam2Json(url);
  const paramStr = getJson2Param({ ...json, ...params });
  return `${path}?${paramStr}`;
};

// 举例：
addParam2Url({name: 'ZCoder'}, 'http://www.baidu.com?email=xxx126')
// => "http://www.baidu.com?email=xxx126&name=ZCoder"
```
**5.删除链接指定的参数**   
> 说明：参数`params`如果为字符串时，多个字段名用英文','连接，如果为字符串数组是，则每个元素对应一个字段名，如果不传或者传的时空字符串或者空数组则删除全部参数
``` js
const removeParamFromUrl = (url = location.href, params = "") => {
  const path = url.split("?")[0];
  if (!params || (Array.isArray(params) && !params.length)) return path;
  let json = getParam2Json(url);
  json = removeKeys(
    json,
    Array.isArray(params) ? params : params.match(/\b\w+\b/g)
  );
  const paramStr = getJson2Param(json);
  return paramStr ? `${path}?${paramStr}` : path;
}


// 举例：
removeParamFromUrl('http://www.baidu.com?name=ZCoder&email=xxx126', 'name')
// => "http://www.baidu.com?email=xxx126"

removeParamFromUrl('http://www.baidu.com?name=ZCoder&email=xxx126', ['name', 'email'])
// => "http://www.baidu.com"

removeParamFromUrl3('http://www.baidu.com?name=ZCoder&email=xxx126')
// => "http://www.baidu.com"
```

## 其他
**1. 节流**
> 说明：用于有连续事件响应，每间隔一定时间触发一次
> func: 回调
> wait: 触发长度间隔时间
> leading: leading=false首次不会触发(如果触发了多次)
``` js
const throttle = (func, interval, leading) => {
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
```
**2. 防抖**
> 说明：用于连续事件触发结束后只触发一次
> func：回调
> wait：触发长度间隔时间
> immediate：是否立即执行
``` js
const debounce = (func, wait, immediate) => {
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
```
**3. Promise结果以数组形式返回**
> 说明：主要用于async/await
> 返回结果的第一个元素为错误信息，第二个元素为返回结果
> 如果成功则返回的第一个元素（错误信息）为null，否则为错误信息
> promise: Promise对象
> error：错误信息，可选
``` js
const syncPromise = (promise, error) =>
  promise
    .then(data => [null, data])
    .catch(err => {
      if (error) {
        Object.assign(err, error);
      }
      return [err, undefined];
    });

// 举例：
async function getResult (fn) {
  const [err, res] = await syncPromise(fn())
  console.log([err, res])
}
async function success () {
  return Promise.resolve('成功')
}
async function error () {
  return Promise.reject('失败')
}
getResult(success) // => [null, '成功']
getResult(error) // => ['失败', undefined]

```

**4. requestAnimationFrame/cancelAnimationFrame 兼容模式**
``` js
const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    animationTimer = setTimeout(callback, 1000 / 60);
  };

const cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  function() {
    clearTimeout(animationTimer);
  };
```

**5. 延时函数**
> 说明：`time`为毫秒级别
``` js
const delay = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

// 举例：
delay(3000).then(() => {
  console.log('时间到')
})
// => 三秒后打印
```

**6. 组合函数**
> 说明：倒序调用
``` js
function compose(...args) {
  const start = args.length - 1;
  return function() {
    let i = start;
    let result = args[start].apply(this, args);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}
```
**7. 复制到剪切板（异步方式）**
``` js
const copy = str =>
  new Promise((resolve, reject) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    let isSuccess = false;
    if (document.execCommand && document.execCommand("copy")) {
      document.execCommand("copy");
      document.body.removeChild(el);
      isSuccess = true;
    }
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
    isSuccess ? resolve() : reject("当前浏览器不支持复制API");
  });

// 举例：
copy('内容')
  .then(() => { console.log('复制成功') })
  .catch(err => {
    console.log(err)
  })
```
**8. 匹配提供的正则表达式**
> 说明：用下以下规则判断
``` js
const isRule = rule => val => rule.test(val);
```
**9. 是否为合法链接**
``` js
const isLink = isRule(
  /((https|http|ftp|rtsp|mms)?:\/\/)(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/
);
```
**10. 是否为合法邮箱**
``` js
const isEMail = isRule(
  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
);
```
**11. 是否为合法手机号码**
``` js
const isTel = isRule(/^(\+?0?86-?)?1(3|4|5|6|7|8|9)\d{9}$/)
```
**12. 是否为合法固话**
``` js
const isLandline = isRule(/^(\d{3,4}-)?\d{7,8}$/);
```
**13. 是否为合法身份证**
``` js
const isIdCard = isRule(/(^\d{15}$)|(^\d{17}([0-9xX])$)/);
```
**14. 是否为合法QQ**
``` js
const isQQ = isRule(/^[1-9][0-9]{4,11}$/);
```
**15. 是否为合法微信**
``` js
const isWechat = isRule(/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/);
```
**16. 是否为邮政编码**
``` js
const isPost = isRule(/^[1-9]\d{5}(?!\d)$/);
```
**17. 是否为汉字**
``` js
const isCharacters = isRule(/^[\u4e00-\u9fa5]+$/);
```
**18. 全屏功能**
> 说明：该工具类参考[screenfull](https://github.com/sindresorhus/screenfull.js)开发。
``` js
const ScreenFullAPIList = [
  "exitFullscreen",
  "requestFullscreen",
  "fullscreenElement",
  "fullscreenEnabled",
  "fullscreenchange",
  "fullscreenerror"
];

const ScreenfullHash = (function() {
  const prefix = ["webkit", "", "moz", "ms"];
  for (let i = 0; i < prefix.length; i++) {
    if (
      camelize(`${prefix[i]}${prefix[i] ? "-" : ""}${ScreenFullAPIList[0]}`) in
      document
    ) {
      return ScreenFullAPIList.reduce((acc, val, index) => {
        acc[val] = camelize(`${prefix[i]}-${ScreenFullAPIList[index]}`);
        return acc;
      }, {});
    }
  }
})();

class Screenfull {
  get isFullScreen() {
    return document[ScreenfullHash.fullscreenElement] || docunent.fullscreen;
  }

  get isEnabled() {
    document[ScreenfullHash.fullscreenEnabled];
  }

  // 推出全屏
  exit() {
    return new Promise((resolve, reject) => {
      if (!this.isFullScreen) {
        resolve();
        return;
      }
      const exitCallback = () => {
        this.off("fullscreenchange", exitCallback);
        resolve();
      };
      this.on("fullscreenchange", exitCallback);
      resolve(document[ScreenfullHash.exitFullscreen]()).catch(reject);
    });
  }

  // 触发全屏
  request(el) {
    const element = el || document.documentElement || document.body;
    return new Promise((resolve, reject) => {
      const requestCallback = () => {
        this.off("fullscreenchange", requestCallback);
        resolve();
      };
      this.on("fullscreenchange", requestCallback);
      resolve(element[ScreenfullHash.requestFullscreen]()).catch(reject);
    });
  }

  // 全屏切换
  toggle(el) {
    return this.isFullscreen ? this.exit() : this.request(el);
  }

  onChange(fn) {
    this.on("fullscreenchange", fn);
  }

  onError(fn) {
    this.on("fullscreenerror", fn);
  }

  on(eventName, fn) {
    document.addEventListener(ScreenfullHash[eventName], fn, false);
  }

  off(eventName, fn) {
    document.removeEventListener(ScreenfullHash[eventName], fn, false);
  }
}

// 举例：
const screenfull = new Screenfull()
screen.request() // 全屏
screen.exit() //推出全屏
```


## 参考文章

- [30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code#isvalidjson)
- [browser-cookies](https://github.com/voltace/browser-cookies)
- [screenfull](https://github.com/sindresorhus/screenfull.js)
- [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill)
- [bignumber.js](https://github.com/alexbardas/bignumber.js)
- [JS 正则表达式完整教程（略长）](https://juejin.im/post/5965943ff265da6c30653879)
