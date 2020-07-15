export default class Timer {
  constructor(once=false, cover=true) { // 默认覆盖
    this.once = once // 是timeout 还是interval
    this.cover = cover
    this.Timer = null
    if(!Timer.instances){ // 初始化instances静态属性
      Timer.instances = [this]
    }
  }

  static clearAllTimer(){
    Timer.instances.forEach(element => {
      element.clearTimer()
    });
  }

  newTimer(func, seconds){
    this.func = func
    this.seconds = seconds
    if(this.once)
      this.Timer = setTimeout(func, seconds);
    else
      this.Timer = setInterval(func, seconds);
    Timer.instances.push(this)
    return this.Timer
  }

  clearTimer(){
    if(this.once){
      clearTimeout(this.Timer);
    }
    else{
      clearInterval(this.Timer);
    }
    this.Timer = null
  }

  getTimer(func, seconds, cover=true) {
    if(!this.Timer) { // 如果该实例没有timer 直接新建timer
      return this.newTimer(func, seconds);
    }
    if(this.cover){ // 如果设置了可覆盖参数 则删除原有timer,新建timer
      this.clearTimer(this.Timer)
      this.newTimer(func, seconds);
    }
    return this.Timer;
  }

  pause(){
    if(this.Timer){
      this.clearTimer()
    }
  }

  continue(){
    return this.newTimer(this.func, this.seconds)
  }
}
