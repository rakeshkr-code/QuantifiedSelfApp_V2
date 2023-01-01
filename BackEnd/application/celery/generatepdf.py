from flask import render_template
from weasyprint import HTML
import os

def generate_pdf_report(data):
    message = render_template('monthlypdfreport.html', data=data)
    html = HTML(string=message)
    mailid = data['email']
    cusername = mailid.split("@")[0]
    basedir = os.path.abspath(os.path.dirname(__file__))
    file_name = cusername + '.pdf'
    print(file_name)
    filepathname = os.path.join(basedir, f"../../pdfreports/{file_name}")
    html.write_pdf(target=filepathname)

# if __name__=='__main__':
#     main()

