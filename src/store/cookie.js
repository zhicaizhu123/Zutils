const defaults = {};

const set = function(name, value, options = {}) {
  let { expires, domain, path, secure, httponly, samesite } = {
    ...defaults,
    ...options
  };
  path = path || "/";
  const expDate = expires
    ? new Date(
        typeof expires === "number"
          ? new Date().getTime() + expires * 864e5
          : expires
      )
    : 0;

  document.cookie =
    name
      .replace(/[^+#$&^`|]/g, encodeURIComponent)
      .replace("(", "%28")
      .replace(")", "%29") +
    "=" +
    value.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +
    (expDate && expDate.getTime() >= 0
      ? ";expires=" + expDate.toUTCString()
      : "") +
    (domain ? ";domain=" + domain : "") +
    (path ? ";path=" + path : "") +
    (secure ? ";secure" : "") +
    (httponly ? ";httponly" : "") +
    (samesite ? ";samesite=" + samesite : "");
};

const getHanlder = function(name) {
  const all = {};
  const cookies = document.cookie.split(";");

  while (cookies.length) {
    const cookie = cookies.pop();

    let separatorIndex = cookie.indexOf("=");

    separatorIndex = separatorIndex < 0 ? cookie.length : separatorIndex;

    const cookie_name = decodeURIComponent(
      cookie.slice(0, separatorIndex).replace(/^\s+/, "")
    );

    if (name === void 0) {
      all[cookie_name] = decodeURIComponent(cookie.slice(separatorIndex + 1));
    } else if (cookie_name === name) {
      return decodeURIComponent(cookie.slice(separatorIndex + 1));
    }
  }

  return name === void 0 ? null : all;
};

const get = function(name) {
  getHanlder(name);
};

const clear = function(name, options) {
  set(name, "", {
    expires: -1,
    domain: options && options.domain,
    path: options && options.path,
    secure: 0,
    httponly: 0
  });
};

const all = function() {
  getHanlder();
};

export default {
  defaults,
  set,
  get,
  clear,
  all
};
