const Timer = require('./timer')

const delaySayHello = () => {
  console.log("hello1 " + (new Date()).getTime())
  return delaySayHello
}

// const delaySayHelloWorld = ()=>{
//   console.log("hello world " + (new Date()).getTime())
//   return delaySayHelloWorld
// }

let time = 0
let timeCount = () => {
  console.log(time++) 
  return timeCount
}
setInterval(timeCount(), 1000)


// // 测试1 单timer
// timer1 = new Timer()

// //测试1.1 不延时
// const delaySayHelloTimer1 = timer1.getTimer(delaySayHello(), 3000)
// const delaySayHelloTimer2 = timer1.getTimer(delaySayHello(), 3000)
// 会执行两个hello后一秒一个hello

// //测试1.2 延时
// const delaySayHelloTimer3 = timer1.getTimer(delaySayHello, 3000)
// const delaySayHelloTimer4 = timer1.getTimer(delaySayHello, 3000)
// 一秒一个hello

// // 测试 1.3 清除该实例中的timer
// const delaySayHelloTimer5 = timer1.getTimer(delaySayHelloWorld, 3000)
// const delaySayHelloTimer6 = timer1.getTimer(delaySayHello, 3000, cover=false)
// 一秒打印一个hello world
// timer1.clearTimer() // 清除该实例对象的timer
// Timer.clearAllTimer() // 清除Timer的所有实例中的timer

// 测试1.4 暂停 继续
// const  delaySayHelloTimer7 = timer1.getTimer(delaySayHello, 5000)
// setTimeout(()=>{timer1.pause()}, 2000)
// setTimeout(()=>{timer1.continue()}, 5000)
// const time = 0
// setInterval(()=>{console.log(time++)}, 1000)

// 测试1.5 不覆盖
const timer1 = new Timer({times: 2, cover:false})

timer1.getTimer(delaySayHello, 3000, 3)
// timer1.getTimer(delaySayHello, 3000)
// timer1.getTimer()

// // 测试2 多timer

// // 测试2.1 清除所有实例中的timer
// timer2 = new Timer()
// const delaySayHelloTimer8 = timer2.getTimer(delaySayHelloWorld, 3000)

// timer3 = new Timer()
// const delaySayHelloTimer8 = timer3.getTimer(delaySayHello, 3000)
// Timer.clearAllTimer() // 清除Timer的所有实例中的timer


// // 测试2.2 暂停 继续
// timer4 = new Timer()
// timer5 = new Timer()
// const  delaySayHelloTimer10 = timer4.getTimer(delaySayHello, 5000)
// const  delaySayHelloTimer11 = timer5.getTimer(delaySayHelloWorld, 10000)

// // 通过暂停继续延迟3秒
// setTimeout(()=>{timer4.pause()}, 2000) // 两秒后暂停
// setTimeout(()=>{timer4.continue()}, 5000)// 五秒后继续

// // 通过暂停继续延迟4秒
// setTimeout(()=>{timer5.pause()}, 2000)
// setTimeout(()=>{timer5.continue()}, 6000)


// const timer6 = new Timer({once:true})
// timer6.getTimer(delaySayHello, 2000)