from .user_api import UserAPI
from .alltrackers_api import AllTrackersAPI
from .tracker_api import TrackerAPI
from .trackerlog_api import TrackerLogAPI
from .export_api import ExportAPI
from flask_restful import Api


# import all the apis so they are loaded..
api = Api() 
api.add_resource(UserAPI, '/api/user')
api.add_resource(AllTrackersAPI, '/api/alltrackers')
api.add_resource(TrackerAPI, '/api/tracker', '/api/tracker/<int:tracker_id>')
api.add_resource(TrackerLogAPI, '/api/trackerlog', '/api/alllogs/<int:tracker_id>', '/api/trackerlog/<int:log_id>')
api.add_resource(ExportAPI, '/api/exportascsv/<int:tracker_id>')

