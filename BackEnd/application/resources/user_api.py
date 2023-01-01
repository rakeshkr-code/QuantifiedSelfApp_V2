from http.client import BAD_REQUEST
from flask import current_app
from flask_login import current_user
from flask_restful import Resource, marshal_with, fields, reqparse
from werkzeug.exceptions import Conflict, HTTPException, BadRequest
from flask_security import auth_required, hash_password
from sqlalchemy.exc import IntegrityError
from application.models import db
from application.utils.security import user_datastore


user_req = reqparse.RequestParser()
user_req.add_argument('email', required=True, help="email required")
user_req.add_argument('fname', required=True, help="fname required")
user_req.add_argument('lname')  
user_req.add_argument('password', required=True, help="password required")

user_res_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'fname': fields.String,
    'lname': fields.String
}


class UserAPI(Resource):
    @marshal_with(user_res_fields)
    def post(self):
        current_app.logger.info('UserAPI-POST: started parsing the user post request')
        data = user_req.parse_args()
        email = data.get("email", None)
        fname = data.get("fname", None)
        lname = data.get("lname", None)
        password = data.get("password", None)
        current_app.logger.info('UserAPI-POST: user post request parsed')

        if user_datastore.find_user(email=email):
            raise Conflict
        try:
            current_app.logger.info('UserAPI-POST: Started createing user in database')
            user = user_datastore.create_user(
                email=email, fname=fname, lname=lname, 
                password=password)
            db.session.commit()
            current_app.logger.info('UserAPI-POST: New User inserted into the database')
            return user
        except IntegrityError:
            raise Conflict


    @auth_required('token')
    @marshal_with(user_res_fields)
    def get(self):
        return current_user
