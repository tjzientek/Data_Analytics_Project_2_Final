from flask import Flask, render_template, redirect, request
from .FlightMap import flightmapdata
from .FlightSearch import flightsearchdata, getaveragetraveltimes
from .AirportData import getairportdata

app = Flask(__name__)
app.config.from_object(__name__)
app.config['SECRET_KEY'] = '7d441f27d441f27567d441f2b6176a'

@app.route("/")
def home():

    return render_template("index.html")


@app.route("/flightsearch/<origin>/<destination>", methods=['GET', 'POST'])
def flightsearchparameters(origin, destination):

    data = getairportdata()

    if request.method == 'POST':
        origin=request.form['origin']
        destination=request.form['destination']
        date=request.form['date']
 
        flightdata = flightsearchdata(origin,destination,date)
        chartdata = getaveragetraveltimes(flightdata)
        return render_template("flightsearch.html", flightdata=flightdata, airportdata=data, origin=origin, destination=destination, chartdata=chartdata)
    else:
        flightdata = []
        chartdata = []
        return render_template("flightsearch.html", flightdata=flightdata, airportdata=data, origin=origin, destination=destination, chartdata=chartdata)


@app.route("/flightsearch", methods=['GET', 'POST'])
def flightsearch():

    origin = ""
    destination = ""
    data = getairportdata()

    if request.method == 'POST':
        origin=request.form['origin']
        destination=request.form['destination']
        date=request.form['date']
 
        flightdata = flightsearchdata(origin,destination,date)
        chartdata = getaveragetraveltimes(flightdata)
        return render_template("flightsearch.html", flightdata=flightdata, airportdata=data, origin=origin, destination=destination, chartdata=chartdata)
    else:
        flightdata = []
        chartdata = []
        return render_template("flightsearch.html", flightdata=flightdata, airportdata=data, origin=origin, destination=destination, chartdata=chartdata)



@app.route("/flightmap/<flightid>/<origin>/<destination>", methods=['GET', 'POST'])
def flightmap(flightid, origin, destination):

    if request.method == 'POST':
        return redirect("/flightsearch/" + origin + "/" + destination)
    else:
        waypoints = flightmapdata(flightid)
        return render_template("flightmap.html", waypointsdata=waypoints)



@app.route("/airportdata")
def airportdata():

    data = getairportdata()
    
    #airportdata = json.dumps(data)

    return render_template("airportdata.html", airportdata=data)


@app.route("/aboutus")
def aboutus():

    return render_template("aboutus.html")



if __name__ == "__main__":
    app.run(debug=True)