import FetchFunction from '../FetchFunction.js'
import router from '../router/index.js'

const store = new Vuex.Store({
  // ...
  state: {
    loggedIn: localStorage.getItem('token') ? true : false,
  },

  getters: {
    token(state) {
      if (state.loggedIn === true) {
        return localStorage.getItem('token')
      } else {
        return null
      }
    },
  },
  mutations: {
    login(state) {
      state.loggedIn = true
    },
    logout(state) {
      state.loggedIn = false
    },
  },

  actions: {
    async loginUser({ commit }, user) {
      if (! (user.email && user.password)){
        alert("Email or Password Missing. Please Enter Info properly")
        return
      }
      // User Login...
      FetchFunction({
        url: 'http://127.0.0.1:5000/login?include_auth_token',
        init_obj: {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(user),
        },
      })
        .then((data) => {
          const authToken = data.response.user.authentication_token
          console.log(authToken)
          localStorage.setItem('token', authToken)
          commit('login')
          router.push({ name: 'homedashboard' })
        })
        .catch((err) => {
          alert(err)
        })
    },
    logoutUser({ commit }) {
      localStorage.removeItem('token')
      commit('logout')
      router.push({ name: 'login' })
    },
  },
})

export default store