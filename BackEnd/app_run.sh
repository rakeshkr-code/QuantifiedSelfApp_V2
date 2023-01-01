#!/bin/bash
echo "==============================================================="
echo "Welcome !! This will run your python3 app if virtual env is ready"
echo "---------------------------------------------------------------"

if [ -d "env" ]; then
	echo "Enabling virtual env"
else
	echo "No virtual env, Please run app_setup.sh first"
	exit N
fi

source env/bin/activate

export ENV=local_development

python3 app.py

deactivate

