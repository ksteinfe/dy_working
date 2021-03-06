

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    
    var hourOfYear = 0;
    var dayOfYear = dObj.ticks[hourOfYear].dayOfYear();
    var hourOfDay = dObj.ticks[hourOfYear].hourOfDay();
    console.log(dayOfYear +", "+ hourOfDay);
    console.log( dY.dt.hourOfYearToDate(hourOfYear).toUTCString() );
    
    /*
    // if dObj does not contain a location, we could define it like this
    var location = {
        latitude: 37.72,
        longitude: -122.22,
        timezone: -8.0,
    };
    */
    
    var sGeom = dY.solarGeom.solarGeomAtHour(dObj.location,0);
    //console.log(sGeom);
    
    var degAtHr = dY.solarGeom.degAnglesAtHour(dObj.location,dObj.ticks[hourOfYear])
    //console.log(degAtHr);
    
    var radAtHr = dY.solarGeom.radAnglesAtHour(dObj.location,hourOfYear)
    //console.log(radAtHr);
        
    for (var t in dObj.ticks) dObj.ticks[t].solarGeom = dY.solarGeom.solarGeomAtHour(dObj.location,dObj.ticks[t]);
    //console.log(dObj);
    
    var sGeomAtDay = dY.solarGeom.hourlyAtGivenDay(dObj.location, 0);
    //console.log(sGeomAtDay);
    
    var lGeom = dY.lunarGeom.lunarGeomAtHour(dObj.location,0);
    //console.log( lGeom );
    
    var lGeomAtDay = dY.lunarGeom.hourlyAtGivenDay(dObj.location, 0);
    console.log(lGeomAtDay);  

    var geomNearHourOfYear = dY.solarGeom.geomNearHourOfYear(dObj.location, 24, 5);
    console.log(geomNearHourOfYear);  
    
    console.log(dObj.ticks[0].season().fullname);
}

