import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// import axios from "axios";
import api from "./api/index";

import "tailwindcss/tailwind.css";

// Vue.prototype.$ajax = axios;
Vue.prototype.$api = api;

Vue.use(Element);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
