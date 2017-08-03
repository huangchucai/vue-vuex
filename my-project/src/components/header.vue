<template>
  <div id="header">
    <router-link to="/hello"><button>hello</button></router-link>
    <router-link to="/world"><button>world</button></router-link>  
    <button @click="useA">调用moduleA</button>
    <button @click="deleteTodos">调用deleteTodos</button>
    <button @click="addTodos">调用addTodos</button>
    <h1>{{name}}</h1>
  </div>

</template>
<script>
  import { mapState,mapGetters,mapMatutions } from 'vuex'
  export default {
    name: 'hello',
    data() {
      return {
        msg: 'hhhhh'
      }
    },
    mounted() {
      console.log(this.$store.getters)
      console.log(this.$store.commit)
      console.log(this.$store.dispatch)
    },
    computed: {
      name() {
        return this.$store.state.a.name
      },
      ...mapState(['count']),
      ...mapGetters({A: 'doubleCountB'})
    },
    methods: {
      useA() {
        this.$store.commit('doubleA')
        console.log(this.$store.getters)
        console.log(this.A);
      },
      deleteTodos() {
        this.$store.commit('deleteTodos',1)
      },
      addTodos() {
        this.$store.commit('addTodos',{ id: 3, text: '...', done: false })
      }
    }
  }
</script>
<style lang="css">
  
</style>
