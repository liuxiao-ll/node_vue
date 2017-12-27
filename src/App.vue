<template>
  <div id="app">
    <gheader></gheader>
    <router-view/>
    <gfooter></gfooter>
  </div>
</template>

<script>
import gheader from './base/header'
import gfooter from './base/footer'
export default {
  components: {
    gheader,
    gfooter
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
