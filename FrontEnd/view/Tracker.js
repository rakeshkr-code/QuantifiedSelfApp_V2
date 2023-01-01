import FetchFunction from '../FetchFunction.js'
import TrackerLogLine from '../components/TrackerLogLine.js'
import Wait from '../components/WaitComp.js'
import Error from '../components/ErrorComp.js'
import ApiUrl from '../config.js'
import CustomChart from '../components/CustomChart.js'

export default {
    template: `<div>
        <Error v-if="error" :error="error"></Error>
        <div v-else-if="tracker">
            <div class="mt-1 mb-1">
                <h1 class="makecenter">{{tracker.tracker_name}} Dashboard</h1>
            </div>
            <div class="mt-1 mb-1">
                <p class="makecenter"> <b> {{tracker.description}} </b> </p>
            </div>
            <div class="row gx-4">
                <div class="col-md-4 leftside">
                    <div class="leftside border shadow-sm" style="padding-left: 2px;">
                        <h2>Stats</h2>
                        <div class="mb-3">
                            <p><b>Select Range : </b></p>
                            <div>
                                <input type="radio" id="thismonth" value="thismonth" v-model="picked">
                                <label for="one">This Month</label>
                                <br>
                                <input type="radio" id="overall" value="overall" v-model="picked">
                                <label for="two">Overall</label>
                                <br>
                                <span>Picked: {{ picked }}</span>
                                
                            </div>
                            <p><b>Accumulation Type : </b></p>
                            <div>
                                <input type="radio" id="averageout" value="averageout" v-model="picked2">
                                <label for="one">Average Out</label>
                                <br>
                                <input type="radio" id="summation" value="summation" v-model="picked2">
                                <label for="two">Summation</label>
                                <br>
                                <span>Picked: {{ picked2 }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-8">
                    <!---------- Attach Graph Component ---------->
                    <div v-if="fdalllogs">
                        <CustomChart :alllogs = 'fdalllogs' :tracker_name = 'tracker.tracker_name' :charttype = 'charttype' :settingsval = 'settingsval' class="shadow shadow-sm" ></CustomChart>
                    </div>
                </div>
            </div>
            <br>
            <div class="row gx-4">
                <div class="col-md-4">
                    <div class="leftside border shadow-sm">
                        <h3>Log Records</h3>
                        <div>
                            <button class="btn btn-secondary" @click="exportdata" data-bs-toggle="tooltip" data-bs-placement="top" title="Export To Mail"> 
                                <i class="bi bi-sign-turn-right"></i> 
                            </button>

                            <p> <b>Select Range :</b> </p>
                            <select v-model="selected">
                                <option disabled value="">Please select Range</option>
                                <option>This Week</option>
                                <option>This Month</option>
                                <option>Overall</option>
                            </select>
                            <p>Selected: {{ selected }}</p>
                            
                        </div>
                    </div>
                </div>
                <!---------- Log Records Component ---------->
                <div class="col-md-8">
                    <div class="rightside">
                        <div class="card shadow-sm overflow-auto">
                        <table class="table table-info table-striped table-hover table-bordered border-dark scroll">
                            <thead class="scroll">
                            <tr class="scroll">
                                <td class="scroll">TimeStamp</td>
                                <td class="scroll">Value</td>
                                <td class="scroll">Note</td>
                                <td class="scroll">Actions</td>
                            </tr>
                            </thead>
                            <tbody class="scroll">
                                <trackerlogline v-for="(trackerlog, index) in fdalllogs" :trackerlogdata = 'trackerlog' :tracker_id = 'tracker_id' :key="index" @deleteTrackerLog='deleteTrackerLogRecord'/>
                            </tbody>
                        </table>
                        <div class="makecenter">
                            <router-link class="btn btn-outline-success mb-1" :to="{name:'createTrackerLog', params:{tracker_id:tracker_id}}">
                                <i class="bi bi-plus-circle"></i>
                                <b>Add New Log</b>
                            </router-link>
                        </div>
                        </div> 
                    </div>
                </div>
            </div>
            
        </div>
        <Wait v-else></Wait>
    </div>`,
    components: {
        Error,
        Wait,
        CustomChart,
        trackerlogline: TrackerLogLine,
    },
    data() {
        return {
            picked: null,
            picked2: null,
            selected: null,
            tracker_id: this.$route.params.tracker_id,
            error: null,
            tracker: null,
            settingsval: null,
            alllogs: null,
            charttype: null,
        }
    },
    methods: {
        exportdata() {
            FetchFunction({ url: `${ApiUrl}/exportascsv/${this.tracker_id}`, authRequired: true })
            .then((data) => {
                alert('csv sent to your mail ', data)
              })
              .catch((err) => {
                alert('mail NOT sent')
              })
        },
        deleteTrackerLogRecord(key_log_id) {
            FetchFunction({
                url: `${ApiUrl}/trackerlog/${key_log_id}`,
                init_obj: {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                },
                authRequired: true,
            })
                .then(() => {
                    alert('log record successfully deleted')
                    this.alllogs = this.alllogs.filter((lobj) => lobj.log_id !== key_log_id)
                    this.$router.go()
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
        FetchFunction({ url: `${ApiUrl}/tracker/${this.tracker_id}`, authRequired: true })
            .then((data) => {
                console.log(data)
                this.tracker = data
                if (data.track_type == 'Numerical'){
                    this.charttype = 'line'
                } else {
                    this.charttype = 'bar'
                    this.settingsval = data.settings.split(',')
                }
            })
            .catch((err) => {
                this.error = err.message
                console.log(err.message)
            })
        FetchFunction({ url: `${ApiUrl}/alllogs/${this.tracker_id}`, authRequired: true })
        .then((data) => {
            console.log(data)
            this.alllogs = data
            //bellow 3 lines are unnecessary, delete it later...
            const d = new Date(this.alllogs.year,this.alllogs.month,this.alllogs.day,this.alllogs.hour,this.alllogs.minute) + ""
            this.timestamp = d.slice(0,21)
            console.log(this.timestamp)
        })
        .catch((err) => {
            if (err.message == "NOT FOUND"){
                this.alllogs = null
            } else {
                this.error = err.message
                console.log(err.message)
            }
        })
    },
    computed: {
        fdalllogs: function(){
            if (this.alllogs){
                let custom = []
                for (const logob of this.alllogs){
                    let newlog = logob
                    const d = new Date(logob.year,logob.month-1,logob.day,logob.hour,logob.minute) + ""
                    newlog["timestamp"] = d.slice(0,21)
                    custom.push(newlog)
                    console.log("Computed property working", d.slice(0,21))
                }
                console.log(custom)
                return custom
            }
        }
    }
}
