import ApiUrl from '../config.js'
import FetchFunction from '../FetchFunction.js'
import Wait from '../components/WaitComp.js'
import Error from '../components/ErrorComp.js'

export default {
  template: `
  <div> 
    <Error v-if="error" :error="error"></Error>
    <div v-else-if="tracker && trackerlog">
      <div class="mt-3 mb-3 makecenter">
        <h1> Update {{tracker.tracker_name}} Log </h1>
      </div>
      <div class="border formborder shadow-sm">
        <p><b> Log Time : </b></p>
        <div class="input-group mb-3">
          <span class="input-group-text"> <b>Select Timestamp:</b> </span>
          <input type="datetime-local" id="meeting-time" name="meeting-time"  v-model="currdatetime" min="2012-06-07T00:00" max="2032-06-14T00:00"> 
        </div>
        <div v-if="tracker.track_type == 'Numerical'" class="input-group mb-3" style="max-width:200px;">
          <label for="logvalue" class="form-label"><b> Tracker Value : </b> &nbsp; </label>
          <input type="number" class="form-control" id="logvalue" name="logvalue" v-model="trackerlog.value" step=".1" required>
        </div>
        <div v-else-if="tracker.track_type == 'Multiple_Choice'" class="input-group mb-3">
          <label class="input-group-text" for="logvalue"><b> Tracker Value : </b></label>
          <select class="form-select " v-model="selected" id="logvalue" >   <!-- aria-label=".form-select-sm example" -->
            <option v-for="val in settingsval" v-bind:value="val">
              {{ val }}
            </option>
          </select>
        </div>
        <div v-else> Unexpected Error Occurred </div>
        <div class="mb-3">
          <label for="notes" class="form-label"><b> Notes : </b> </label>
          <textarea cols="30" rows="2" placeholder="Add a Note" v-model="trackerlog.note" class="form-control" id="notes" />
        </div> 
        <div>
          <button class="btn btn-primary" @click="updateData"> 
            <i class="bi bi-save"></i> Submit 
          </button>
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
      currdatetime: null,
      tracker_id: this.$route.params.tracker_id,
      log_id: this.$route.params.log_id,
      trackerlog: null, //{

      error: null,
      tracker: null,
      settingsval: null,
      selected: null,
    }
  },

  methods: {
    updateData() {
      //populate year, month, day.. in this.trackerlog object
      if (this.currdatetime) {
        console.log("inside if..")
        this.trackerlog.year = Number(this.currdatetime.slice(0,4))
        this.trackerlog.month = Number(this.currdatetime.slice(5,7))
        this.trackerlog.day = Number(this.currdatetime.slice(8,10))
        this.trackerlog.hour = Number(this.currdatetime.slice(11,13))
        this.trackerlog.minute = Number(this.currdatetime.slice(14,16))
        console.log("done with.. ", this.trackerlog.year, this.trackerlog.minute)
      }
      if (this.tracker.track_type == 'Multiple_Choice'){
        this.trackerlog.value = this.selected
      }
      FetchFunction({
        url: `${ApiUrl}/trackerlog/${this.log_id}`,
        init_obj: {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.trackerlog),
        },
        authRequired: true,
      })
        .then(() => {
          alert('tracker-log successfully updated')
          this.$router.push({ name: 'openTracker', params:{tracker_id:this.$route.params.tracker_id} })
        })
        .catch((err) => {
          alert(err.message)
        })
    },
  },
  mounted() {
    if (this.$store.state.loggedIn === false) {
      this.$router.push({ name: 'login' })
    }

    FetchFunction({ url: `${ApiUrl}/trackerlog/${this.$route.params.log_id}`, authRequired: true })
      .then((data) => {
        console.log(data)
        this.trackerlog = data
        let yyyy = data.year
        let mm = data.month
        let dd = data.day
        let hh = data.hour
        let mt = data.minute
        if (mm < 10){
          mm = '0'+mm
        }
        if (dd < 10){
          dd = '0'+dd
        }
        if (hh < 10){
          hh = '0'+hh
        }
        if (mt < 10){
          mt = '0'+mt
        }
        this.currdatetime = yyyy+"-"+mm+"-"+dd+"T"+hh+":"+mt
        console.log(this.currdatetime)
        this.selected = data.value

      })
      .catch((err) => {
        if (err.message == "NOT FOUND"){
          this.trackerlog = null
        } else {
          this.error = err.message
          console.log(err.message)
        }
      })
    
    FetchFunction({ url: `${ApiUrl}/tracker/${this.$route.params.tracker_id}`, authRequired: true })
      .then((data) => {
        console.log(data)
        this.tracker = data
        if (data.track_type == 'Multiple_Choice') {
          this.settingsval = data.settings.split(',')
        }
      })
      .catch((err) => {
        this.error = err.message
        console.log(err.message)
      })
  }

}