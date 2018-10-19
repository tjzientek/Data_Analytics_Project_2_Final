import requests
import json
import pandas as pd
import time
from .config import username, api_key

def flightmapdata(flightID):

    baseurl = f"http://{username}:{api_key}@flightxml.flightaware.com/json/FlightXML2/"

    addurl = f"DecodeFlightRoute?faFlightID={flightID}"

    fxmlurl = baseurl + addurl
    
    response = requests.get(fxmlurl).json()
    
    return response['DecodeFlightRouteResult']['data']
