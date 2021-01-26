import Vue from 'vue'
import App from './App'
import  VConsole  from  'vconsole'
const  vConsole = new VConsole() //注意 

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
