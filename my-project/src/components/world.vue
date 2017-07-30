<template>
  <div class="world">
    <h1>{{msg}}</h1>
    <h2>{{length}}</h2>
    <router-link to="/">返回</router-link>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',

    }
  },
  computed: {
    length() {
      return this.$store.getters.doneTodosCount
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
