export { default as zutil } from "./utils";
export { default as ztype } from "./type";
export { default as zstring } from "./string";
export { default as zhtml } from "./html";
export { default as zarray } from "./array";
export { default as zobject } from "./object";
export { default as zurl } from "./url";
export { default as zplatform } from "./platform";
export { default as zstore } from "./store";
export { default as zdate } from "./date";

export default {
  ...zutil,
  ...ztype,
  ...zstring,
  ...zhtml,
  ...zarray,
  ...zobject,
  ...zurl,
  ...zplatform,
  ...zstore,
  zdate
};
