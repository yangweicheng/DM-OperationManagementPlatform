import {routes} from './router';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui';
import $ from 'jquery'
import {getCookie,delCookie} from "../js/api/cookie";
require("../css/reset.css");
import "element-ui/lib/theme-default/index.css";

// import axios from 'axios'
// Vue.prototype.axios=axios
// axios.defaults.baseURL="http://192.168.0.133:8080"
// axios.interceptors.response.use(function (response) {
//     // 对响应数据做点什么
//     console.log(response);
//     return response
//   }, function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   });

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI);

import App from '../components/app';

const router=new VueRouter({
    routes
});
Vue.http.options.crossOrigin = true;
Vue.http.options.emulateHTTP = true;
Vue.http.interceptors.push(function(request, next) {
    var  token = getCookie('token');
    request.headers.set("Token",token);
  next(function(response){
        if(response.body.statusCode==911){
            sessionStorage.clear("active");
            sessionStorage.clear("activeT");
            this.$router.push("/token");
        }
    })
});
// Vue.http.options.emulateJSON = true;
Vue.filter("fil",function(value,begin){
    if(value===begin){
        return true;
    }
    return false;
})
new Vue({
    router:router,
    render:function (h) {
        return h(App)
    },
    data: {
        eventHub: new Vue()
    }
}).$mount("#app")
