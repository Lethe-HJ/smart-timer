module.exports =  class Timer {
  get times(){
    return this._times
  }

  set times(times){
    if(!Number.isInteger(times) || times <= 0){
      throw TypeError("times must be an integer greater than 0 !")
    }
    this._times = times
  }

  constructor({times=Number.POSITIVE_INFINITY, cover=true} = {}) { // 默认覆盖
    this.cover = cover
    this.timer = null
    if(!Timer.instances){ // 初始化instances静态属性
      Timer.instances = [this]
    }
    this.count = 0
    this._times = null
    this.times = times
  }

  static clearAllTimer(){
    Timer.instances.forEach(element => {
      element.clearTimer()
    });
  }

  // 重新设置定时器的配置信息 需要先清除定时器 否则设置无效
  setTimer({times=this.times, cover=this.cover} = {}){
    if(this.timer == null) return false
    this.cover = cover
    return true
  }

  _newTimer(func, seconds, times=this.times){
    this.func = func
    this.seconds = seconds
    this.times_ = times
    this.timer = setInterval(()=>{
      // 就算清除了定时器 下一;轮还是会执行 所以提前一轮清除定时器
      if(this.count >= this.times - 1) 
        this.clearTimer()
      func()
      this.count++
    }, seconds);
    Timer.instances.push(this)
    return this.timer
  }

  clearTimer(){
    clearInterval(this.timer);
    this.timer = null
  }

  getTimer(func, seconds, times=this.times) {
    this.times = times
    if(!this.timer) { // 如果该实例没有timer 直接新建timer
      return this._newTimer(func, seconds, times);
    }
    if(this.cover){ // 如果this.cover=true 则删除原有timer,新建timer
      this.clearTimer(this.timer)
      this._newTimer(func, seconds ,times);
    }else{ // this.cover=false 则提示警告 参数将被忽略
      if(func || seconds || times)
        console.warn("args will be ignored because cover is false")
    }
    return this.timer;
  }

  pause(){
    if(this.timer){
      this.clearTimer()
    }
  }

  continue(){
    return this._newTimer(this.func, this.seconds, this.times)
  }
}


