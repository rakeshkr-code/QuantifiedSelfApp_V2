// NavBar Component...

export default {
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">QtfSelf</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" v-if="this.$store.state.loggedIn" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/contactus">Contact Us</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/about">About Us</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/help">Help</router-link>
                    </li>
                </ul>
                <router-link class="btn btn-sm btn-primary" v-if="this.$store.state.loggedIn" to="/profile" data-bs-toggle="tooltip" data-bs-placement="top" title="PROFILE">
                    <i class="bi bi-person-square"></i>
                </router-link> &nbsp; &nbsp; &nbsp;
                <button class="btn btn-sm btn-danger" v-if="this.$store.state.loggedIn" id='logout' @click='logoutUser' data-bs-toggle="tooltip" data-bs-placement="left" title="LOGOUT"> 
                    <i class="bi bi-box-arrow-right"></i> Logout
                </button v-if="error">

            </div>
        </div>
    </nav>
  `,
  methods: {
    ...Vuex.mapActions(['logoutUser']),
  },
}