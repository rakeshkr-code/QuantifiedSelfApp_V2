from . import db

class TrackerLog(db.Model):
    __tablename__ = 'tracker_log'
    log_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    tracker_id = db.Column(db.Integer, db.ForeignKey("tracker.tracker_id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    day = db.Column(db.Integer, nullable=False)
    hour = db.Column(db.Integer, nullable=False)
    minute = db.Column(db.Integer, nullable=False)
    value = db.Column(db.String, nullable=False)
    note = db.Column(db.String)

