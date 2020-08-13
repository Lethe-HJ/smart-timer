import Timer from '../src/timer'
import { realCalledAround, fnExecuteTime, setSyncTimerOut } from './utils/util'
import { async } from 'regenerator-runtime'

beforeAll(() => {
  // 设置jest的异步回调超时时间为10秒
  jest.setTimeout(10000);
})

beforeEach(()=> {
  jest.useFakeTimers()
})

afterEach(() => {
  Timer.clearAllTimer()
})



describe('覆盖模式+无限模式', ()=> {
  test('[Timer基本定时]', () => {
    const timer = new Timer({})
    const fn = jest.fn();
    timer.getTimer(fn, 3000)
    realCalledAround(3000, fn, 1).then(res => {
      expect(res).toEqual({start: 0, end: 1})
    })
  })
  test('[Timer多次新建]', async () => {
    const timer = new Timer({})
    const fn = jest.fn();
    const first = timer.getTimer(fn, 3000)
    const second = timer.getTimer(fn, 6000)
    /*覆盖模式下 后续gettimer会覆盖掉前面的gettimer，
    即删除掉前面的gettimer生成定时器，重新生成新的定时器*/
    // 断言fn第一次被调用是在第6秒
    await realCalledAround(6000, fn, 1).then(res => {
      expect(res).toEqual({start: 0, end: 1})
    }) // 阻塞 直到这个promise resolved
    expect(first).not.toEqual(second)
  })
  // test('[定时器只运行指定次数]')
})

describe('继承模式+无限模式', ()=> {
  test('[Timer基本定时]', () => {
    const timer = new Timer({cover:false})
    const fn = jest.fn();
    timer.getTimer(fn, 3000)
    realCalledAround(3000, fn, 1).then(res => {
      expect(res).toEqual({start: 0, end: 1})
    })
  })
  test('[Timer多次新建]', () => {
    // 新定时器会覆盖之前的旧定时器
    const timer = new Timer({cover:false})
    const fn = jest.fn();
    const first = timer.getTimer(fn, 3000)
    const second = timer.getTimer(fn, 6000)
    // 继承模式下 同一实例第一次getTimer后的gettimer无效
    // 断言fn第1次被调用是在第3秒
    realCalledAround(3000, fn, 1).then(res => {
      expect(res).toEqual({start: 0, end: 1})
    })
    // 断言fn第2次被调用是在第6秒
    realCalledAround(3000-1, fn, 1).then(res => {
      expect(res).toEqual({start: 1, end: 2})
    })
    expect(first).toEqual(second)
    // console.log(fnExecuteTime(20000, fn, 1))
  })
  // test('[Timer指定次数]', normalTest1({times:3}))


})

test('[Timer暂停与继续]', async () => {
  // 被暂停的这轮应该被正确的延时剩下的时间，后续回合应该按照原有的延时被执行
  jest.useRealTimers()
  const timer = new Timer({})
  const startTime = new Date().getTime()
  const timeRecord = []
  const fn = jest.fn(() => {
    timeRecord.push(new Date().getTime() - startTime)
  });
  timer.getTimer(fn, 2000)
  
  // 这个方式只能在realtimer的时候使用，但胜在精确
  // 第1秒后暂停 第3秒后继续 相当于本轮延长了2秒钟
  setTimeout(()=>{timer.pause()}, 1000)
  setTimeout(()=>{timer.continue()}, 3000)
  await setSyncTimerOut(()=>{}, 7000) // 阻塞7秒钟 等待上面两个setTimeout跑完
  // 断言fn第1次被调用是在第4秒
  expect(Math.abs(timeRecord[0] - 4000)).toBeLessThan(10)
  // 断言fn第2次被调用是在第6秒
  expect(Math.abs(timeRecord[1] - 6000)).toBeLessThan(10)
})

test('[Timer指定执行次数]', async () => {
  // 被暂停的这轮应该被正确的延时剩下的时间，后续回合应该按照原有的延时被执行
  const timer = new Timer({times: 1})
  const timeRecord = []
  const fn = jest.fn();
  timer.getTimer(fn, 2000)
  // 这种方式函数内部fnExecuteTime进行了很多操作， 但相比与[Timer暂停与继续]中的方式
  // 在当前文件中代码量要更少
  await fnExecuteTime(8000, fn, 1, false).then( res => {
    expect(res.length).toBe(1)
    expect(Math.abs(res[0].time-2000)).toBeLessThan(10)
  }) // 得到误差在200ms范围内
})

test('[Timer清除当前实例中的定时器]', () => {
  const timer = new Timer({})
  const fn = jest.fn();
  timer.getTimer(fn, 1000)
  timer.clearTimer()
  jest.advanceTimersByTime(3000)
  expect(fn.mock.calls.length).toBe(0)
  timer.getTimer(fn, 1000)
  jest.advanceTimersByTime(3001)
  expect(fn.mock.calls.length).toBe(3)
})

test('[Timer清除所有实例中的定时器]', () => {
  const timer1 = new Timer({})
  const timer2 = new Timer({})
  const fn = jest.fn();
  timer1.getTimer(fn, 1000)
  timer2.getTimer(fn, 1000)
  jest.advanceTimersByTime(3000)
  expect(fn.mock.calls.length).toBe(6)
  Timer.clearAllTimer()
  jest.advanceTimersByTime(3000)
  expect(fn.mock.calls.length).toBe(6)
})

test('[Timer设置times不正确时报错]', () => {
  const errorUse = () => {
    new Timer({times: -1})
  }
  expect(errorUse).toThrow(TypeError)
})
