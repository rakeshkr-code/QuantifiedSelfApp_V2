from . import db

class Tracker(db.Model):
    __tablename__ = 'tracker'
    tracker_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    tracker_name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    track_type = db.Column(db.String, nullable=False)
    settings = db.Column(db.String)

