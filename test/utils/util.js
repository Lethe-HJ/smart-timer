// 获取fn在time时刻的调用情况

import { async } from "regenerator-runtime"

// 时间会往后走time + accuracy 因此第二次调用该函数时 需要time-第一次的accuracy
const realCalledAround = (time, fn, accuracy=100, realTimer=false) => {
  return new Promise((resolve, reject) => {
    let start = null, end = null
    const startFunc = () => {
      start = fn.mock.calls.length
    }
    const endFunc = () => {
      end = fn.mock.calls.length
      if(start === null || end === null) {
        reject("one of start and end is null")
      }
      resolve({start, end})
    }
    try{
      if(realTimer) {
        setTimeout(startFunc, time - accuracy);
        setTimeout(endFunc, time + accuracy);
      } else {
        jest.advanceTimersByTime(time-accuracy)
        startFunc()
        jest.advanceTimersByTime(accuracy*2)
        endFunc()
      }
    } catch (error) {
      reject(error)
    }
  })
}

// 同步定时器
/* 使用方式在async函数中await setSyncTimerOut(timeout[, func])
即可阻塞后续代码的执行 直到该定时器执行完毕
*/
const setSyncTimerOut = (func, timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      resolve(func())
    }, timeout);
  })
}

// 获取fn在0-endTime秒之内的调用情况
// 返回值示例 [ { time: 3820, times: 1 }, { time: 5720, times: 2 } ]
// 返回值说明 上述示例指明了在0-endTime秒内有第1,2次调用，对应时刻是第3820ms和第5720ms
// 额外说明 由于测量的程序本身需要执行时间，因此获得到的时刻要稍大于这个值
const fnExecuteTime = async ( endTime, fn, accuray= 1, realtimer=false) => {
  const record = []
  for(let time = 0; time < endTime; time += accuray){
    let start = fn.mock.calls.length
    if(realtimer) {
      await setSyncTimerOut(()=>{}, accuray)
    } else {
      jest.advanceTimersByTime(accuray)
    }
    let end = fn.mock.calls.length
    if(end - start > 0) {
      record.push({
        time: time,
        times: end 
      })
    }
  }
  return record
} 

export { realCalledAround, fnExecuteTime, setSyncTimerOut }