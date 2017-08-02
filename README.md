# vue-vuex学习和总结

## vuex

> 场景重现：一个用户在注册页面注册了手机号码，跳转到登录页面也想拿到这个手机号码，你可以通过vue的组件化通讯来实现数据的传递，子组件传递事件`$emit('事件', data)`,父组件来监听这个自定义事件`@事件`调用这个方法，如果对于数据复杂的情况下，你是不是需要一个能够让所有的组件都访问一个数据源的需求?

**Vuex：**就是专门管理vue.js开发的状态管理模式，集中管理了组件的状态和数据，这样我们可以清楚的知道哪一个数据被改变。

*什么情况下需要使用vuex*: 当你的页面数据很复杂，通讯很复杂的时候，vuex就是一个非常不错的选择了。

### 单向数据流

- **state**，驱动应用的数据源；
- **view**，以声明方式将**state**映射到视图；
- **actions**，响应在**view**上的用户输入导致的状态变化。

![单向数据流图](https://vuex.vuejs.org/zh-cn/images/flow.png)

1. 所有的状态都是通过state反应
2. 所有的组件数据驱动都是来自于一个对象

### 运行原理

1. **Vue组件**通过dispatch来触发**Vuex的actions**
2. Vuex的actions触发自己内部的**mutations**
3. mutations触发内部的数据源state
4. 数据源(state)反过来渲染**Vue组件**

![运行原理](https://vuex.vuejs.org/zh-cn/images/vuex.png)

### 开始使用

- 安装依赖

  ```html
  npm install --save vuex
  ```

- 使用

  1. 在项目中的src下面创建一个store目录，然后在store目录下创建一个store.js文件

  ```javascript
  // src下面的store.js
  import Vue from 'vue';
  import Vuex from 'vuex'
  Vue.use(vuex);

  export default new Vue.Store({
    state: {
      count: 0
    },
    mutations: {
      increment: (state) => state.count++;
      decrement: (state) => state.count--;
    }
  })
  ```

  *解析*：上面的代码导入了vue和vuex模块，然后注册使用vuex，最后导出一个vuex的实例，在state中定义了`count`属性，用来计数，然后通过`mutations`定义了`increment`和`decrement`方法用来数据的加减。

  ​

  1. 在项目的vue初始化的时候引用并初始化。main.js中写下如下代码

  ```javascript
  import store from '.src/store.js'  //引入store

  //vue实例中使用
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
  ```

- 解释说明

  每一个vuex的核心就是一个`store`(仓库)。`store`相对于是一个容器，里面存放着你的项目中的大部分的状态。

  **主要注意下面2点来理解vuex**

  1. `Vuex`的状态管理是响应式的。我们在Vue组件中使用了state，如果vuex中的state发生变化的时候，对应的组件也会相应的state也会发生变化，所以一般在vue组件中使用计算属性`computed`，来获取vuex中state的值。
  2. 在严格模式下，`state`的状态只能通过`mutations`来通过commit来修改。这样方便我们对于数据源和数据的监听和使用。

#### **项目中简单的使用可以查看我的[github地址](https://github.com/huangchucai/vue-vuex)**

## 核心api

vuex中主要的状态管理和模块化都是通过5个api来实现交互和数据的传递。

1. state
2. mutations
3. getters
4. actions
5. modules

### 1. state(状态的管理)

#### **单一的状态树**

Vuex使用的是单一的状态管理，一个仓库`store`包含了项目中所有的数据，每一个应用都只包含一个`store`实例，单一的状态树可以让我们更加直接定位到对应的数据源。

**单一的状态树和一切皆模块的思想**并不冲突----后面我们会讲到通过vuex的模块化机制来管理和分布到各个文件中。

#### Vue组件中获取vuex的状态（state）

由于Vuex中的状态储存是响应式的，从store实例中获取读取状态最好是通过计算属性来返回某个状态。

```vue
computed: {
  count() {
    return this.$store.state.count
  },
}
```

每次当数据源`this.$store.state.count`发生变化的时候，都会触发计算属性重现计算并且触发相应的dom渲染。

#### mapState辅助函数

当一个组件需要很多状态的时候，讲这些状态都声明成`computed`是不是会显得很冗余，为了解决这个问题，我们需要引入mapState辅助函数帮助我们生成计算属性(少些了this.$store,和store.js里面写法一样了)。

```javascript
// 对应的文件引入mapState 
import {mapState} from 'vuex'

export default {
  // ...
  computed: {
    count: state => state.count,
    
    //传字符串参数'count', 等同于`state => state.count`
    countAlias: 'count',
    
    // 为了能够使用` this `,获取局部变量，必须使用常规函数
    countPlusLocalState(state) {
      return state.count + this.localCount
    }
  }
}
```

当映射的计算属性的名称和state的子节点的名称相同时，我们也可以给mapState传入一个字符串数组。

```javascript
computed: mapState(['count']) //映射  this.count 为 store.state.count

// 当我们执行mapState的时候返回的是一个对象，包含了我们传入的参数
mapState(['count','todos'])  //运行函数
// 得到了一个对象
Object
	count: function mappedState()
	todos: function mappedState()
    __proto__
```

#### 对象展开符

mapState函数返回的是**一个对象**。我们如果才能把它和局部的计算属性混合使用呢？就是说，我们需要一个工具，把多个对象合并成一个对象，ES6的**对象展开运算符**正好满足

```javascript
computed: {
  localComputed() {
    /*.....*/
  },
  ...mapState({
    //...
  })  
}

// 实际运用
computed: {
  name() {
    return this.$store.state.a.name
  },
  ...mapState(['count']),
},
```

#### 组建中仍然可以保有局部变量

使用了Vuex后并不代表你**所有**的状态都需要放到Vuex中，虽然将所有的状态放到 Vuex 会使状态变化更显式和易调试，但也会使代码变得冗长和不直观。如果有些状态严格属于单个组件，最好还是作为组件的局部状态。你应该根据你的应用开发需要进行权衡和确定。

### 2.Getters

有时候我们需要从`store`中的`state`中派生一些状态，例如对列表进行过滤并计数

```javascript
computed: {
  doneTodosCount: {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

如果我们有多个组件都需要用到此属性，我们是选择复制这个函数，还是抽取成一个共享函数然后多处导入--好像不管是哪一种都不太合理。



Vuex允许我们在store中定义『getters』（可以认为是 store 的计算属性）。

Getters接受state作为它的第一个参数：

```javascript
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodo(state){
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

同时Getters会被暴露成为store.getters对象

```javascript
// store.js中使用
store.getters.doneTodo // -> [{ id: 1, text: '...', done: true }]
```

Getters也可以接受其他getters作为第二个参数

```javascript
getters: {
  //...
  doneTodoCount:(state,getters){
    return getters.doneTodo.length
  }
}

store.getters.doneTodosCount // -> 1
```

我们也可以在组建中使用getters

```javascript
computed: {
  doneTodoCount() {
    return this.$store.getters.doneTodoCount
  }
}
```

#### mapGetters 辅助函数

`mapGetters` 辅助函数仅仅是将 store 中的 getters 映射到局部计算属性：传入一个**数组**

```javascript
import {mapGetters} from vuex;

export default {
  computed: {
    // 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters(['doneTodoCount','anotherGetter'])
  }
}
```

可以将getters属性另取一个值，使用**对象的模式**

```javascript
mapGetters({
   // 映射 this.doneCount 为 this.$store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```

### 3.Mutations

上一部分我们知道`getters`可以说是`state`的计算属性，并不能改变state的值。更改Vuex中`state`的唯一方法就是提交`mutations`。Vuex中的mutations类似于一个事件。每一个mutation都拥有一个**事件类型（type）**和**回调函数(handle)**。这个回调函数就是我们实际进行状态修改的地方，并且它**接受state作为第一个参数**。

```javascript
const store = new Vuex.store({
  state: {
    count: 1
  },
  mutations: {
    increment(state){
      // 变更状态
      state.count++
    }
  }
})
```

你不能直接调用一个mutations handle。这个选项更像一个事件注册：“当触发一个类型为increment的mutations的时候，调用此函数。要唤醒一个 mutation handler，你需要以相应的 type 调用`store.commit`方法：

```javascript
store.commit('increment')
this.$store.commit('increment')
```

#### 提交载荷(Payload)

你可以向store.commit传入额外的参数，即mutation的**载荷（payload）**

```javascript
// ...
mutations: {
  increment(state,n) {
    state.count += n
  }
}

//如果payload是一个值，就会被直接覆盖旧的载荷
```

在大多数情况下，载荷都是一个对象，这样可以包含多个字段并且记录的mutations更加具有可读性

```javascript
//... 
mutations: {
  increment(state,payload) {
    state.count+ = payload.amount
  }
}

store.commit('increment',{
  amount: 10
})
```

#### 对象风格

提交mutations的另一种方式就是使用包含的`type`属性

```javascript
store.commit({
  type: 'increment',
  amount: 10
})
```

当使用对象风格的提交方式，整个对象都会作为载荷传给mutations函数，因此 handler 保持不变

```javascript
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

#### Mutations 需遵守 Vue 的响应规则

由于Vuex的`state`是响应式的，当我们状态更新的时候，对应的监听状态的vue也会更新，这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

1. 最好提前在你的 store 中初始化好所有所需属性。

2. 当需要在对象上添加新属性时，你应该

   - 使用 `Vue.set(obj, 'newProp', 123)`, 或者 -

   - 以新对象替换老对象。例如，利用 stage-3 的[对象展开运算符](https://github.com/sebmarkbage/ecmascript-rest-spread)我们可以这样写：

     ```javascript
     state.obj = { ...state.obj, newProp: 123 }
     ```

#### Mutation 必须是同步函数

一条重要的原则就是要记住**mutation 必须是同步函数**

> 当我们改变数据的时候，需要知道对应的数据变化，如果是异步的函数，发送请求，我们不知道什么时候请求返回，这样我们无法跟踪`state`的改变

#### 组件中提交mutations

和上面的一样，我们可以直接通过`this.$store.commit('xxx')`提交mutations，也可以通过辅助**函数mapMutations**将组件中的`methods`映射到对应的`store.commit`中。

```javascript
import {mapMutations} from vuex 

export default{
  // ... 
  methods: {
    ...mapMutations(['increment']),  // this.increment() 为 this.$store.commit('increment')
    ...mapMutations({
      add: 'increment'   // 映射 this.add() 为 this.$store.commit('increment')
    })
  }
}
```

### 4.Actions

action类似于mutation，不同在于： 

1. Action提交的是mutation，而不是直接变更状态
2. Action可以包含任何异步操作

一个简单的action例子

```javascript
const store = new Vuex.store({
  state: {
    count: 0
  },
  mutations: {
    increment(state){
      state.count++
    }
  },
  actions: {
    increment(context){
      context.commit('increment')
    }
  }
})
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 `context.commit` 提交一个 mutation，或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters。当我们在之后介绍到 [Modules](https://vuex.vuejs.org/zh-cn/modules.html) 时，你就知道 context 对象为什么不是 store 实例本身了 => 因为模块化的区域和根区域分开。

**实际工作做，我们会经常用到ES2015的参数解构来简化代码**

```javascript
actions: {
  increment({commit}){
    commit('increment')
  }
}
```

#### 分发Action

**Action通过store.dispatch方法触发**

```javascript
store.dispatch('increment')
```

乍一眼看上去感觉多此一举，我们直接分发 mutation 岂不更方便？实际上并非如此，还记得 **mutation 必须同步执行**这个限制么？Action 就不受约束！我们可以在 action 内部执行**异步**操作：

```javascript
actions: {
  incrementAsync({commit}){
    setTimeout(() => {
      commit('increment')
    },1000)
  }
}
```

由于action提交的是mutations,所以Actions同样支持**载荷方式**和**对象方式**进行分发：

```javascript
//以载荷形式分发
store.dispatch('increment',{amount: 10})
//以对象形式分发
store.dispatch({
  type: 'increment',
  amount: 10
})
```

#### 在组建中分发Action

在组件中使用`this.$store.dispatch('xxx')`分发action，或者使用mapActions辅助函数将组件的methods映射为store.dispatch调用

```javascript
import {mapActions} from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions(['increment']) //映射this.increment() 为this.$store.dispatch('increment')
    ...mapActions({
      add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
    })
  }
}
```

#### 组合Actions

Action 通常是异步的，那么如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？

首先，我们应该知道`store.dispatch`可以处理被触发的action的回调函数返回的promise，并且`store.dispatch`仍旧返回Promise：

```javascript
// actionA返回一个promise并触发`someMutation`
actions: {
 actionA({commit}){
   return new Promise((resolve,reject) => {
     setTimeout(() => {
       commit('someMutation')
       resolve()
     },1000)
   })
 }  
}  
```

现在我们可以调用actionA

```javascript
store.dispatch('actionA').then(() => {
  // ....
})
```

也可以在另一个action中调用actionA

```javascript
actions: {
  //...
  actionB({dispatch, commit}) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

当然，如果我们通过`async/await`来处理，更加方便的组合action: 

```javascript
//store.js 公司代码为例
state: {
  user: ''
}
mutations: {
  update(state,user){
    state.user = user;
  }
}
actions: {
  // 登录页面
  async login({dispatch},data) {
    return await dispatch('update',await fetch.post('/front/login',data))
  }
  // 更新登录状态
  async update({commit},user){
    commit('update',user)
  }
}
```

登录页面中调用actions中的login

```javascript
// login.vue
this.$store.dispatch('login',{
  username: 'hcc',
  password: '123456'
})
```

