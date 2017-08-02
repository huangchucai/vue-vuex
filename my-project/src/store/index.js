import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex)

// 定义模块化
const moduleA = {
  state: {
    name: 'A'
  },
  mutations: {
    doubleA(state) {
      state.name = `${state.name}-${state.name}`
    }
  },
  actions: {

  },
  getters: {
    doubleCount (state) {
      return `${state.name}-${state.name}`
    }
  }
}

const moduleB = {
  state: {
    name: 'B',
    count: 1
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    doubleCountB (state,getters,rootstate) {
      console.log(getters.addCount)
      console.log(rootstate)
      return `${state.name}-${state.name}`
    },
    addCount(state) {
      return ++state.count
    }
  }
}

export default new Vuex.Store({
  state: {
    count: 0,
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    doneTodosCount: (state,getters) => {
      return getters.doneTodos.length
    }
  },
  mutations: {
  	increment: state => state.count++,
    decrement: state => state.count--,
    addTodos(state,payload) {
      debugger
      state.todos.push(payload)
    },
    deleteTodos(state,payload) {
      debugger
      state.todos.splice(payload,1);
    }
  },
  // 异步操作
  actions: {
    increment ({commit},payload) {
      console.log(payload)
      setTimeout(()=>{
        commit('increment')
      },2000)
    }
  },
  // 模块化 
  modules: {
    a: moduleA,
    b: moduleB
  }
})
