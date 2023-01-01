from flask import current_app
from flask_login import current_user
from flask_restful import Resource
from flask_security import auth_required
# from application.models.tracker import db, Tracker
from application.models.trackerlog import TrackerLog
from time import perf_counter_ns
from application.utils.cache_data_access import get_alltrackers_foruserid


class AllTrackersAPI(Resource):
    @auth_required('token')
    def get(self):
        current_app.logger.info(f'AllTrackersAPI: Fetching All Tracker data : user_id: {current_user.id}')
        
        start = perf_counter_ns()
        user_id=current_user.id
        # alltrackers = Tracker.query.filter_by(user_id=current_user.id).all()
        alltrackers = get_alltrackers_foruserid(user_id)
        stop = perf_counter_ns()
        print("Time Taken: ", stop-start)

        current_app.logger.info(f'AllTrackersAPI: Fetched All Tracker data : user_id: {current_user.id}')
        recordList = []
        for newtracker in alltrackers:
            t_id = newtracker.tracker_id
            t_name = newtracker.tracker_name
            lastlog = TrackerLog.query.filter_by(tracker_id=t_id,user_id=current_user.id).order_by(TrackerLog.year.desc(), TrackerLog.month.desc(), TrackerLog.day.desc(), TrackerLog.hour.desc(), TrackerLog.minute.desc()).limit(1).first()
            newrec = {}
            newrec["tracker_id"] = t_id
            newrec["tracker_name"] = t_name
            if lastlog:
                newrec["lastlog"] = f"{lastlog.year}-{lastlog.month}-{lastlog.day}T{lastlog.hour}:{lastlog.minute}"
                newrec["lastval"] = lastlog.value
            else: #if lastlog is None, i.e, no log recorded yet
                newrec["lastlog"] = '---'
                newrec["lastval"] = '---'
            recordList.append(newrec)
        current_app.logger.info(f'AllTrackersAPI: Record List Created, Returning.. : user_id: {current_user.id}')
        return recordList
