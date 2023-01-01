import FetchFunction from '../FetchFunction.js'
import ApiUrl from '../config.js'

export default {
  template: `<div>
  <!-- ==========================Title========================== -->
  <div class="mt-2 mb-3">
    <h1 class="makecenter"> Register Yourself </h1>
  </div>

  <!-- ========================LogIn Form======================== -->
  <div class="container card shadow-sm col-sm-6 mb-2">
    <div class="form-floating mt-2 mb-2">
      <input type="text" class="form-control"  id="floatingInput" v-model='signUpData.fname' placeholder='first name'>
      <label for="floatingInput">Enter Your First Name</label>
    </div>
    <div class="form-floating mb-2">
      <input type="text" class="form-control"  id="floatingInput" v-model='signUpData.lname' placeholder='lastname'>
      <label for="floatingInput">Enter Your Last Name</label>
    </div>
    <div class="form-floating mb-2">
      <input type="email" class="form-control" v-bind:class = "emailvalidity" id="floatingInput" v-model='signUpData.email' placeholder='name@example.com'>
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating mb-2">
      <input type="password" class="form-control" id="floatingPassword" v-model='signUpData.password' placeholder='12345678' v-on:keyup.enter="loginUser(userInfo)">
      <label for="floatingPassword">Password</label>
    </div>
    <button class="btn btn-success mb-1" @click="SignUp"> 
      <i class="bi bi-plus-square"></i> SignUp 
    </button>

    <div class="mb-2 makecenter">
      <b> If you are an existing user, please </b>
      <router-link class="btn btn-sm btn-secondary" to="/login"> LogIn </router-link> 
    </div>
  </div>

  <!-- ==========================Extras========================== -->
  

  <div class="container col-sm-6">
    <p> <span style="font-size: 0.8rem; padding: 0.2rem;" class="rounded" v-bind:class = "criteria.loweralpha">At least 1 lower case character</span> </p>
    <p> <span style="font-size: 0.8rem; padding: 0.2rem;" class="rounded" v-bind:class = "criteria.upperalpha">At least 1 upper case character</span> </p>
    <p> <span style="font-size: 0.8rem; padding: 0.2rem;" class="rounded" v-bind:class = "criteria.anydigit">At least 1 number character</span> </p>
    <p> <span style="font-size: 0.8rem; padding: 0.2rem;" class="rounded" v-bind:class = "criteria.specialchar">At least 1 special character</span> </p>
    <p> <span style="font-size: 0.8rem; padding: 0.2rem;" class="rounded" v-bind:class = "criteria.lencondn">At least 8 chacters</span> </p>

  </div>

  </div>`,

  data() {
    return {
        signUpData: {
            fname: null,
            lname: null,
            email: null,
            password: null,
        },
        emailvalidity: '',
        criteria: {
          loweralpha: "border border-danger",
          upperalpha: "border border-danger",
          anydigit: "border border-danger",
          specialchar: "border border-danger",
          lencondn: "border border-danger",
        },
    }
  },

  methods: {
    SignUp() {
      if (! (this.signUpData.fname && this.signUpData.email && this.signUpData.password)){
        alert("Name, Email or Password Missing. Please Fill the Form Properly")
        return
      }
      const res = FetchFunction({
        url: `${ApiUrl}/user`,
        init_obj: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.signUpData),
        },
      })

      res
        .then(() => {
          alert('New User Created')
          this.$router.push({ name: 'login' })
        })
        .catch((err) => {
          alert(err)
        })
    },

  },
  watch: {
    'signUpData.email': function(new_value) {
      this.emailvalidity = 'border border-danger'
      if (new_value.match(/.*@.*\...*/gi)){
        this.emailvalidity = "border border-2 border-success";
      }
    },
    'signUpData.password': function(new_value) {
      this.criteria.loweralpha = "border border-danger";
      this.criteria.upperalpha = "border border-danger";
      this.criteria.anydigit = "border border-danger";
      this.criteria.specialchar = "border border-danger";
      this.criteria.lencondn = "border border-danger";
      if (new_value.length > 7) {
        this.criteria.lencondn = "border border-success";
      }
      for (let i = 0; i < new_value.length; i++) {
          let a = new_value[i];
          let b = new_value.charCodeAt(i);
          if (a >= "a" && a <= "z") {
              this.criteria.loweralpha = "border  border-success";
          }
          else if (a >= "A" && a <= "Z") {
              this.criteria.upperalpha = "border  border-success";
          }
          else if (a >= "0" && a <= "9") {
              this.criteria.anydigit = "border  border-success";
          }
          else if ((b >= 32 && b <= 47) || (b >= 58 && b <= 64)) {
              this.criteria.specialchar = "border  border-success";
          }
      }
    }
  },
}