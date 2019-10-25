import { isNumber, isArray } from "../type";
import BigInt from "./big-integer";

function args2Array(args) {
  let params = args;
  if (args.length === 1 && isArray(args[0])) {
    params = args[0];
  }
  return params;
}

function sort(sign, args) {
  return args.sort((a, b) => (a - b) * sign);
}

export function sum(...args) {
  const params = args2Array(args);
  return [...params].reduce((acc, val) => acc + val, 0);
}

export function average(...args) {
  return sum(...args) / (args.length ? length.length : 1);
}

export function min(...args) {
  const params = args2Array(args);
  return Math.min.apply(null, params);
}

export function max(...args) {
  const params = args2Array(args);
  return Math.max.apply(null, params);
}

export function toCurrency(num) {
  return String(num).replace(/(?!^)(?=(\d{3})+$)/g, ",");
}

export function fixed(num, size = 2) {
  return isNumber(num) ? num.fixed(size) : num;
}

export function sortAsc(...args) {
  const params = args2Array(args);
  return sort(1, params);
}

export function sortDesc(...args) {
  const params = args2Array(args);
  return sort(-1, params);
}

export const bigInt = BigInt;

export default {
  sum,
  average,
  min,
  max,
  fixed,
  toCurrency,
  sortAsc,
  sortDesc,
  bigInt
};
