class Timer {
  constructor({ times = Infinity, cover = true } = {}) {
    // 默认覆盖
    this.cover = cover;
    this.timer = null;
    this.startTime = null;
    if (!Timer.instances) {
      // 初始化instances静态属性
      Timer.instances = [this];
    }
    this.count = 0;
    this.priTimes = null;
    this.times = times;
  }

  get times() {
    return this.priTimes;
  }

  set times(times) {
    if ((!Number.isInteger(times) && times !== Infinity) || times <= 0) {
      throw TypeError('times must be an integer greater than 0 !');
    }
    this.priTimes = times;
  }

  static clearAllTimer() {
    if(Timer.instances === undefined) return false
    Timer.instances.forEach((element) => {
      element.clearTimer();
    });
    return true
  }

  priNewTimer(func, seconds, times = this.times) {
    this.func = func;
    this.seconds = seconds;
    this.times = times;
    this.timer = setInterval(() => {
      // 就算清除了定时器 下一轮还是会执行 所以提前一轮清除定时器
      if (this.count >= this.times - 1) this.clearTimer();
      func();
      this.count += 1;
    }, seconds);
    this.startTime = new Date().getTime();
    Timer.instances.push(this);
    return this.timer;
  }

  clearTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  getTimer(func, seconds, times = this.times) {
    this.times = times;
    if (!this.timer) {
      // 如果该实例没有timer 直接新建timer
      return this.priNewTimer(func, seconds, times);
    }
    if (this.cover) {
      // 如果this.cover=true 则删除原有timer,新建timer
      this.clearTimer(this.timer);
      this.priNewTimer(func, seconds, times);
    } else if (arguments.length !== 0) {
      // this.cover=false 则提示警告 参数将被忽略
      console.warn('args will be ignored because cover is false');
    }
    return this.timer;
  }

  pause() {
    this.pauseTime = new Date().getTime()
    if (this.timer) {
      this.pauseTimerId = this.timer
      this.clearTimer();
    }
  }

  continue() {
    const restTime = this.seconds - (this.pauseTime - this.startTime)
    // console.log(this.pauseTime - this.startTime)
    setTimeout(() => {
      this.func()
      this.startTime = new Date().getTime()
      this.priNewTimer(this.func, this.seconds, this.times);
    }, restTime);
  }
}

// export default Timer // ES6
module.exports = Timer
