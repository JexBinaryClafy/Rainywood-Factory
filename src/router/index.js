import Vue from 'vue'
import Router from 'vue-router'

//import HelloWorld from '@/components/HelloWorld'
import Eff from '@/view/Eff'
import Onepic from '@/view/Onepic'
import Party from '@/view/Party'
import Remoter from '@/view/Remoter'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'Onepic',
      name: 'Home'
    },
    {
      path:'/eff',
      component:Eff,
      name:'Eff'
    },{
      path:'/party',
      component:Party,
      name:'party'
    },{
      path:'/remoter',
      component:Remoter,
      name:'Remoter'
    },{
      path:'/onepic',
      component:Onepic,
      name:'Onepic'
    }
  ]
})
