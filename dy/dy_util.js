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

dY.util.remap = function(src, tar, srcVal) {
    var t = (srcVal - src[0]) / (src[1] - src[0]);
    return (tar[1] - tar[0]) * t + tar[0];
}


dY.util.summarizeTicks = function(schema, ticks){
    var summarySchema = {}
    var alls = []; // summary data by zonekey for calculating ranges for schema
    for (var zon in schema) {
        summarySchema[zon] = {}
        for (var key in schema[zon]) {
            summarySchema[zon][key] = {}
            alls[[zon,key]] = [];
        }
    }
    for (var t in ticks) {
        for (var zon in schema) {
            for (var key in schema[zon]) {
                alls[[zon,key]].push(ticks[t].data[zon][key]);
            }
        }
    };
        
    for (var zon in schema) {
        for (var key in schema[zon]) {
            var allsorted = alls[[zon,key]].sort(function(a,b){return a-b});
            var len = allsorted.length;
            summarySchema[zon][key].min = allsorted[0];
            summarySchema[zon][key].q1 = allsorted[Math.floor(len*.25) - 1];
            summarySchema[zon][key].q2 = allsorted[Math.floor(len*.50) - 1];
            summarySchema[zon][key].q3 = allsorted[Math.floor(len*.75) - 1];
            summarySchema[zon][key].max = allsorted[len-1];
                        
            summarySchema[zon][key].domain = [summarySchema[zon][key].min, summarySchema[zon][key].max];
            summarySchema[zon][key].median = summarySchema[zon][key].q2;
            
            var sum = 0;
            for( var i = 0; i < allsorted.length; i++ ){  sum += allsorted[i]; }
            summarySchema[zon][key].average = sum/len;
        }
    }
    
    return summarySchema;
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

