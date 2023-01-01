from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
import smtplib
import os

SERVER_SMTP_HOST = 'localhost'
SERVER_SMTP_PORT = 1025
SENDER_ADDRESS = 'team@qtfselfapp.com'
SENDER_PASSWORD = ''

def send_email(to_address, subject, message, filename=None, extn=None):
    msg = MIMEMultipart()
    msg['To'] = to_address
    msg['From'] = SENDER_ADDRESS
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'html'))

    if filename:    #if filename is given, then attach it
        if extn=='csv':
            basedir = os.path.abspath(os.path.dirname(__file__)) #get the current directory
            filepathname = os.path.join(basedir, f"../../csvdatafiles/{filename}.csv")
            with open(filepathname,'rb') as file:
                # Attach the file with filename to the email
                FILE_NAME = f"{filename}.csv"
                msg.attach(MIMEApplication(file.read(), Name=FILE_NAME))
        elif extn=='pdf':
            basedir = os.path.abspath(os.path.dirname(__file__)) #get the current directory
            filepathname = os.path.join(basedir, f"../../pdfreports/{filename}.pdf")
            with open(filepathname,'rb') as file:
                # Attach the file with filename to the email
                FILE_NAME = f"{filename}.pdf"
                msg.attach(MIMEApplication(file.read(), Name=FILE_NAME))

    s = smtplib.SMTP(host=SERVER_SMTP_HOST, port=SERVER_SMTP_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()

    return True
