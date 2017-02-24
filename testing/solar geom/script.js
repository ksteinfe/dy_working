

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    
    var hourOfYear = 1900;
    var dayOfYear = dObj.ticks[hourOfYear].dayOfYear();
    var hourOfDay = dObj.ticks[hourOfYear].hourOfDay();
    console.log(dayOfYear +", "+ hourOfDay);
    console.log( dY.datetime.hourOfYearToDate(hourOfYear).toGMTString() );
    
    var lat = 37.72
    var lng = -122.22
    var tmz = -8.0
    
    var sGeom = dY.solarGeom.solarGeomAt(lat,lng,tmz,dayOfYear,hourOfDay);
    console.log(sGeom);
    
    console.log(dY.solarGeom.degAnglesAt(lat,lng,tmz,dObj.ticks[hourOfYear]));
    console.log(dY.solarGeom.radAnglesAt(lat,lng,tmz,hourOfYear));
}

