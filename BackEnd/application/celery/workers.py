from celery import Celery
from flask import current_app as app

cel = Celery('application_jobs')

class ContextTask(cel.Task):
    def __call__(self, *args, **kwds):
        with app.app_context():
            return super().__call__(*args, **kwds)

