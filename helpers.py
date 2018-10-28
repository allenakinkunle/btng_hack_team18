import pandas as pd
import firebase_admin
from firebase_admin import credentials, db
import time
import math

def report(type, message):
    pass

def is_polling_boot(code):
    polling_units = pd.read_csv('polling_units.csv')
    is_polling_unit = code in polling_units['Polling Unit Code'].values
    print(code)
    if is_polling_unit:
        # # Return the address of the polling unit
        # address = polling_units[polling_units['Polling Unit Code'] == code]['Polling Unit Name'][0]
        return True
    else:
        return is_polling_unit

def save_to_db(polling_unit, message, type):
    cred = credentials.Certificate('serviceAccountKey.json')
    default_app = firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://btng-team18.firebaseio.com/'
    })

    report_link = f'pollingUnits/{polling_unit}/reports'
    ref = db.reference(report_link)

    ref.push({
        'date': math.floor(time.time()),
        'message': "BTNG Hackathon 2018: " + message,
        'status': type
    })


