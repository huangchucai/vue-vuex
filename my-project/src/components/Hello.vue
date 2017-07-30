<template>
  <div class="hello">
    <p>{{ count }}</p>
    <p>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
    </p>
    <router-link to="/">返回</router-link>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created() {
    console.log(this.$store.state)
  },
  computed: {
    count () {
	    return this.$store.state.count
    },
    todos() {
      return this.$store.getters.doneTodos
    }
  },
  methods: {
    increment() {
      // this.$store.commit('increment') // 通过mutations触发
      //this.$store.dispatch('increment',10); //通过actions触发
      this.add(10);    
      this.$store.commit('addTodos',{id:3,text: '3',done: true})
    },
    decrement () {
    	this.$store.commit('decrement')
    },
    //组件中分发
    // ...mapActions(['increment'])
    ...mapActions({
      add: 'increment',     
    })
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
