// 获取fn在time时刻的调用情况
const realCalledAround = (time, fn, accuracy=0.001, realTimer=false) => {
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

export { realCalledAround }