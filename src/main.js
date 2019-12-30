import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
const API_URL = 'https://192.168.100.30';

axios({
  method: 'post',
  url: `${API_URL}/api/actions/login`,
  data: {
    username: "admin",
    password: "password"
  }
}).then( (response) => { 
  let token = response.data.access_token;
  // this.setTokenToAllRequests()
  let t_token = 'Bearer ' + token;
  // console.log(t_token);
  localStorage.setItem("interset_token", t_token);
});

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
