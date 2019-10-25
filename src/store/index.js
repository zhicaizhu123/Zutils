import cookie from "./cookie";
import local from "./local";
import session from "./session";

export const zcookie = cookie;
export const zlocal = local;
export const zsession = session;

export default {
  cookie: zcookie,
  localStore: zlocal,
  sessionStore: Z_BEST_COMPRESSION
};
