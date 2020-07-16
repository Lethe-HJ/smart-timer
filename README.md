## 简介

`smartTimer`对js的`settimeInterval`和`settimeout`进行了封装

## 功能

+ 对象初始化为实例后，该实例下只能有一个定时器
+ 在该实例下新建定时器会自动覆盖或者直接返回原先的定时器
+ 可以暂停或继续运行定时器实例

## 使用方法

```js
const delaySayHello = () => {
  console.log("hello1 " + (new Date()).getTime())
  return delaySayHello
}

const timer1 = new Timer()

const delaySayHelloTimer1 = timer1.getTimer(delaySayHello, 3000)
```

如果你不想第一次执行有延时的话,可以这样

```js
const delaySayHelloTimer1 = timer1.getTimer(delaySayHello(), 3000)`
```

如果不小心调用了同一个实例的getTimer,并不会累积两个定时器
默认情况下是删除这个实例之前的旧的定时器,新建新的定时器

```js
const delaySayHelloWorld = ()=>{
  console.log("hello world " + (new Date()).getTime())
  return delaySayHelloWorld
}
const timer1 = new Timer()
const delaySayHelloTimer1 = timer1.getTimer(delaySayHello(), 3000)
const delaySayHelloTimer2 = timer1.getTimer(delaySayHelloWorld(), 3000)
```

你可以在实例化的时候,传入`cover=false`,改变这一行为

```js
const timer1 = new Timer({cover=false})
```

`cover=false` 
不会新建新的定时器而是直接返回旧定时器

## 示例

```js
const delaySayHello = () => {
  console.log("hello1 " + (new Date()).getTime())
  return delaySayHello
}

const delaySayHelloWorld = ()=>{
  console.log("hello world " + (new Date()).getTime())
  return delaySayHelloWorld
}

const time = 1
setInterval(()=>{console.log(time++)}, 1000)


// 1.单timer
timer1 = new Timer()

// 1.1 不延时
const delaySayHelloTimer1 = timer1.getTimer(delaySayHello(), 3000)
const delaySayHelloTimer2 = timer1.getTimer(delaySayHello(), 3000)
会执行两个hello后一秒一个hello

// 1.2 延时
const delaySayHelloTimer3 = timer1.getTimer(delaySayHello, 3000)
const delaySayHelloTimer4 = timer1.getTimer(delaySayHello, 3000)
一秒一个hello

// 1.3 清除该实例中的timer
const delaySayHelloTimer5 = timer1.getTimer(delaySayHelloWorld, 3000)
const delaySayHelloTimer6 = timer1.getTimer(delaySayHello, 3000, cover=false)
一秒打印一个hello world
timer1.clearTimer() // 清除该实例对象的timer
Timer.clearAllTimer() // 清除Timer的所有实例中的timer

// 1.4 暂停 继续
const  delaySayHelloTimer7 = timer1.getTimer(delaySayHello, 5000)
setTimeout(()=>{timer1.pause()}, 2000)
setTimeout(()=>{timer1.continue()}, 5000)
const time = 0
setInterval(()=>{console.log(time++)}, 1000)

// 2. 多timer

// 2.1 清除所有实例中的timer
timer2 = new Timer()
const delaySayHelloTimer8 = timer2.getTimer(delaySayHelloWorld, 3000)

timer3 = new Timer()
const delaySayHelloTimer8 = timer3.getTimer(delaySayHello, 3000)
Timer.clearAllTimer() // 清除Timer的所有实例中的timer


// 2.2 暂停 继续
timer4 = new Timer()
timer5 = new Timer()
const  delaySayHelloTimer10 = timer4.getTimer(delaySayHello, 5000)
const  delaySayHelloTimer11 = timer5.getTimer(delaySayHelloWorld, 10000)

// 通过暂停继续延迟3秒
setTimeout(()=>{timer4.pause()}, 2000) // 两秒后暂停
setTimeout(()=>{timer4.continue()}, 5000)// 五秒后继续

// 通过暂停继续延迟4秒
setTimeout(()=>{timer5.pause()}, 2000)
setTimeout(()=>{timer5.continue()}, 6000)
```