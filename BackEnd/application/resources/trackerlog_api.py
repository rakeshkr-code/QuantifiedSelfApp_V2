from flask import current_app
from flask_login import current_user
from flask_restful import Resource, marshal_with, fields, reqparse
from werkzeug.exceptions import HTTPException, NotFound, Conflict, BadRequest
from flask_security import auth_required
from sqlalchemy.exc import IntegrityError
from application.models.trackerlog import db, TrackerLog
from application.utils.validation_check import *


create_trackerlog_parser = reqparse.RequestParser()
create_trackerlog_parser.add_argument('tracker_id', required=True, help="tracker_id required")
create_trackerlog_parser.add_argument('year', required=True, help="year required")
create_trackerlog_parser.add_argument('month', required=True, help="month required")
create_trackerlog_parser.add_argument('day', required=True, help="day required")
create_trackerlog_parser.add_argument('hour', required=True, help="hour required")
create_trackerlog_parser.add_argument('minute', required=True, help="minute required")
create_trackerlog_parser.add_argument('value', required=True, help="value required")
create_trackerlog_parser.add_argument('note')

update_trackerlog_parser = reqparse.RequestParser()
update_trackerlog_parser.add_argument('year', required=True, help="year required")
update_trackerlog_parser.add_argument('month', required=True, help="month required")
update_trackerlog_parser.add_argument('day', required=True, help="day required")
update_trackerlog_parser.add_argument('hour', required=True, help="hour required")
update_trackerlog_parser.add_argument('minute', required=True, help="minute required")
update_trackerlog_parser.add_argument('value', required=True, help="value required")
update_trackerlog_parser.add_argument('note')

trackerlog_field = {
    "log_id": fields.Integer,
    "user_id": fields.Integer,
    "tracker_id": fields.Integer,
    "year": fields.Integer,
    "month": fields.Integer,
    "day": fields.Integer,
    "hour": fields.Integer,
    "minute": fields.Integer,
    "value": fields.String,
    "note": fields.String,
}


class TrackerLogAPI(Resource):

    method_decorators = {
        'get': [marshal_with(trackerlog_field), auth_required('token')],
        'post': [marshal_with(trackerlog_field), auth_required('token')],
        'put': [marshal_with(trackerlog_field), auth_required('token')],
        'delete': [auth_required('token')]
    }

    def post(self, log_id=None):
        if log_id:
            raise BadRequest('Id not required')
        current_app.logger.info('TrackerLogAPI-POST: Started parsing tracker-log post request')
        data = create_trackerlog_parser.parse_args()
        tracker_id = data.get("tracker_id", None)
        year = data.get("year", None)
        month = data.get("month", None)
        day = data.get("day", None)
        hour = data.get("hour", None)
        minute = data.get("minute", None)
        value = data.get("value", None)
        note = data.get("note", None)
        current_app.logger.info('TrackerLogAPI-POST: tracker-log post request data was parsed successfully')

        # Backend Validation
        current_app.logger.info('TrackerLogAPI-POST: Checking form-data for backend validation')
        if note:
            if not basicvalidation(note):
                raise BadRequest
        current_app.logger.info('TrackerLogAPI-POST: Form-data validation successful')


        # DB query..
        try:
            current_app.logger.info('TrackerLogAPI-POST: Starting to add tracker-log-data in data base')
            newlog = TrackerLog(user_id=current_user.id, tracker_id=tracker_id, year=year, month=month, day=day, hour=hour, minute=minute, value=value, note=note)
            db.session.add(newlog)
            db.session.commit()
            current_app.logger.info('TrackerLogAPI-POST: New Tracker-Log added to the database')
            return newlog, 201
        except IntegrityError:
            current_app.logger.warning('TrackerLogAPI-POST: Could not add data to database because of conflict')
            db.session.rollback()
            raise Conflict

    def get(self, tracker_id=None, log_id=None):
        if tracker_id:
            current_app.logger.info(f'TrackerLogAPI-GET: Started fetching all log-data related to tracker_id: {tracker_id}')
            trackerlogsobj = TrackerLog.query.filter_by(tracker_id=tracker_id).order_by(TrackerLog.year.asc(), TrackerLog.month.asc(), TrackerLog.day.asc(), TrackerLog.hour.asc(), TrackerLog.minute.asc()).all()
            if not trackerlogsobj:
                current_app.logger.error(f'TrackerLogAPI-GET: Logs with tracker_id {tracker_id} not found')
                raise NotFound
            current_app.logger.info(f'TrackerLogAPI-GET: returning all the logs with tracker_id: {tracker_id}')
        elif log_id:
            current_app.logger.info(f'TrackerLogAPI-GET: Started fetching log-data related to log_id: {log_id}')
            trackerlogsobj = TrackerLog.query.filter_by(log_id=log_id).first()
            if not trackerlogsobj:
                current_app.logger.error(f'TrackerLogAPI-GET: Logs with log_id {log_id} not found')
                raise NotFound
            current_app.logger.info(f'TrackerLogAPI-GET: returning the logs data for log_id: {log_id}')
        else:
            current_app.logger.info('TrackerLogAPI-GET: fetching all trackers data')
            trackerlogsobj = TrackerLog.query.filter_by(user_id=current_user.id).all()
            current_app.logger.info(f'TrackerLogAPI-GET: returning all logs for user_id {current_user.id}')
        return trackerlogsobj

    def put(self, log_id=None):
        if not log_id:
            raise BadRequest
        
        current_app.logger.info('Started parsing tracker-log data to update')
        data = update_trackerlog_parser.parse_args()
        year = data.get("year", None)
        month = data.get("month", None)
        day = data.get("day", None)
        hour = data.get("hour", None)
        minute = data.get("minute", None)
        value = data.get("value", None)
        note = data.get("note", None)

        current_app.logger.info('TrackerLogAPI-PUT: Parsing tracker-log data for update is done')

        current_app.logger.info('TrackerLogAPI-PUT: Started fetching the tracker-log data')
        update_log = TrackerLog.query.get(log_id)
        if not update_log:
            current_app.logger.info(f'TrackerLogAPI-PUT: No tracker with id {log_id}')
            raise NotFound("Data not found")
        
        # Backend Validation
        current_app.logger.info('TrackerLogAPI-POST: Checking form-data for backend validation')
        if note:
            if not basicvalidation(note):
                raise BadRequest
        current_app.logger.info('TrackerLogAPI-POST: Form-data validation successful')


        # DB query..
        current_app.logger.info(f'TrackerLogAPI-PUT: Started updating the tracker-log with id {log_id}')
        try:
            update_log.year = year
            update_log.month = month
            update_log.day = day
            update_log.hour = hour
            update_log.minute = minute
            update_log.value = value
            update_log.note = note
            db.session.commit()
        except IntegrityError:
            raise Conflict
        current_app.logger.info(f'TrackerLogAPI-PUT: updated the tracker-log with id {log_id}')
        return update_log, 200

    def delete(self, log_id=None):
        if not log_id:
            raise BadRequest
        current_app.logger.info(f'TrackerLogAPI-DELETE: Checking if Tracker-Log exist or not : log_id {log_id}')
        deletelog = TrackerLog.query.filter_by(log_id=log_id, user_id=current_user.id).first()
        if not deletelog:
            raise NotFound("data not found")

        current_app.logger.info(f'TrackerLogAPI-DELETE: Tracker-Log Found, deleting log : log_id: {log_id}')
        db.session.delete(deletelog)
        db.session.commit()
        current_app.logger.info(f'TrackerLogAPI-DELETE: Tracker-Log Deleted Successfully : log_id: {log_id}')
        return "", 200