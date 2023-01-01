export default {
    template: `
    <tr class="scroll">
        <td class="scroll">{{trackerlogdata.timestamp}}</td>
        <td class="scroll">{{trackerlogdata.value}}</td>
        <td class="scroll">{{trackerlogdata.note}}</td>
        <td class="scroll">
            <div class="makecenter">
                <router-link class="btn btn-sm btn-warning" :to="{name:'updateTrackerLog', params:{log_id:trackerlogdata.log_id, tracker_id:tracker_id}}" data-bs-toggle="tooltip" data-bs-placement="top" title="EDIT">
                    <i class="bi bi-pencil-square"></i>
                </router-link>
                <button class="btn btn-sm btn-danger" @click="$emit('deleteTrackerLog', trackerlogdata.log_id)" data-bs-toggle="tooltip" data-bs-placement="top" title="DELETE">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        </td>
    </tr>`,
    
    props: ['trackerlogdata', 'tracker_id'],
  }