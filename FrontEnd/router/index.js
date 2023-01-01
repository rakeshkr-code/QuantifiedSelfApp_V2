import HomeDashboard from '../view/HomeDashboard.js'
import Login from '../view/Login.js'
import Signup from '../view/Signup.js'
import Profile from '../view/Profile.js'
import ContactUs from '../view/ContactUs.js'
import About from '../view/About.js'
import Help from '../view/Help.js'
import Tracker from '../view/Tracker.js'
import CreateTrackerForm from '../view/CreateTrackerForm.js'
import UpdateTrackerForm from '../view/UpdateTrackerForm.js'
import CreateTrackerLogForm from '../view/CreateTrackerLogForm.js'
import UpdateTrackerLogForm from '../view/UpdateTrackerLogForm.js'


const routes = [
    { path: '/', name: 'homedashboard', component: HomeDashboard },
    { path: '/login', name: 'login', component: Login },
    { path: '/signup', name: 'signup', component: Signup },

    { path: '/profile', name: 'profile', component: Profile },
    { path: '/contactus', name: 'contactUs', component: ContactUs },
    { path: '/about', name: 'about', component: About },
    { path: '/help', name: 'help', component: Help },

    { path: '/tracker/:tracker_id', name: 'openTracker', component: Tracker },
    { path: '/tracker/create', name: 'createTracker', component: CreateTrackerForm },
    { path: '/tracker/update/:tracker_id', name: 'updateTracker', component: UpdateTrackerForm },
    
    { path: '/trackerlog/:tracker_id/create', name: 'createTrackerLog', component: CreateTrackerLogForm },
    { path: '/trackerlog/update/:tracker_id/:log_id', name: 'updateTrackerLog', component: UpdateTrackerLogForm },
]

const router = new VueRouter({
  routes,
})

export default router