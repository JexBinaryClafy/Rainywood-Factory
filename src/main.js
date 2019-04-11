// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import bus from '@/utils/bus'
import BaiduMap from 'vue-baidu-map'
import echarts from 'echarts'

require('@/assets/css/style.css')
Vue.prototype.bus = bus
//Vue.prototype.URLHEAD = 'http://localhost:62578/Interface/API.aspx?Method='
Vue.prototype.URLHEAD = 'http://114.115.153.22:3333/Interface/API.aspx?Method='
Vue.prototype.COLORS=[
  '#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#e062ae', '#e690d1', '#e7bcf3',
  '#9d96f5', '#8378ea', '#96bfff'
]

Vue.prototype.dateShift = function(offset){
  let now = new Date()
    let newTime = new Date(now.getTime() + (offset * 24 * 60 * 60 * 1000))
    let obj = {
        year: newTime.getFullYear(),
        month: (newTime.getMonth() + 1 < 10) ? '0' + (newTime.getMonth() + 1) : newTime.getMonth() + 1,
        day: newTime.getDate() < 10 ? '0' + newTime.getDate() : newTime.getDate()
    }
    return `${obj.year}-${obj.month}-${obj.day}`
}

Vue.prototype.$Crender = function (id, option) {
  let wrapper = document.getElementById(id)
  let chart = echarts.init(wrapper)
  chart.setOption(option)
  chart.resize()
  window.resize = function () {
    chart.resize()
  }
  return chart
}
Vue.prototype.oneMonthAgo = function () {
  let now = new Date()
  let obj = {
    year: now.getFullYear(),
    month: (now.getMonth()) >= 10 ? now.getMonth() : '0' + now.getMonth(),
    day: now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()
  }
  return `${obj.year}-${obj.month}-${obj.day}`
}


Vue.prototype.today = function () {
  let now = new Date()
  let obj = {
    year: now.getFullYear(),
    month: (now.getMonth() + 1) >= 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1),
    day: now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()
  }
  return `${obj.year}-${obj.month}-${obj.day}`
}
Vue.prototype.yesterday = function () {
  let now = new Date()
  let obj = {
    year: now.getFullYear(),
    month: (now.getMonth() + 1) >= 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1),
    day: (now.getDate()-1) >= 10 ? now.getDate()-1 : '0' + (now.getDate()-1)
  }
  return `${obj.year}-${obj.month}-${obj.day}`
}

Vue.use(BaiduMap,{
  ak:'7I6eFbjHbRo9PTClcG7VDzamxC9ct4il'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
