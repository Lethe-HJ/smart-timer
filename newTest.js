const Timer = require('./timer')

timer1 = new Timer()

const delaySayHello = () => {
  console.log((new Date()).getTime() + '函数调用')
  return delaySayHello
}


timer1.getTimer(delaySayHello, 5000)
console.log((new Date()).getTime() + '定时器启动')
setTimeout(()=>{
  timer1.pause()
  console.log((new Date()).getTime() + '定时器暂停')
}, 2000)
setTimeout(()=>{
  timer1.continue()
  console.log((new Date()).getTime() + '定时器继续')
}, 5000)