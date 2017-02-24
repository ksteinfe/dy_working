// global namespace
var dY = dY || {};




// dY.solarGeom
// spot checks for Oakland CA verify calculations within a degree with https://www.esrl.noaa.gov/gmd/grad/solcalc/

dY.solarGeom = {};

dY.solarGeom.vecAt = function(lat, lng, tmz, argA, argB){
    var sGeom = dY.solarGeom.solarGeomAt(lat, lng, tmz, argA, argB)
    var x = Math.cos(sGeom.altitudeRad)*Math.sin(sGeom.azimuthRad)
    var y = Math.cos(sGeom.altitudeRad)*Math.cos(sGeom.azimuthRad)
    var z = Math.sin(sGeom.altitudeRad)
    return [x, y, z]
}

dY.solarGeom.degAnglesAt = function(lat, lng, tmz, argA, argB){
    var sGeom = dY.solarGeom.solarGeomAt(lat, lng, tmz, argA, argB)
    return {
        altitude: sGeom.altitudeDeg,
        azimuth: sGeom.azimuthDeg
    }
}

dY.solarGeom.radAnglesAt = function(lat, lng, tmz, argA, argB){
    var sGeom = dY.solarGeom.solarGeomAt(lat, lng, tmz, argA, argB)
    return {
        altitude: sGeom.altitudeRad,
        azimuth: sGeom.azimuthRad
    }
}

dY.solarGeom.solarGeomAt = function(lat, lng, tmz, argA, argB){
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
            var hourOfDay = argA.hourOfDay();
        }        
    }
    
    
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