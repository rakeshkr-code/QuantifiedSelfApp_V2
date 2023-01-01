import FetchFunction from '../FetchFunction.js'
import Wait from '../components/WaitComp.js'
import Error from '../components/ErrorComp.js'
import ApiUrl from '../config.js'

export default {
    template: `<div>
        <Error v-if="error" :error="error"></Error>
        <div v-else-if="userobj">
            <div class="mt-3 mb-3">
              <h1 class="makecenter"> Hello {{ userobj.fname }}, </h1>
            </div>
            <div class="container card form-card shadow-sm col-sm-7">
                <div class="makecenter">
                    <span style='font-size:10vh;'>&#128102;</span>
                </div>
                <div class="mt-3 mb-2">
                    <ul class="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            First Name: 
                            <span class="badge bg-secondary rounded-pill">{{userobj.fname}}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Last Name: 
                            <span class="badge bg-secondary rounded-pill">{{userobj.lname}}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Email ID: 
                            <span class="badge bg-secondary rounded-pill">{{userobj.email}}</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
        <Wait v-else></Wait>
    </div>`,
    components: {
        Error,
        Wait,
    },
    data() {
        return {
            userobj: null,
            // taskItem: '',
            error: null,
        }
    },
    mounted() {
        if (this.$store.state.loggedIn === false) {
            this.$router.push({ name: 'login' })
        }
        FetchFunction({ url: `${ApiUrl}/user`, authRequired: true })
            .then((data) => {
                console.log(data)
                this.userobj = data
            })
            .catch((err) => {
                this.error = err.message
                console.log(err.message)
            })
    },
}
