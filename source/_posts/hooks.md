---
title: Hooks.
date: 2020-06-01 10:17:11
tags:
---

## 前言

一般的，我们在日常使用 React 中，有两种组件声明方式：使用 Class 类和 Function 来声明。

也就是说，React 的组件类型有两种，一种是 Class 组件，另一种是函数式组件。

> 在 React 早期，开发模式更贴近于面向对象的编程思想，无论是使用 React.createClass API 还是 ES6 Class 类的方式声明组件，绝大部份组件都是 Class 组件类型的。每一个组件都是一个类，内部的状态和函数都被挂在类的实例上。

## 函数式组件的优点

React 官方比较推崇函数式组件。并且，在我的日常开发中，也的确能感受到*函数式组件所体现的优势：容易拆分、易于测试*。

## 函数式组件的问题

虽然函数式组件优势较为明显，但是由于*函数式组件没有生命周期、内部状态等特性*，无法完全实现 Class 的所有功能特性，这就导致函数式组件的使用场景有所限制。

因此，React 在 16.8 中引入了 Hooks，目的就是为了增强函数式组件，让函数式组件可以完全替代 Class 组件。

## Hooks 的限制

- 只能在 React 组件中（可是是组件中的任何地方）使用；

> 另外，由于 React Hooks 更像是一种声明式编程，这就导致了一些场景下 Hooks 使用受限（或某些功能的实现使用 Hooks 会很别扭，比如某些场景下无法很好的实现类型 `setState` 的回调功能）。

在 Hooks 中，状态、生命周期、逻辑等都可以写成一个个独立的 Hooks。

在函数式组件中，利用 Hooks ，就可以将所需要的东西“钩”到组件内部。

函数式组件由于没有实例和上下文的概念，所以无法在每次执行的时候，保存任何数据和状态。

useState 为函数式组件引入了状态机制。

> 在使用useState 的时候，需要保证每次相同的调用顺序，如通过 if 来判断是否执行某个 useState 是不允许的。

````javascript
// 错误示例
const  MyComponent = props => {
  const [count, setCount] = useState(1);
  if (count > 2) { // 禁止这么写
    const [title, setTitle] = useState('');
  }

}
````

useEffect 专门来管理副作用的 Hooks。

> 一般的，副作用指的是函数副作用，比如，一个函数除了返回特定值，还在该函数执行过程中，做了其他操作，如修改数据结构、变更 DOM、读取或写入文件等，都可以被称为副作用；除此之外，还有如异步请求、订阅事件、变更 DOM 操作等。


````javascript
const MyComponent = props => {
  // 等价于 componentDidUpdate
  useEffect(() => {
    document.title = 'componentDidUpdate';
  });

  useEffect(() => {
    // 从这里到下方 return 之前等价于 componentDidMount
    getList().then(res => {});

    // return 中的内容等价于 componentWillUnmount
	  return () => {
      console.log('componentWillUnmount');
    }
  }, []);
}
````

更直观的可以查看 [Amelia Wattenberger](https://wattenberger.com/blog/react-hooks)

至此，可以发现，React 解决了函数式组件无法编写生命周期和内部状态的问题，但是 Hooks 解决的问题不仅仅于此。

从早期的 Mixin 、HOC ，到现在的 Hooks，可以发现，React 一直致力于通用逻辑抽象和代码复用的问题。

*我们可以通过构建 Hooks 函数，将函数式组件中的一些逻辑和状态提取到 Hooks 中，这样就天然的形成了一个隔离的、功能完备的，还可以对外暴露的模块，也被称为自定义 Hooks。*

函数式组件可以在内部的任何地方调用 Hooks，来获取需要的功能和状态；


> 需要注意 useEffect 和 useLayoutEffect 的使用场景区别。
 