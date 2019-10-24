export { default as utils } from "./utils";
import { default as type } from "./type";
import { default as string } from "./string";
import { default as html } from "./html";
import { default as array } from "./array";
import { default as object } from "./object";
import { default as platform } from "./platform";
import { default as store } from "./store";
import { default as date } from "./date";

export const zutil = utils;
export const ztype = type;
export const zstring = string;
export const zhtml = html;
export const zarray = array;
export const zobject = object;
export const zplatform = platform;
export const zstore = store;
export const zdate = date;

export default {
  ...zutil,
  ...ztype,
  ...zstring,
  ...zhtml,
  ...zarray,
  ...zobject,
  ...zplatform,
  ...zstore,
  zdate
};
