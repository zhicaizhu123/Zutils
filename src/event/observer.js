class Observer {
  constructor() {
    this.list = {};
  }

  on(key, fn) {
    if (!this.list[key]) {
      this.list[key] = [];
    }
    this.list[key].push(fn);
  }

  emit(key, ...params) {
    const fns = this.list[key];
    if (!fns || !fns.length) return;
    fns.forEach(fn => {
      fn.call(this, ...params);
    });
  }

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

export default new Observer();
