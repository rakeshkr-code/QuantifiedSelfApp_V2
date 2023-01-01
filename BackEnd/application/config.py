import os

basedir = os.path.abspath(os.path.dirname(__file__)) #get the current directory


class Config(object):
    DEBUG = False
    TESTING = False #may not be req.
    SQLITE_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class LocalDevelopmentConfig(Config):
    SQLITE_DB_DIR = os.path.join(basedir, "../db_directory")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "database.sqlite3")
    DEBUG = True
    SECRET_KEY = "thisissecter"
    SECURITY_PASSWORD_SALT = "thisissaltt"  # FlaskSQLAlchemy uses it to generate the auth-token
    SQLALCHEMY_TRACK_MODIFICATIONS = False 
    WTF_CSRF_ENABLED = False    # We are Not going to use CSRF token, thst's why making it False to avoid cross-site security threats
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'   # 'Authentication-Token' is the 'key' in header for sending the token 
    CELERY_BROKER_URL = 'redis://localhost:6379'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379'
    CACHE_TYPE = 'RedisCache'
    CACHE_REDIS_HOST = 'localhost'
    CACHE_REDIS_PORT = 6379

