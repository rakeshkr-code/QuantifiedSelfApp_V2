from flask_security import Security, SQLAlchemyUserDatastore
from application.models import db
from application.models.users import User, Role
import flask_security.core as fc


user_datastore = SQLAlchemyUserDatastore(db, User, Role)    # create user, delete user all the methods are written in datastore
sec = fc.Security()
