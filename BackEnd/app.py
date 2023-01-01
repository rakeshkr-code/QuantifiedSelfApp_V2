import os
from application import create_app
from application.celery import task
from application.config import LocalDevelopmentConfig
import logging


if os.getenv('ENV', default=None) == "local_development":
    app, api, cel = create_app(LocalDevelopmentConfig)
else:
    app, api, cel = create_app(LocalDevelopmentConfig)



logging.basicConfig(filename='record.log', level=logging.DEBUG, 
                    format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')



if __name__=="__main__":
    app.run(debug=True)
