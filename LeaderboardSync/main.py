import gspread
from google.oauth2.service_account import Credentials
from pymongo import MongoClient
from flask import jsonify
from google.cloud import secretmanager
import json
import datetime
from google.auth.transport.requests import AuthorizedSession

def get_secret(project_id, secret_id):
    client = secretmanager.SecretManagerServiceClient()
    secret_name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": secret_name})
    return response.payload.data.decode('UTF-8') 

def sync_reia_leaderboard(request):
     # Retrieve the service account credentials from Secret Manager
    service_account_info = json.loads(get_secret('access-spreadsheets-388622', 'service-account-credentials'))
    # Use the service account credentials to authorize gspread
    credentials = Credentials.from_service_account_info(service_account_info, scopes=['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive'])
    gc = gspread.Client(auth=credentials)
    gc.session = AuthorizedSession(credentials)
    spreadsheet = gc.open_by_url("https://docs.google.com/spreadsheets/d/1DWbdxqY53PxtdTsFYrWPrzC96x1UE7oFNg19kg5U9S0/edit#gid=0")

    mongodb_password = get_secret('access-spreadsheets-388622', 'REIA-MongoDB-Password')
    uri = f"mongodb+srv://rjsprague:{mongodb_password}@cluster0.tjsihpy.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(uri)
    db = client['REIA']
    collection = db['Leaderboard']

    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"Error while pinging MongoDB: {e}")

    for worksheet in spreadsheet.worksheets():
        values = worksheet.get_all_values()

        header = values[0]
        data = []
        for row in values[1:]:
            # Extract the year and month from the date
            date_parts = row[0].split()
            year = date_parts[0]
            month = date_parts[1]

            # Create a document for this row
            document = {
                'year': year,
                'month': month,
                'workspace': row[1],
                'ad_spend': row[2],
                'sls': row[3],
                'q_da_approved': row[4],
                'perfect_presentation': row[5],
                'contracts': row[6],
                'acquisitions': row[7],
                'deals': row[8],
                'speed_to_lead_median': row[9],
                'cost_per_contract': row[10],
                'cost_per_qualified_lead': row[11],
                'pp_da_rate': row[12],
            }

            # Insert the document into the MongoDB collection
            collection.insert_one(document)

    return jsonify({'result': 'success'}), 200
