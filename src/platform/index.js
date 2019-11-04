const isPlatform = regexp => {
  return () => regexp.test(navigator.userAgent);
};

export const isMobile = isPlatform(
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
);

export const isPc = () => !isMobile();

export const isIOS = isPlatform(/\(i[^;]+;( U;)? CPU.+Mac OS X/gi);

export const isIPad = isPlatform(/iPad/gi);

export const isAndroid = isPlatform(/android|adr/gi);

export const isChrome = isPlatform(/Chrome/i);

export const isFirefox = isPlatform(/Firefox/i);

export const isSafari = isPlatform(/Safari/i);

export const isMicroMessenger = isPlatform(/MicroMessenger/i);

export const isQQBrowser = isPlatform(/qq/gi);

export const isWeibo = isPlatform(/weibo/gi);

export const isDevice = regexp => isPlatform(regexp);

export default {
  isMobile,
  isPc,
  isIOS,
  isIPad,
  isAndroid,
  isChrome,
  isFirefox,
  isSafari,
  isMicroMessenger,
  isQQBrowser,
  isWeibo,
  isDevice
};
