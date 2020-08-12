import Timer from '../timer'
import { realCalledAround } from './util'


const normalTest1 = settings => () => {
  jest.useFakeTimers()
  const timer = new Timer(settings)
  const fn = jest.fn();
  timer.getTimer(fn, 3000)
  // expect(firstFakeCalledAround(3000, fn)).toBeTruthy()
  realCalledAround(3000, fn).then(res => {
    expect(res).toEqual({start: 0, end: 1})
  })
}

// 新定时器会覆盖之前的旧定时器
const multipleGetTimer = settings => () => {
  jest.useFakeTimers()
  const timer = new Timer(settings)
  const fn = jest.fn();
  const first = timer.getTimer(fn, 3000)
  const second = timer.getTimer(fn, 6000)

  if(settings.cover === false) {
    // 继承模式下 同一实例第一次getTimer后的gettimer无效
    // 断言fn第1次被调用是在第3秒
    realCalledAround(3000, fn).then(res => {
      expect(res).toEqual({start: 0, end: 1})
    })
    // 断言fn第2次被调用是在第6秒
    realCalledAround(3000, fn, 1).then(res => {
      expect(res).toEqual({start: 1, end: 2})
    })
  } else {
    /*覆盖模式下 后续gettimer会覆盖掉前面的gettimer，
     即删除掉前面的gettimer生成定时器，重新生成新的定时器*/
    // 断言fn第一次被调用是在第6秒
    realCalledAround(6000, fn).then(res => {
      expect(res).toEqual({start: 0, end: 1})
    })
  }
}

// 被暂停的这轮应该被正确的延时剩下的时间，后续回合应该按照原有的延时被执行
const pauseAndContinue = settings => () => {
  jest.useRealTimers()
  const timer = new Timer(settings)
  const fn = jest.fn();
  timer.getTimer(fn, 2000)
  // 第1秒后暂停 第3秒后继续 相当于本轮延长了2秒钟
  setTimeout(()=>{timer.pause()}, 1000)
  setTimeout(()=>{timer.continue()}, 3000)

  // 断言fn第一次被调用是在第4秒
  realCalledAround(4000, fn, 1, true).then(res => {
    expect(res).toEqual({start: 0, end: 1})
    console.log("res", res)
  })
}

const timerExecuteOnce = settings => () => {

}




afterEach(() => {
  Timer.clearAllTimer()
})


describe('一个Timer实例', () => {
  describe('覆盖模式+无限模式', ()=> {
    test('[Timer基本定时]', normalTest1({}))
    test('[Timer多次新建]', multipleGetTimer({}))
    test('[Timer暂停与继续]',pauseAndContinue({}))
    // test('[定时器只运行指定次数]')
  })

  describe('继承模式+无限模式', ()=> {
    test('[Timer基本定时]', normalTest1({cover: false}))
    test('[Timer多次新建]', multipleGetTimer({cover: false}))
    test('[Timer暂停与继续]',pauseAndContinue({cover: false}))
  })
})