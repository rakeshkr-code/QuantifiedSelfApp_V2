import FetchFunction from '../FetchFunction.js'
import TrackerLine from '../components/TrackerLine.js'
import Wait from '../components/WaitComp.js'
import Error from '../components/ErrorComp.js'
import ApiUrl from '../config.js'

export default {
  template: `<div>
    <Error v-if="error" :error="error"></Error>

    <div v-else-if="allTrackers">
      <div class="mt-3 mb-3">
        <h1 class="makecenter">Wellcome To Your Dashboard</h1>
      </div>
      <table class="table table-secondary table-striped table-hover table-bordered border border-2 border-dark">
        <thead>
          <tr>
            <td> <b>#</b> </td>
            <td> <b>TrackerName</b> </td>
            <td> <b>LastLog</b> </td>
            <td> <b>Actions</b> </td>
          </tr>
        </thead>
        <tbody>
          <trackerline v-for="(tracker, index) in allTrackers" :trackerdata = 'tracker' :key="index" :key_index="index" @deleteTracker='deleteTrackerRecord'/>
        </tbody>
      </table>
      
      <div class="add-new mb-3">
        <router-link class="btn btn-outline-success add-new-btn shadow" :to="{name:'createTracker'}"> 
          <i class="bi bi-patch-plus"></i>
          <b>Add New Tracker</b> 
        </router-link>
      </div>
    </div>

    <Wait v-else></Wait>
  </div>`,
  components: {
    Error,
    Wait,
    trackerline: TrackerLine,
  },

  data() {
    return {
      allTrackers: null,
      error: null,
    }
  },
  mounted() {
    if (this.$store.state.loggedIn === false) {
      this.$router.push({ name: 'login' })
    }
    FetchFunction({ url: `${ApiUrl}/alltrackers`, authRequired: true })
      .then((data) => {
        console.log(data)
        this.allTrackers = data
      })
      .catch((err) => {
        this.error = err.message
        console.log(err.message)
      })
  },
  methods: {
    deleteTrackerRecord(key_tracker_id) {
        FetchFunction({
            url: `${ApiUrl}/tracker/${key_tracker_id}`,
            init_obj: {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
            },
            authRequired: true,
        })
            .then(() => {
                alert('tracker record successfully deleted')
                this.allTrackers = this.allTrackers.filter((tobj) => tobj.tracker_id !== key_tracker_id)
            })
            .catch((err) => {
                alert(err.message)
            })
    },
  },
}
