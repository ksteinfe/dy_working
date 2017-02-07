// global namespace
var dY = dY || {};




// dY.Util
//

dY.util = {};
dY.util.loadCSS = function (path){
    dY.report("dy: attempting to load CSS file "+path);
    
    var file = location.pathname.split( "/" ).pop();
    
    var link = document.createElement( "link" );
    link.href = path;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";

    document.getElementsByTagName( "head" )[0].appendChild( link );
}

dY.util.pad = function(n) {
    return (n < 10) ? ("0" + n) : n;
}

// dY.datetime
//

dY.datetime = {};
dY.datetime.year = 1970; // the assumed year in all parsed dates. make sure it isn't a leap year.
dY.datetime.dateStringToDate = function(str){
    // example: 01/21  07:00:00
    // the times listed in EP result file seem to represent the end of the hour. They start the day at 1am.
    // this means the last hour listed for a day is 24.
    // since javascript Date understands this as the following day, we set the returned Date object to the middle of the hour.
    // for this reason, our hours of the day will proceed from 0-23; while the EP result file proceeds from 1-24.
        
    splt = str.split("  ");
    date = splt[0].trim().split("/");
    month = parseInt(date[0])-1
    day = parseInt(date[1])
    hour = parseInt(splt[1].trim().split(":")[0])-1;
    
    dt = new Date(Date.UTC(dY.datetime.year,month,day,hour,30));
    
    //console.log(str +"\t"+ month+"/"+day+" "+hour +"\t\t"+ dt.getUTCMonth() +" "+ dt.getUTCDate() +" " + dt.getUTCHours() + " -- " + dY.datetime.dateToHourOfYear(dt));
    //console.log(dt.toUTCString() + "\t\t" + dY.datetime.hourOfYearToDate( dY.datetime.dateToHourOfYear(dt) ).toUTCString() );
    return dt;
}
dY.datetime.dateToHourOfYear = function(dt){
    start = new Date(Date.UTC(dY.datetime.year, 0, 1, 0, 30));
    diff = dt - start;
    hour = Math.floor(diff / (1000 * 60 * 60 ));
    return hour;
}
dY.datetime.hourOfYearToDate = function(hr){
    return new Date( (hr+0.5) * (1000 * 60 * 60 ) );
}

