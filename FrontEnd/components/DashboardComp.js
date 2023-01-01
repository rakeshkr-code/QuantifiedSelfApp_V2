export default {
    template: `
    <li>
      <router-link :to="{name:'homedashboard', params:{id:taskData.id}}">
          {{taskData.title}}
      </router-link>
    </li>`,
    props: ['taskData'],
  }