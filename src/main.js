import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');

const API_BASE_URL = 'http://greenvelvet.alwaysdata.net/kwick/api';

export default API_BASE_URL;
