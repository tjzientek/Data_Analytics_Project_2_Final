import requests
import json
import pandas as pd
import time
import ast
from .config import username, api_key

def flightsearchdata(origin, destination, date):

    startDatetime = date + ' 00:00:00 +0000'
    endDatetime = date + ' 23:59:59 +0000'
    startEpoch = int(time.mktime(time.strptime(startDatetime, '%Y-%m-%d %H:%M:%S +0000')))
    endEpoch = int(time.mktime(time.strptime(endDatetime, '%Y-%m-%d %H:%M:%S +0000')))

    baseurl = f"http://{username}:{api_key}@flightxml.flightaware.com/json/FlightXML2/"

    addurl = f"AirlineFlightSchedules?startDate={startEpoch}&endDate={endEpoch}&origin={origin}&destination={destination}&howMany=100"

    fxmlurl = baseurl + addurl
    
    response = requests.get(fxmlurl).json()
    
    data = response["AirlineFlightSchedulesResult"]['data']
    df = pd.DataFrame.from_dict(data, orient='columns')

    idents = []
    for index, row in df.iterrows():
        if row['actual_ident'] == "":
            if [row['ident'],row['departuretime']] not in idents:
                idents.append([row['ident'],row['departuretime']])
        else:
            if [row['actual_ident'],row['departuretime']] not in idents:
                idents.append([row['actual_ident'],row['departuretime']])

    flights = []
    for ident in idents:
        addurl2 = f"FlightInfoEx?ident={ident[0]}@{ident[1]}&howMany=1&offset=0"
        fxmlurl2 = baseurl + addurl2
        idents_resp = json.dumps(requests.get(fxmlurl2).json())
        idents_resp = idents_resp.replace("[","").replace("]","")
        idents_resp2 = ast.literal_eval(idents_resp)
        if ('FlightInfoExResult' in idents_resp2):
            flights.append(idents_resp2['FlightInfoExResult']['flights'])
        

    return flights



def getaveragetraveltimes(flights):
    
    data = []

    baseurl = f"http://{username}:{api_key}@flightxml.flightaware.com/json/FlightXML2/"

    for flight in flights:
        ident1 = flight['ident']
        schedules = {}

        addurl = f"FlightInfoEx?ident={ident1}&howMany=15&offset=0"
        fxmlurl = baseurl + addurl
        response = requests.get(fxmlurl).json()
        if ('FlightInfoExResult' in response):
            schedules = response["FlightInfoExResult"]['flights']

        total_minutes_departure = 0
        total_minutes_arrival = 0
        count = 0
        ident = ""
        filed_departuretime = 0
        actualdeparturetime = 0

        for schedule in schedules:
            ident = schedule['ident']
            filed_departuretime = schedule['filed_departuretime']
            estimatedarrivaltime = schedule['estimatedarrivaltime']
            actualdeparturetime = schedule['actualdeparturetime']
            actualarrivaltime = schedule['actualarrivaltime']
            minutes_departure = 0
            departure = False
            if (actualdeparturetime != 0 and actualdeparturetime != -1):
                minutes_departure = (filed_departuretime - actualdeparturetime) / 60
                departure = True
            minutes_arrival = 0
            arrival = False
            if (actualarrivaltime != 0 and actualarrivaltime != -1):
                minutes_arrival = (estimatedarrivaltime - actualarrivaltime) / 60
                arrival = True
            total_minutes_departure += minutes_departure
            total_minutes_arrival += minutes_arrival
            if (departure or arrival):
                count += 1

        avg_minutes_departure = 0
        avg_minutes_arrival = 0
        if (total_minutes_departure != 0 and count != 0):
            avg_minutes_departure = total_minutes_departure / count
        if (total_minutes_arrival != 0 and count != 0):
            avg_minutes_arrival = total_minutes_arrival / count
        d = {}
        d['ident'] = ident
        d["avgdeparture"] = int(avg_minutes_departure)
        d["avgarrival"] = int(avg_minutes_arrival)
        d['count'] = count
        data.append(d)

    return data






