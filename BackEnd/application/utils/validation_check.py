def basicvalidation(inputdata=None):
    flag = True
    if inputdata:
        if (';' in inputdata) or ('=' in inputdata):
            flag = False
        if 'delete' in inputdata.lower():
            flag = False
    return flag

def settingsvalidation(inputdata=None):
    flag = True
    if inputdata:
        if (';' in inputdata) or ('=' in inputdata):
            flag = False
        if ('delete' in inputdata.lower()):
            flag = False
        if (', ' in inputdata):
            flag = False
    return flag

