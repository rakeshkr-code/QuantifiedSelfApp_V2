from flask import current_app
from flask_login import current_user
from flask_restful import Resource
from werkzeug.exceptions import HTTPException, NotFound, Conflict, BadRequest
from flask_security import auth_required
from application.celery import task
from application.models.tracker import Tracker
from application.models.trackerlog import TrackerLog
import os


class ExportAPI(Resource):
    @auth_required('token')
    def get(self, tracker_id=None):
        if not tracker_id:
            raise BadRequest("tracker_id required")
        current_app.logger.info(f'ExportAPI: Fetching Tracker data : tracker_id: {tracker_id}')
        ##### GET TRACKERDATA FROM DATABASE =======================================
        trackerobj = Tracker.query.get(tracker_id)
        if not trackerobj:
            current_app.logger.error(f'ExportAPI: Not Found: Tracker with {tracker_id}')
            raise NotFound
        current_app.logger.info(f'ExportAPI: Fetched Tracker data : tracker_id: {tracker_id}')
        trackername = trackerobj.tracker_name
        ##### GET LOGDATA FROM DATABASE =======================================
        current_app.logger.info('ExportAPI: Fetching Logs : tracker_id: {tracker_id}')
        logobj = TrackerLog.query.filter_by(tracker_id=tracker_id).all()
        current_app.logger.info(f'ExportAPI: Fetched Logs data : tracker_id: {tracker_id}')
        ##### GENERATE CSV FILE =================================
        mailid = current_user.email
        cusername = mailid.split("@")[0]
        basedir = os.path.abspath(os.path.dirname(__file__)) #get the current directory
        filename = f"{cusername}_{trackername}"
        filepathname = os.path.join(basedir, f"../../csvdatafiles/{filename}.csv")
        ##### POPULATE CSV FILE WITH LOGDATA =================================
        f = open(filepathname, 'w')
        header = "sno,datetime,value,note"
        f.write(header + "\n")
        sno = 1
        for logrec in logobj:
            datetime = f"{logrec.year}-{logrec.month}-{logrec.day}T{logrec.hour}:{logrec.minute}"
            value = logrec.value
            note = logrec.note
            f.write(f"{sno},{datetime},{value},{note}\n")
            sno = sno + 1
        f.close()
        current_app.logger.info("ExportAPI: CSV file Generated")

        current_app.logger.info("ExportAPI: Going to export CSV")
        job = task.send_csv_to_mail.delay(current_user.email, f"Exported Data: {trackername}", current_user.fname, trackername, filename)
        current_app.logger.info("ExportAPI: Export-CSV job sent to Celery System...")
        return str(job)

