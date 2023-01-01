export default {
    template: `<div> 
    <!-- ==========================Title========================== -->
    <div class="mt-3 mb-3">
      <h1 class="makecenter"> LogIn </h1>
    </div>

    <!-- ========================LogIn Form======================== -->
    <div class="container card form-card shadow-sm col-sm-6">
      <div class="form-floating mt-3 mb-2">
        <input type="email" class="form-control" v-bind:class = "emailvalidity" id="floatingInput" v-model='userInfo.email' placeholder='name@example.com'>
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating mb-2">
        <input type="password" class="form-control" v-bind:class = "passvalidity" id="floatingPassword" v-model='userInfo.password' placeholder='12345678' v-on:keyup.enter="loginUser(userInfo)">
        <label for="floatingPassword">Password</label>
      </div>
      <button class="btn btn-success mb-3" @click="loginUser(userInfo)"> 
        <i class="bi bi-box-arrow-in-right"></i> Login 
      </button>
    </div>

    <!-- ==========================Extras========================== -->
    <div class="mt-2 mb-2 makecenter">
      <div v-if="this.$store.state.loggedIn"> <b> State: You are Logged In </b> </div>
      <div v-else>  
        <b> State: You are NOT Logged In </b> <br>

        <b> If you are new to our app, please </b>
        <router-link class="btn btn-sm btn-secondary" to="/signup" data-bs-toggle="tooltip" data-bs-placement="top" title="SignUp">
          SignUp
        </router-link> 
      </div>
    </div>


    </div>`,
  
    data() {
      return {
        userInfo: {
          email: null,
          password: null,
        },
        emailvalidity: 'border border-2 border-danger',
        passvalidity: 'border border-2 border-danger',
      }
    },
    methods: {
      ...Vuex.mapMutations(['login', 'logout']),
      ...Vuex.mapActions(['loginUser']),
    },
    watch: {
      'userInfo.email': function(new_value) {
        this.emailvalidity = 'border border-2 border-danger'
        if (new_value.match(/.*@.*\...*/gi)){
          this.emailvalidity = "border border-2 border-success";
        }
      },
      'userInfo.password': function(new_value) {
        this.passvalidity = 'border border-2 border-danger'
        if (new_value.length >= 3){
          this.passvalidity = "border border-2 border-success";
        }
      }
    },
  }