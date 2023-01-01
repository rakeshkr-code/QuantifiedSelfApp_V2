from flask import current_app
from flask_login import current_user
from flask_restful import Resource, marshal_with, fields, reqparse
from werkzeug.exceptions import HTTPException, NotFound, Conflict, BadRequest
from flask_security import auth_required
from sqlalchemy.exc import IntegrityError
from application.models.tracker import db, Tracker
from application.cache import cache
from application.utils.cache_data_access import get_alltrackers_foruserid
from application.utils.validation_check import *


create_tracker_parser = reqparse.RequestParser()
create_tracker_parser.add_argument('tracker_name', required=True, help="tracker_name required")
create_tracker_parser.add_argument('description')
create_tracker_parser.add_argument('track_type', required=True, help="track_type required")
create_tracker_parser.add_argument('settings')

update_tracker_parser = reqparse.RequestParser()
update_tracker_parser.add_argument('tracker_name', required=True, help="tracker_name required")
update_tracker_parser.add_argument('description')
update_tracker_parser.add_argument('settings')

tracker_field = {
    "user_id": fields.Integer,
    "tracker_id": fields.Integer,
    "tracker_name": fields.String,
    "description": fields.String,
    "track_type": fields.String,
    "settings": fields.String,
}


class TrackerAPI(Resource):

    method_decorators = {
        'get': [marshal_with(tracker_field), auth_required('token')],
        'post': [marshal_with(tracker_field), auth_required('token')],
        'put': [marshal_with(tracker_field), auth_required('token')],
        'delete': [auth_required('token')]
    }

    def post(self, tracker_id=None):
        if tracker_id:
            raise BadRequest('Id not required')
        current_app.logger.info('TrackerAPI-POST: Started parsing Tracker POST request')
        data = create_tracker_parser.parse_args()
        tracker_name = data.get("tracker_name", None)
        description = data.get("description", None)
        track_type = data.get("track_type", None)
        settings = data.get("settings", None)
        current_app.logger.info('TrackerAPI-POST: Parsed Successfully: Tracker POST request data')

        # Backend Validation
        current_app.logger.info('TrackerAPI-POST: Checking form-data for backend validation')
        if tracker_name and track_type:
            if (not basicvalidation(tracker_name)) or (not basicvalidation(track_type)):
                raise BadRequest
        else:
            raise BadRequest
        if description:
            if not basicvalidation(description):
                raise BadRequest
        if (track_type=='Multiple_Choice') and (not settings):
            raise BadRequest
        if settings:
            if not settingsvalidation(settings):
                raise BadRequest
        current_app.logger.info('TrackerAPI-POST: Form-data validation successful')

        # DB query..
        try:
            current_app.logger.info('TrackerAPI-POST: Starting to add Tracker-Data in data base')
            if track_type=='Numerical':
                newtracker = Tracker(user_id=current_user.id, tracker_name=tracker_name, description=description, track_type=track_type)
            elif track_type=='Multiple_Choice':
                newtracker = Tracker(user_id=current_user.id, tracker_name=tracker_name, description=description, track_type=track_type, settings=settings)
            db.session.add(newtracker)
            db.session.commit()
            current_app.logger.info('TrackerAPI-POST: New Tracker added to the database')
            cache.delete_memoized(get_alltrackers_foruserid)
            current_app.logger.info('TrackerAPI-POST: deleted cache as new tracker created')
            return newtracker, 201
        except IntegrityError:
            current_app.logger.warning('TrackerAPI-POST: Could not add data to database because of conflict')
            db.session.rollback()
            raise Conflict
        # except:
        #     raise Conflict

    def get(self, tracker_id=None):
        if tracker_id:
            current_app.logger.info(f'TrackerAPI-GET: Started fetching tracker data : tracker_id: {tracker_id}')
            trackerobj = Tracker.query.get(tracker_id)
            if not trackerobj:
                current_app.logger.error(f'TrackerAPI-GET: Tracker Not Found : tracker_id: {tracker_id}')
                raise NotFound
            current_app.logger.info(f'TrackerAPI-GET: Returning the Tracker : tracker_id: {tracker_id}')
        else:
            current_app.logger.info('TrackerAPI-GET: Fetching all Trackers data')
            trackerobj = Tracker.query.filter_by(user_id=current_user.id).all()
            current_app.logger.info('TrackerAPI-GET: Returning all Trackers')
        return trackerobj

    def put(self, tracker_id=None):
        if not tracker_id:
            raise BadRequest
        
        current_app.logger.info('TrackerAPI-PUT: Started parsing tracker data to update')
        data = update_tracker_parser.parse_args()
        tracker_name = data.get("tracker_name", None)
        description = data.get("description", None)
        settings = data.get("settings", None)
        
        current_app.logger.info('TrackerAPI-PUT: Parsing completed')

        # Backend Validation
        current_app.logger.info('TrackerAPI-PUT: Checking form-data for backend validation')
        if tracker_name:
            if (not basicvalidation(tracker_name)):
                raise BadRequest
        else:
            raise BadRequest
        if description:
            if not basicvalidation(description):
                raise BadRequest
        if settings:
            if not settingsvalidation(settings):
                raise BadRequest
        current_app.logger.info('TrackerAPI-PUT: Form-data validation successful')


        # DB query..
        current_app.logger.info('TrackerAPI-PUT: Started fetching the tracker data')
        updatetracker = Tracker.query.filter_by(tracker_id=tracker_id, user_id=current_user.id).first()
        if not updatetracker:
            current_app.logger.info(f'TrackerAPI-PUT: Tracker Not Found : tracker_id: {tracker_id}')
            raise NotFound("Data not found")

        current_app.logger.info(f'TrackerAPI-PUT: Started updating the Tracker : tracker_id {tracker_id}')
        track_type = updatetracker.track_type
        try:
            if track_type=='Numerical':
                updatetracker.tracker_name = tracker_name
                updatetracker.description = description
            elif track_type=='Multiple_Choice':
                updatetracker.tracker_name = tracker_name
                updatetracker.description = description
                updatetracker.settings = settings
            db.session.commit()
        except IntegrityError:
            raise Conflict
        # except:
        #     raise Conflict
        current_app.logger.info(f'TrackerAPI-PUT: updated the tracker : tracker_id: {tracker_id}')

        cache.delete_memoized(get_alltrackers_foruserid)
        current_app.logger.info('TrackerAPI-PUT: deleted cache as tracker updated')
        return updatetracker, 200

    def delete(self, tracker_id=None):
        if not tracker_id:
            raise BadRequest
        current_app.logger.info(f'TrackerAPI-DELETE: Checking if Tracker exist or not : tracker_id: {tracker_id}')
        delettracker = Tracker.query.filter_by(tracker_id=tracker_id, user_id=current_user.id).first()
        if not delettracker:
            raise NotFound("data not found")

        current_app.logger.info(f'TrackerAPI-DELETE: Tracker_ID Found, deleting the data : tracker_id {tracker_id}')
        db.session.delete(delettracker)
        db.session.commit()
        current_app.logger.info(f'TrackerAPI-DELETE: Successfully Deleted : tracker_id: {tracker_id}')
        cache.delete_memoized(get_alltrackers_foruserid)
        current_app.logger.info('TrackerAPI-DELETE: deleted cache as a tracker delete')
        return "", 200