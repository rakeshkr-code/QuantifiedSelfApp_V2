from .workers import cel
from ..mail_service.services import send_email
from flask import render_template
from celery.schedules import crontab
import datetime
from .generatepdf import generate_pdf_report
from application.models.users import User
from application.models.tracker import Tracker
from application.models.trackerlog import TrackerLog



cel.conf.timezone = 'Asia/Kolkata'

@cel.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # # Calls task1() every 10 seconds.
    # sender.add_periodic_task(10.0, task1.s(), name='After every 10 seconds')

    # # Calls test('world') every 30 seconds
    # sender.add_periodic_task(30.0, task1.s(), expires=10)

    # # Executes everyday morning at 08:10 a.m.
    sender.add_periodic_task(
        # crontab(hour=8, minute=10),
        crontab(hour=17, minute=42),
        send_daily_reminder.s(),
    )
    # # Executes every month 1st day at 07:30 a.m.
    sender.add_periodic_task(
        # crontab(hour=7, minute=30, day_of_month='1', month_of_year='*'),
        crontab(hour=17, minute=50, day_of_month='13', month_of_year='*'),
        send_monthly_report.s(),
    )


@cel.task()
def print_hello(username):
    return username

## Export As CSV Task--------------
@cel.task()
def send_csv_to_mail(receiver_email, subject, username, trackername, filename):
    extn = 'csv'
    msgdata = render_template("exportcsvdata.html", username=username, trackername=trackername)
    send_email(receiver_email, subject, msgdata, filename, extn)
    return 'mail sent'

## Daily Reminder Task-------------
@cel.task()
def send_daily_reminder():
    allusers = User.query.all()
    for thisuser in allusers:
        alltrackers = Tracker.query.filter_by(user_id=thisuser.id).all()
        emptylogtrackers = ""
        for trackerobj in alltrackers:
            currtrackerlog = TrackerLog.query.filter_by(tracker_id=trackerobj.tracker_id).first() #no need to fetch all logs
            if not currtrackerlog:
                emptylogtrackers = emptylogtrackers + "\"" + trackerobj.tracker_name + "\"" + ", "    #.append(trackerobj.tracker_name)
        if emptylogtrackers:
            msgdata = render_template("dailyreminder.html", username=thisuser.fname, emptylogtrackers=emptylogtrackers)
            receiver_email = thisuser.email
            subject = "Reminder for creating new log"
            send_email(receiver_email, subject, msgdata)
    return 'reminder sent'

## Monthly Report Task---------------
@cel.task()
def send_monthly_report():
    x = datetime.datetime.now()
    year = x.year
    month = x.month
    # print("PDF Report: This Month: ", month)
    day = x.day
    y = datetime.datetime(year, month-1, 25)


    allusers = User.query.all()
    for thisuser in allusers:
        data = {}
        data['name'] = thisuser.fname
        data['email'] = thisuser.email
        mt = y.strftime("%B")
        data['mnth'] = mt

        alltrackers = Tracker.query.filter_by(user_id=thisuser.id).all()
        num_trackers = []
        mc_trackers = []
        for trackerobj in alltrackers:
            currtrackerlog = TrackerLog.query.filter_by(tracker_id=trackerobj.tracker_id, month=month-1).all()
            # currtrackerlog = TrackerLog.query.filter_by(tracker_id=trackerobj.tracker_id, month=8).all()
            if trackerobj.track_type=='Numerical' and currtrackerlog:
                d = {}
                tot = 0
                count = 0
                for logrec in currtrackerlog:
                    tot += float(logrec.value)
                    count += 1
                d['tname'] = trackerobj.tracker_name
                d['avgval'] = tot / count
                d['totval'] = tot
                num_trackers.append(d)
            elif trackerobj.track_type=='Multiple_Choice' and currtrackerlog:
                d = {}
                tdata = []
                distribu = {}
                allopts = trackerobj.settings.split(",")
                for opt in allopts:
                    distribu[opt] = 0
                for logrec in currtrackerlog:
                    distribu[logrec.value] += 1
                for k,v in distribu.items():
                    tdata.append({'value':k, 'count':v})
                d['tname'] = trackerobj.tracker_name
                d['tdata'] = tdata
                mc_trackers.append(d)
        data['num_trackers'] = num_trackers
        data['mc_trackers'] = mc_trackers

        msgdata = render_template("monthlyreportmsg.html", username=thisuser.fname)
        generate_pdf_report(data=data)
        receiver_email = thisuser.email
        subject = "Monthly Report Card"
        filename = receiver_email.split("@")[0]
        extn = 'pdf'
        send_email(receiver_email, subject, msgdata, filename=filename, extn=extn)
    return 'monthly reports sent'