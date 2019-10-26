import util from "./utils";
import type from "./type";
import string from "./string";
import html from "./html";
import array from "./array";
import object from "./object";
import number from "./number";
import url from "./url";
import platform from "./platform";
import { local, session, cookie } from "./store";
import date from "./date";
import event from "./event";

export const zutil = util;
export const ztype = type;
export const zstring = string;
export const zhtml = html;
export const zarray = array;
export const zobject = object;
export const znumber = number;
export const zurl = url;
export const zplatform = platform;
export const zcookie = cookie;
export const zlocal = local;
export const zsession = session;
export const zevent = event;
export const zdate = date;

export default {
  ...zutil,
  ...ztype,
  ...zstring,
  ...zhtml,
  ...zarray,
  ...zobject,
  ...znumber,
  ...zurl,
  ...zplatform,
  ...zcookie,
  ...zlocal,
  ...zsession,
  ...zevent,
  zdate: date
};
