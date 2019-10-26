import { camelize } from "../string";

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

export default new Screenfull();
