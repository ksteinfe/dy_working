

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    
    var hourOfYear = 1900;
    var dayOfYear = dObj.ticks[hourOfYear].dayOfYear();
    var hourOfDay = dObj.ticks[hourOfYear].hourOfDay();
    console.log(dayOfYear +", "+ hourOfDay);
    console.log( dY.datetime.hourOfYearToDate(hourOfYear).toGMTString() );
    
    
    var location = {
        latitude: 37.72,
        longitude: -122.22,
        timezone: -8.0,
    };
    
    var sGeom = dY.solarGeom.solarGeomAtHour(location,dayOfYear,hourOfDay);
    //console.log(sGeom);
    
    var degAtHr = dY.solarGeom.degAnglesAtHour(location,dObj.ticks[hourOfYear])
    //console.log(degAtHr);
    
    var radAtHr = dY.solarGeom.radAnglesAtHour(location,hourOfYear)
    //console.log(radAtHr);
        
    for (var t in dObj.ticks) dObj.ticks[t].solarGeom = dY.solarGeom.solarGeomAtHour(location,dObj.ticks[t]);
    //console.log(dObj);
    
    
    var geomAtDay = dY.solarGeom.hourlyAtGivenDay(location, 0);
    console.log(geomAtDay);
}

