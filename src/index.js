import './styles';
import Vue from 'vue';
import VueRouter from 'vue-router';
import router from './router';

Vue.use(VueRouter);

const app = new Vue({ router }).$mount('#app');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}
