<template>
  <div id="app">
    <div id="navwrapper">
      <nav>
        <ul class="link-list pos-left">
          <li class="item">
            <router-link to="/onepic">"一张图"实战指挥应用视图</router-link>
          </li>
          <li class="item">
            <span>\</span>
          </li>
          <li class="item">
            <router-link to="/remoter">远程监控系统视图</router-link>
          </li>
        </ul>
        <div alt class="logo" :class="viewName"></div>
        <ul class="link-list pos-right">
          <li class="item">
            <router-link to="/party">党政建设与流程监管</router-link>
          </li>
          <li class="item">
            <span>/</span>
          </li>
          <li class="item">
            <router-link to="/eff">综合效能评估视图</router-link>
          </li>
        </ul>
      </nav>
    </div>
    <section>
      <router-view/>
    </section>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      viewName: ""
    };
  },
  created() {
    this.getViewName();
  },
  methods: {
    getViewName() {
      let that = this
      this.bus.$on('loadView',v=>{
        that.viewName = 'logo-'+v
      })
    }
  },
  beforeDestroy() {
    this.bus.$off('loadView')
  }
};
</script>

<style>
</style>
