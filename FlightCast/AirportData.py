import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import json


def getairportdata():

    engine = create_engine("sqlite:///FlightCast/airports.db")
    Base = automap_base()
    Base.prepare(engine, reflect=True)
    Airports = Base.classes.airports
    session = Session(engine)

    airportlist = session.query(Airports).filter(Airports.ICAO.like('K%')).filter(Airports.Name.like('%international%')).order_by(Airports.Name).all()

    def row2dict(row):
        d = {}
        for column in row.__table__.columns:
            
            if str(column.type) == "TEXT":
                d[column.name] = str(getattr(row, column.name)).replace("'","").replace("\\N","")
            else:
                d[column.name] = getattr(row, column.name)

        return d

    data = []

    for airport in airportlist:
        data.append(row2dict(airport))

    return data