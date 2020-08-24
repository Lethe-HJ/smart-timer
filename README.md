# smart-timer

## 简介

`smartTimer`对js的`setInterval`进行了封装,你完全可以使用它代替`setInterval`和`setTimeOut`.好用到爆

[github链接](https://github.com/Lethe-HJ/smart-timer)

## 功能

+ 对象初始化为实例后，该实例下只能有一个定时器
+ 在该实例下新建定时器会自动覆盖或者直接返回原先的定时器
+ 可以暂停或继续运行定时器实例

## 实现思路

受单例模式启发，设计了一个getTimer方法，这个gettimer第一次被调用时会新建出一个定时器，后续调用会删除这个已有的定时器，
再新建一个新的定时器，当然也可以指定cover=false来使后续的gettimer返回已有的定时器，不做任何额外的操作。
暂停和继续功能用了‘障眼法’，记录下已有的定时器执行的相关时间和次数信息（保护现场），暂停时会删除已有的这个定时器，继续时根据刚刚的信息，
新建一个定时器（恢复现场）

## 使用方法

```js
const delaySayHello = () => {
  console.log("hello1 " + (new Date()).getTime())
  return delaySayHello
}

const timer1 = new Timer()

const delaySayHelloTimer1 = timer1.getTimer(delaySayHello, 3000)
```

### 初次立即调用

如果你不想第一次执行有延时的话,可以这样

```js
const delaySayHelloTimer1 = timer1.getTimer(delaySayHello(), 3000)
```

其实原生setTimeout也可以这样用，包括下面的传参

### 传参

```js
const delaySayHello = (word) => {
  const sayHello = (world) => {
    console.log("hello1 " + word + (new Date()).getTime())
  }
  return sayHello
}

const timer1 = new Timer()

const delaySayHelloTimer1 = timer1.getTimer(delaySayHello("world"), 3000)
```

### 覆盖旧定时器

> 如果不小心调用了同一个实例的getTimer,并不会累积两个定时器
> 默认情况下是删除这个实例之前的旧的定时器,新建新的定时器

```js
const delaySayHelloWorld = ()=>{
  console.log("hello world " + (new Date()).getTime())
  return delaySayHelloWorld
}
const timer1 = new Timer()
const delaySayHelloTimer1 = timer1.getTimer(delaySayHello(), 3000)
const delaySayHelloTimer2 = timer1.getTimer(delaySayHelloWorld(), 3000)
```

### 不覆盖旧定时器

> 你可以在实例化的时候,传入`cover=false`,改变这一行为

```js
const timer1 = new Timer({cover=false})
```

> `cover=false` 时 第二次调用getTimer不会新建新的定时器而是直接返回
> 旧定时器,而且传入的参数会被直接忽略,并予以警告提示
> 当然,如果没有传入参数,那么就不会提示警告
> 你可以通过`timer1.clearTimer()`来清除timer1实例对象的timer
> 也可以通过`Timer.clearAllTimer()` 来一次性清除Timer的所有实例中的timer

### 指定定时次数

如果你想指定定时器触发的次数，可以这么做

```js
const timer1 = new Timer({times=3 ,cover=false})
timer1.getTimer(delaySayHello, 3000)
```

> 这样这个定时器只会执行delaySayHello三次(如果你传入的是一个函数的调用，那么这次自执行不算在这三次之内)
> 如果设置次数为1, 是不是感觉就是setTimeOut了,对 我们以后抛弃setTimeOut吧
> 你需要的仅仅是`new Timer().getTimer(delaySayHello, 3000, 1)`

你也可以在getTimer的时候改变这个执行的次数

```js
timer1.getTimer(delaySayHello, 3000, 4)
```

### 暂停继续

```js
let timer4 = new Timer(delaySayHelloWorld, 3000)
timer4.getTimer()
timer4.pause() // 暂停
timer4.continue() // 继续
```

### 多个定时器

一个实例只能同时存在一个定时器
当然，你可以new几个实例，那么你就有了多个定时器
你可以使用`Timer.clearAllTimer()`一次性删除所有实例中的定时器

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
const timer1 = new Timer()

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
// 一秒打印一个hello world
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
const = new Timer()
const delaySayHelloTimer8 = timer2.getTimer(delaySayHelloWorld, 3000)

const = new Timer()
const delaySayHelloTimer8 = timer3.getTimer(delaySayHello, 3000)
Timer.clearAllTimer() // 清除Timer的所有实例中的timer


// 2.2 暂停 继续
const timer4 = new Timer()
const timer5 = new Timer()
const  delaySayHelloTimer10 = timer4.getTimer(delaySayHello, 5000)
const  delaySayHelloTimer11 = timer5.getTimer(delaySayHelloWorld, 10000)

// 通过暂停继续延迟3秒
setTimeout(()=>{timer4.pause()}, 2000) // 两秒后暂停
setTimeout(()=>{timer4.continue()}, 5000)// 五秒后继续

// 通过暂停继续延迟4秒
setTimeout(()=>{timer5.pause()}, 2000)
setTimeout(()=>{timer5.continue()}, 6000)

// 3 执行特定次数

const timer6 = new Timer({times:1})
timer6.getTimer(delaySayHello, 3000)

```
