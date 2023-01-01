import ApiUrl from '../config.js'
import FetchFunction from '../FetchFunction.js'

export default {
  template: `
  <div> 
    <div class="mt-3 mb-3">
      <h1 class="makecenter"> Update {{name}} </h1>
    </div>
    <div class=" border formborder shadow-sm">
      <div class="mb-3">
        <span> <b>Tracker Name:</b> </span> </br>
        <input type='Text' placeholder="New Tracker Name" v-model="tracker.tracker_name" class="form-control" required/> 
      </div>
      <div class="mb-3">
        <span> <b>Description:</b> </span> </br>
        <textarea cols="30" rows="2" placeholder="Description" v-model="tracker.description" class="form-control" /> 
      </div>
      <div class="mb-3">
        <span> <b>Tracker Type:</b> </span> </br>
        <input type="radio" id="one" value="Numerical" v-model="tracker.track_type" disabled>
        <label for="one">Numerical</label>
        &nbsp;
        <input type="radio" id="two" value="Multiple_Choice" v-model="tracker.track_type" disabled>
        <label for="two">Multiple_Choice</label>
      </div>
      <div class="mb-3">
        <span> <b>Settings:</b> </span> </br>
        <div v-if="tracker.track_type === 'Numerical'" class="mb-3" id="numdiv">
          <p> Great ! Go Ahead with your Numerical Value Settings.. </p>
        </div>
        <div v-else-if="tracker.track_type === 'Multiple_Choice'" class="mb-3" id="mcqdiv">
          <input type='Text' placeholder="Put CSV without any spaces: A,B,C,etc" v-model="tracker.settings" class="form-control" disabled /> 
        </div>
        <div v-else class="mb-3" id="numdiv">
          <p> Please, Select Any One of the Types...! </p>
        </div>
      </div>
      <button class="btn btn-primary" @click="postData"> 
        <i class="bi bi-save"></i> Submit 
      </button>
    </div>
  </div>`,

  data() {
    return {
      name: null,
      tracker: {
        tracker_name: null,
        description: null,
        track_type: null,
        settings: null
      },
    }
  },

  methods: {
    postData() {
      FetchFunction({
        url: `${ApiUrl}/tracker/${this.$route.params.tracker_id}`,
        init_obj: {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.tracker),
        },
        authRequired: true,
      })
        .then(() => {
          alert('tracker successfully updated')
          this.$router.push({ name: 'homedashboard' })
        })
        .catch((err) => {
          alert(err.message)
        })
    },
  },

  mounted() {
    if (this.$route.params.tracker_id) {
      FetchFunction({
        url: `${ApiUrl}/tracker/${this.$route.params.tracker_id}`,
        authRequired: true,
      })
        .then((data) => {
          this.name = data.tracker_name
          this.tracker.tracker_name = data.tracker_name
          this.tracker.description = data.description
          this.tracker.track_type = data.track_type
          this.tracker.settings = data.settings
          console.log(data)
        })
        .catch((err) => {
          this.error = err.message
          console.log(err)
        })
    }
  },
}