import footerComp from './components/FooterComp.js'
import Main from './components/Main.js'
import router from './router/index.js'
import store from './vuex/index.js'
import HeaderComp from './components/NavBar.js'


const vm = new Vue({
  el: '#app',
  template: `<div>
    <HeaderComp />
    <Main></Main>
    <footer-comp class="footersec"></footer-comp>
  </div>`,
  data: {},
  components: {
    'footer-comp': footerComp,
    Main,
    HeaderComp,
  },
  router,
  store,
})