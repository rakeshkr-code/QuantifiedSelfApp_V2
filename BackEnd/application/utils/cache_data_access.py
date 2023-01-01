from application.models.tracker import Tracker
from application.cache import cache



@cache.memoize(7200)
def get_alltrackers_foruserid(user_id):
    alltrackers = Tracker.query.filter_by(user_id=user_id).all()
    return alltrackers