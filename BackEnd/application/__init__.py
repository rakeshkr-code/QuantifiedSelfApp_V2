from flask import Flask
from .models import db
from .resources import api
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from .utils.error import generic_error_handler, http_exception_handler
from .utils.security import user_datastore, sec
from .celery import workers

from .cache import cache



def create_app(config):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(config)
    db.init_app(app)
    # app.app_context().push()

    cache.init_app(app)  # cache initialized before api

    api.init_app(app)
    # app.app_context().push()
    sec.init_app(app, user_datastore)
    app.register_error_handler(Exception, generic_error_handler)
    app.register_error_handler(HTTPException, http_exception_handler)
    app.app_context().push()
    
    cel = workers.cel
    cel.conf.update(
        broker_url = 'redis://localhost:6379',  
        result_backend = 'redis://localhost:6379'  
    )
    cel.Task = workers.ContextTask
    app.app_context().push()


    # with app.app_context():
    #     db.create_all()
    return app, api, cel