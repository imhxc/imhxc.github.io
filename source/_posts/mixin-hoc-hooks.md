---
title: The relationship between Mixin, HOC, Hooks .
date: 2020-05-25 18:39:04
tags: React
---

在最开始接触 Vue 的时候，认识了 Mixin，到现在使用 React，又认识了 HOC 和 Hooks。 对于 Mixin、HOC、Hooks  这三者之间关系如何呢？

首先需要认识到，Mixin、HOC、Hooks 都是为了解决模块或组件之间的复用问题的。

> 模块之间的公共部分，有一个专门术语：corss-cutting-concerns（横切关注点）。

React 刚推出的时候，Mixin 就是用来专门解决该问题的，只不过后来因为 Mixin 的隐式以来和命名冲突等问题，逐步被 HOC 和 ReactHooks 所替代。

## Mixin
### 什么是 Mixin

Mixin 并不是 React 独有（Vue 中也有，并被广泛应用），而是*一种普遍面向对象编程领域的一种设计模式*。

在谈论 Mixin 之前，我们要先知道继承，其中继承又分为*单继承*和*多继承*。

> 多继承相较于单继承而言，多继承的模式使用风险较高，因为会带来继承歧义的问题，如[钻石问题](https://zhuanlan.zhihu.com/p/75744363)。

虽然多继承有弊端，但是单继承又无法很方便的实现某些繁琐的抽象，而 *Mixin 就是实现多继承的一种模式*。

### 如何实现 Mixin

对于实现 Mixin 来说，代码也相对简单，核心就是将需要混入的方法挂在到目标对象的 `prototype` 上。

````javscript
function mixin(target, mixins = []) {
  if (mixins.length) {
	  for (let index = 0; index < mixins.length; index++) {
      const mps = mixins[index].prototype;
      for (let pn in mps) {
        if (mps.haOwnProperty(pn)) {
          target.prototype[pn] = mps[pn]; //  最核心的地方，将需要混入的方法挂载到 target.prototype 上
        }
      }
    }
  }
  return target;
}
````


### React 中如何使用 Mixin

> 在当前版本中（16.13.1），无法直接使用 `React.createClass`，需要额外安装 `create-react-class`。

我们需要借助 `mixins` 属性来实现，将需要混入的方法以数组的形式传给 `mixins`即可。

在下面的代码中，我们将 `setIntervalMixin` 对象通过 `mixins` 混入了 `Greeting` 组件中；其中 `setIntervalMixin` 包含了三个方法。


````javascript
const setIntervalMixin = {
  componentWillMount() {
    this.intervals = [];
  },
  setInterval() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount() {
	  this.intervals.forEach(clearInterval);
  },
}

import createReactClass from 'create-react-class';

class Greeting = createReactClass({
  mixins: [setIntervalMixin], // Use Mixin .
  getInitialState() {
	  return { seconds: 0 };
  },
  componentDidMount() {
    this.setInterval(this.tick, 1000);
  },
  tick: function() {
    this.setState({ seconds: this.state.seconds + 1 });
  },
  render: function() {
    return <h1>Hello, {this.state.seconds}</h1>;
  }
});
````


可以看出，`mixins` 可以将一些逻辑抽离出来，并且也可以使用声明周期，通过 `this` 去相互调用。

### 为什么不推荐使用 Mixin

其实通过前面 `mixins` 使用就会发现，`mixins` 带来的坏的影响就是 Mixin 和组件之间的依赖太混乱了，两者可以相互调用，无法追踪和管理这些 state；还有一点较为明显的就是容易造成命名冲突。

一个 Mixin 可以嵌套另一个 Mixin，这也导致理论上会出现无限层级的嵌套，这对维护者来说，也是一个巨大的挑战。

当遇到多人开发的时候， Mixin 的风险被放大，如当你修改一个 Mixin 的时候，你无法知道这个 Mixin 会带来什么后果，可能你新增的 Mixin 某个方法名与组件内部的方法发生了冲突。

*总之，Mixin 的缺点显而易见，主要包括命名冲突、依赖混乱等，这也是为什么不推荐使用 Mixin 的原因。*

> Vue 中 Mixin 的使用较为常见，但是根据最新 3.0-beta 版本来看， mixin 的问题给了最新的解决方案。

## HOC

> 高阶函数和高阶组件类似，高阶组件本事就是从高阶函数演进而来的。

为了解决 Mixin 的所带来的问题， HOC 出现了。在 HOC 中，其本身是一个函数，接收一个组件作为参数，并返回一个新的组件。

> 如果说 Mixin 是面向对象编程模式，那么 HOC 就是函数式编程模式。

> 另外， HOC 并不是 React 的 API，也不专属于 React，和 Mixin 一样，只是一种新的开发模式或编程范式。

HOC  基本使用：

````javascript
const withLoading = WrappedComponent => {
  const ComponentWithLoading = props => {
    const [isLoading, setLoadingVisible] = useState(false);
    return (
	    <>
        { isLoadingVisible ? <div> Loading... </div> : null }
        <WrappedComponent {...props} setLoadingVisible={setLoadingVisible} />
      </>
    );
  }
}
````


可以看到，HOC 是将组件进行更高一层的封装，组件不会像 Mixin 那样，收到任何侵入；而且我们可以自由选择组件是否需要进行 HOC，灵活性很好。 

另外，在写法中，Mixin 中更多的体现了面向对象的思想，而 HOC 更多的体现了函数式编程，这写更符合现代 JavaScript 的编程思想。

在实际业务中，HOC 模式可以应用在如日志收集、状态传递、身份认证、UI动作相应等场景中。

不过，*HOC 也不是万金油，仍然存在下列问题：*

- JSX 嵌套地狱，导致难以调试；
- 当多层嵌套的时候，需要保证 HOC 的使用顺序；
- 多层 HOC 的时候，props 在传递过程中容易被篡改而无法得知；


## Hooks

16.8 的出现，引入了 Hooks，解决了 HOC 和 Mixin 的缺陷；在大多数情况下， Hooks 都是可以替代 HOC 和 Mixin 的。

关于 Hooks 我会专门开一篇文章来介绍。
