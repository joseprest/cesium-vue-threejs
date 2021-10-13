<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
// window.onresize = () => {
//   let RootFontSize = document.body.offsetWidth / 100;
//   document.getElementsByTagName("html")[0].style.fontSize = RootFontSize + "px";
// };
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
</style>
