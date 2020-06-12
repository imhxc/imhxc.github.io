---
title: 使用 Redux 实现「时间旅行」
date: 2020-06-12 11:01:27
tags: React
---

## 前言

时间旅行我们可以拆分为「时间」和「旅行」两个词。

时间可以理解为一系列的状态和场景；

旅行可以理解为以当前状态为基准，随意操作状态和场景的变化。

比如，我们将一个状态分别一次变化为A、B、C、D，当我们对状态做恢复或撤销操作时，则是对这些状态的迁移。


我们如果通过这种连续的状态迁移，可以近乎百分百的还原任意时刻应用所处的场景。

可以把应用的状态看作一个堆栈，最新的状态总是处在堆栈的顶部，当执行撤销操作时，总是将堆栈顶部的状态删除，遵循堆栈后进先出的机制。

撤销和恢复这类“时间旅行”操作，其数据结构的本质实际上就是一个保存了一系列应用状态的堆栈，我们可以通过控制当前的状态指针，指向其中的任一状态，就可以还原任意场景了。

> 另外，由于回退、撤销等词语容易弄混，下面我会用上一步、下一步来代替相关概念。

## 时间旅行的基本前提

对于实现时间旅行而言，我们的*状态要始终保持全局性和不可修改这两个特性*。

**状态的全局性：**
对于堆栈中保存的状态，需要是应用的全局状态快照，因为如果仅仅保存了部分状态，那么在进行时间旅行时，可能会因为状态的不一致，而造成意想不到的结果。

**不可修改：**
堆栈中保存的每一个状态都应该是不可修改的，因为如果堆栈中把保存的状态发生了变化，那么我们对其还原就没有意义了。


## 着手实现

### 实现一个 store

我们根据前面对时间旅行概念的理解，应该可以推测出我们需要定义一个 store，用于存放时间旅行中历史状态、当前状态以及未来状态。

````javascript
const historyState = {

  past: [], // 历史状态
  current: undefined, // 当前状态，可以理解为当前状态的指针
  future: [], // 未来状态
}
````

> 这里 `past` 历史状态和 `future` 未来状态均是以 `current` 作为参考时刻。

### 实现上一步操作

所谓的撤销操作，就是将当前状态恢复到之前的状态，比较常见的场景如，输入框再输入某个值之后，我门可以通过撤销回退到上一次的值。

在前面，我们定义 `past` 为历史状态，`current` 为当前状态，`future` 为未来状态。

当我们再执行撤销操作的时候，本质是需要回退到上一个状态，即历史状态。

根据前面提到的堆栈中的先进后出等相关概念，所以我们需要将 `current` 压入 `future` 头部，同时 `past` 的尾部值取出赋值给最新的 `current` 。

````javscript
// 这里依旧使用前面定义的 historyState
function undo() {
  const { past, current, future } = historyState;
  const previous = past[past.length - 1]; // 即将改变的最新的 current
  const newPath = path.slice(0, past.length - 1); // 将最后一个值压出
  return {
    past: newPast,
    current: previous,
    future: [current, ...future], // 将即将改变的 current 放入未来状态
  }
}
````

### 实现下一步操作

当我们执行下一步操作的时候，即是对未来状态的获取，需要将指针移动到未来状态的堆栈中。

所以，我们只需要将 `future` 中的头部状态赋值给 `current`，然后将原有的 `current` 再压入 `past` 历史状态中即可实现这一操作。

````javascript
function redo() {
  const { past, current, future } = historyState;
  const next = future[0];
  const newFuture = future.slice(1);

  return {
    past: [...past, current],
    current: next,
    future: newFuture,
  }
}
````


