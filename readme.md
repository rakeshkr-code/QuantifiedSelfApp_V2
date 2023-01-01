# Setup & Run QuantifiedSelf Application V2

## Basic Requirements

- You should have Python Installed
- You should have Linux/Mac terminal
- `For Windows:` WSL activated and Ubuntu installed
- You should have celery, redis-server, and MailHog installed

## Application Setup

- Run `app_setup.sh` from Linux terminal (Windows users should use WSL)
- It will create the virtual env and will setup the environment (install required packages)

## Application Run (Development Mode)

- Open Five different terminals to run five different servers
- From terminal go to the `BackEnd` directory of the Project folder<!--(`QuantifiedSelfApp_V2`)--> and activate virtual env by running command `source env/bin/activate`
- Run redis-server(`redis-server`), MailHog(`~/go/bin/MailHog`), celery beat(`celery -A app.cel beat --Max-interval 2 -l info`), and celery worker(`celery -A app.cel worker -l info`) from opened terminals
- Run `app_run.sh` from another terminal
- It will start the Flask app in `development` mode. Suited for local development.
- Finally start any server to serve the frontend static JS files (you may use VS Code server)

## Folder Structure

- `db_directory` has the sqlite3 DB.
- `application` is where our application code is
- `app_setup.sh` sets up the virtualenv inside a local `env` folder.
- `app_run.sh` runs the Flask application `app.py` file in development mode
- `csvdatafiles` and `pdfreports` folder stores backend generated csv and pdf files

```md

├── BackEnd
│   ├── application
│   │   ├── celery
│   │   │   ├── __init__.py
│   │   │   ├── generatepdf.py
│   │   │   ├── task.py
│   │   │   └── workers.py
│   │   ├── mail_service
│   │   │   ├── __init__.py
│   │   │   └── services.py
│   │   ├── models
│   │   │   ├── __init__.py
│   │   │   ├── tracker.py
│   │   │   ├── trackerlog.py
│   │   │   └── users.py
│   │   ├── resources
│   │   │   ├── __init__.py
│   │   │   ├── alltrackers_api.py
│   │   │   ├── export_api.py
│   │   │   ├── tracker_api.py
│   │   │   ├── trackerlog_api.py
│   │   │   └── user_api.py
│   │   ├── templates
│   │   │   ├── dailyreminder.html
│   │   │   ├── exportcsvdata.html
│   │   │   ├── monthlypdfreport.html
│   │   │   └── monthlyreportmsg.html
│   │   ├── utils
│   │   │   ├── __init__.py
│   │   │   ├── cache_data_access.py
│   │   │   ├── error.py
│   │   │   ├── security.py
│   │   │   └── validation_check.py
│   │   ├── __init__.py
│   │   ├── cache.py
│   │   └── config.py
│   ├── csvdatafiles
│   ├── db_directory
│   │   └── database.sqlite3
│   ├── env
│   ├── pdfreports
│   ├── app.py
│   ├── app_run.sh
│   ├── app_setup.sh
│   ├── celerybeat-schedule
│   ├── dump.rdb
│   ├── record.log
│   └── requirements.txt
├── FrontEnd
│   ├── components
│   │   ├── CustomChart.js
│   │   ├── DashboardComp.js
│   │   ├── ErrorComp.js
│   │   ├── FooterComp.js
│   │   ├── Main.js
│   │   ├── NavBar.js
│   │   ├── TrackerForm.js
│   │   ├── TrackerLine.js
│   │   ├── TrackerLogLine.js
│   │   └── WaitComp.js
│   ├── images
│   │   └── favicon2.ico
│   ├── router
│   │   └── index.js
│   ├── view
│   │   ├── About.js
│   │   ├── ContactUs.js
│   │   ├── CreateTrackerForm.js
│   │   ├── CreateTrackerLogForm.js
│   │   ├── Help.js
│   │   ├── HomeDashboard.js
│   │   ├── Login.js
│   │   ├── Profile.js
│   │   ├── Signup.js
│   │   ├── Tracker.js
│   │   ├── UpdateTrackerForm.js
│   │   └── UpdateTrackerLogForm.js
│   ├── vuex
│   │   └── index.js
│   ├── app.js
│   ├── config.js
│   ├── FetchFunction.js
│   ├── index.html
│   └── style.css
├── api_documentation.yaml
├── ProjectReport.pdf
└── readme.md

```
