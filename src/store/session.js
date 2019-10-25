import { removeKeys } from "../object";

const Store = window.sessionStorage;
const storeMap = new Map();

function sessionStore(namespaced = "zstore") {
  if (storeMap.has(namespaced)) {
    return storeMap.get(namespaced);
  }
  storeMap.set(namespaced, new Storage(namespaced));
  return storeMap.get(namespaced);
}

class Storage {
  constructor(namespaced) {
    this.namespaced = namespaced;
    this.state = {};
    this.init();
  }

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

  saveState() {
    Store.setItem(this.namespaced, JSON.stringify(this.state));
  }

  setItem(key, data) {
    this.state[key] = data;
    this.saveState();
    return this.state;
  }

  getItem(key) {
    return this.state[key];
  }

  removeItem(key) {
    this.state = removeKeys(this.state, [key]);
    this.saveState();
    return this.state;
  }

  clear() {
    this.state = {};
    Store.removeItem(this.namespaced);
  }
}

export default sessionStore;
