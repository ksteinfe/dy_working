// global namespace
var dY = dY || {};




// dY.solarGeom
// spot checks for Oakland CA verify calculations within a degree with https://www.esrl.noaa.gov/gmd/grad/solcalc/

dY.solarGeom = {};


dY.solarGeom.dailyAtGivenHour = function(loc, hourOfDay){
    var days = [...Array(365).keys()];
    var data = days.map( function(d){ return dY.solarGeom.solarGeomAtHour(loc,d,hourOfDay); } );
    
    return {
        location: loc,
        hourOfDay: hourOfDay,
        data: data
    }
}

dY.solarGeom.hourlyAtGivenDay = function(loc, dayOfYear){
    var hrs = [...Array(24).keys()];
    var data = hrs.map( function(h){ return dY.solarGeom.solarGeomAtHour(loc,dayOfYear,h); } );
    
    var swtch = false;
    var sunrise, sunset;
    for (var d in data){
        var sunIsUp = data[d].altitudeDeg > 0.0;
        if (sunIsUp != swtch){
            if (sunIsUp) sunrise = dY.util.remap( [data[d-1].altitudeDeg, data[d].altitudeDeg],[d-1,d],0.0);
            else sunset = dY.util.remap( [data[d-1].altitudeDeg, data[d].altitudeDeg],[d-1,d],0.0);
            swtch = sunIsUp;
        }
    }
    
    return {
        location: loc,
        dayOfYear: dayOfYear,
        data: data,
        sunrise: sunrise,
        sunset: sunset
    }
}


dY.solarGeom.vecAtHour = function(loc, argA, argB){
    var sGeom = dY.solarGeom.solarGeomAtHour(loc, argA, argB)
    var x = Math.cos(sGeom.altitudeRad)*Math.sin(sGeom.azimuthRad)
    var y = Math.cos(sGeom.altitudeRad)*Math.cos(sGeom.azimuthRad)
    var z = Math.sin(sGeom.altitudeRad)
    return [x, y, z]
}

dY.solarGeom.degAnglesAtHour = function(loc, argA, argB){
    var sGeom = dY.solarGeom.solarGeomAtHour(loc, argA, argB)
    return {
        altitude: sGeom.altitudeDeg,
        azimuth: sGeom.azimuthDeg
    }
}

dY.solarGeom.radAnglesAtHour = function(loc, argA, argB){
    var sGeom = dY.solarGeom.solarGeomAtHour(loc, argA, argB)
    return {
        altitude: sGeom.altitudeRad,
        azimuth: sGeom.azimuthRad
    }
}

dY.solarGeom.solarGeomAtHour = function(loc, argA, argB){
    /*
    calculates the following solar position angles for given coordinates, integer day of the year (0->365), local time. 
    Altitude
    Azimuth
    Declination
    Hour Angle
    all output in radians
    */
    var dayOfYear = argA;
    var hourOfDay = argB;
    if (typeof argB === "undefined") {
        if (typeof argA === "number") {
            var dayOfYear = Math.floor(argA /24);
            var hourOfDay = argA % 24;
        }
        if (typeof argA === "object") {
            var dayOfYear = argA.dayOfYear();
            var hourOfDay = argA.hourOfDay() + 0.5; // adds a half hour to get solar position at the middle of the tick's hour
        }
    }
    
    var lat =  loc.latitude;
    var lng =  loc.longitude;
    var tmz =  loc.timezone;
    
    var alpha = dY.solarGeom.calcAlpha(dayOfYear, hourOfDay);
    
    //calculate Declination Angle
    var decDeg = 0.396372-22.91327*Math.cos(alpha)+4.02543*Math.sin(alpha)-0.387205*Math.cos(2*alpha)+0.051967*Math.sin(2*alpha)-0.154527*Math.cos(3*alpha)+0.084798*Math.sin(3*alpha);
    var decRad = dY.solarGeom.degToRad(decDeg);
    
    // time correction for solar angle
    var tc = 0.004297+0.107029*Math.cos(alpha)-1.837877*Math.sin(alpha)-0.837378*Math.cos(2*alpha)-2.340475*Math.sin(2*alpha);
    
    // calculate Solar Hour Angle, angle between local longitude and solar noon
    var hAngDeg = (hourOfDay-12-tmz)*(360/24) + lng + tc;
    if (hAngDeg >= 180) hAngDeg = hAngDeg - 360;
    if (hAngDeg <= -180) hAngDeg = hAngDeg + 360;
    var hAngRad = dY.solarGeom.degToRad(hAngDeg) ;
    
    //calc Altitude Angle
    var latRad = dY.solarGeom.degToRad(lat);
    var cosZenith = Math.sin(latRad)*Math.sin(decRad)+Math.cos(latRad)*Math.cos(decRad)*Math.cos(hAngRad);
    if (cosZenith>1) cosZenith = 1;
    if (cosZenith<-1) cosZenith = -1;

    var zenRad = Math.acos(cosZenith)
    var altRad =  Math.asin(cosZenith)
    
    //calc Azimuth angle
    var cosAzi = (Math.sin(decRad)-Math.sin(latRad)*Math.cos(zenRad))/(Math.cos(latRad)*Math.sin(zenRad));
    var aziDeg = dY.solarGeom.radToDeg(Math.acos(cosAzi));
    if (hAngRad > 0) aziDeg = 360-aziDeg;
    var aziRad = dY.solarGeom.degToRad(aziDeg);
    
    return {
        altitudeRad: altRad,
        altitudeDeg: dY.solarGeom.radToDeg(altRad),
        azimuthRad: aziRad,
        azimuthDeg: aziDeg,
        declinationRad: decRad,
        declinationDeg: decDeg,
        hourAngleRad: hAngRad,
        hourAngleDeg: hAngDeg
    }
}

dY.solarGeom.calcAlpha = function(dayOfYear, hourOfDay){
    return dY.solarGeom.degToRad( (360/365.25)*(dayOfYear + hourOfDay/24)  );
}

dY.solarGeom.degToRad = function(degrees){ return degrees * (Math.PI / 180); }
dY.solarGeom.radToDeg = function(radians){ return radians * (180 / Math.PI); }