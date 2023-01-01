
export default {
    template: `
    <tr>
        <td>{{sno}}</td>
        <td>
            <div class="d-grid gap-2">
                <router-link class="btn btn-success" :to="{name:'openTracker', params:{tracker_id:trackerdata.tracker_id}}">{{trackerdata.tracker_name}}</router-link>
            </div>
        </td>
        <td>
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <span class="badge bg-secondary square-pill">{{trackerdata.lastlog}}</span>
                <span class="badge bg-secondary rounded-pill">{{trackerdata.lastval}}</span>
                <router-link class="btn btn-outline-success shadow" :to="{name:'createTrackerLog', params:{tracker_id:trackerdata.tracker_id}}" data-bs-toggle="tooltip" data-bs-placement="top" title="Add New Log">
                    <b> <i class="bi bi-patch-plus"></i> </b>
                </router-link>
            </div>
        </td>
        <td>
            <div class="makecenter">
                <router-link class="btn btn-warning" :to="{name:'updateTracker', params:{tracker_id:trackerdata.tracker_id}}" data-bs-toggle="tooltip" data-bs-placement="top" title="EDIT">
                    <i class="bi bi-pencil-square"></i>
                </router-link>

                <button class="btn btn-danger" @click="$emit('deleteTracker', trackerdata.tracker_id)" data-bs-toggle="tooltip" data-bs-placement="top" title="DELETE"> 
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        </td>
    </tr>`,
    
    props: ['trackerdata', 'key_index'],
    computed: {
        sno: function(){
            return this.key_index + 1
        }
    },

  }