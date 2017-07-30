<template>
  <div id="header">
    <router-link to="/hello"><button>hello</button></router-link>
    <router-link to="/world"><button>world</button></router-link>  
    <button @click="useA">调用moduleA</button>
    <h1>{{name}}</h1>
  </div>

</template>
<script>
  import { mapState } from 'vuex'
  export default {
    name: 'hello',
    data() {
      return {
        msg: 'hhhhh'
      }
    },
    mounted() {
      console.log(mapState(['count','todos']))
    },
    computed: {
      name() {
        return this.$store.state.a.name
      },
      ...mapState(['count']),
    },
    methods: {
      useA() {
        this.$store.commit('doubleA')
      }
    }
  }
</script>
<style lang="css">
  
</style>
