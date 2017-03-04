// global namespace
var dY = dY || {};



// dY.datetime
//

dY.dt = {};
dY.dt.year = 1970; // the assumed year in all parsed dates. make sure it isn't a leap year.
dY.dt.dateStringToDate = function(str){
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
    
    dt = new Date(Date.UTC(dY.dt.year,month,day,hour,30));
    
    //console.log(str +"\t"+ month+"/"+day+" "+hour +"\t\t"+ dt.getUTCMonth() +" "+ dt.getUTCDate() +" " + dt.getUTCHours() + " -- " + dY.dt.dateToHourOfYear(dt));
    //console.log(dt.toUTCString() + "\t\t" + dY.dt.hourOfYearToDate( dY.dt.dateToHourOfYear(dt) ).toUTCString() );
    return dt;
}
dY.dt.dateToHourOfYear = function(dt){
    start = new Date(Date.UTC(dY.dt.year, 0, 1, 0, 30));
    diff = dt - start;
    hour = Math.floor(diff / (1000 * 60 * 60 ));
    return hour;
}
dY.dt.hourOfYearToDate = function(hr){
    return new Date( (hr+0.5) * (1000 * 60 * 60 )  ); // constructs a date in UTC by number of milliseconds 
}

dY.dt.niceFormat = function(dt){
    var mth = dY.dt.monthTable[ dt.getUTCMonth() ].shortname;
    var dat = dt.getUTCDate();
    var hours = dt.getUTCHours();
    var mins = dt.getUTCMinutes();
    
    var pad = function(n) { return (n < 10) ? ("0" + n) : n; }    
    
    return pad(dat) +" "+ mth + " " + pad(hours) + ":" +  pad(mins)
}

dY.dt.monthTable = [
    {idx: 0, fullname: "January", shortname: "Jan" , msDomain: [Date.UTC(dY.dt.year,0,1,0,0,0,0),  Date.UTC(dY.dt.year,1,1,0,0,0,0)] },
    {idx: 1, fullname: "February", shortname: "Feb" , msDomain: [Date.UTC(dY.dt.year,1,1,0,0,0,0),  Date.UTC(dY.dt.year,2,1,0,0,0,0)] },
    {idx: 2, fullname: "March", shortname: "Mar" , msDomain: [Date.UTC(dY.dt.year,2,1,0,0,0,0),  Date.UTC(dY.dt.year,3,1,0,0,0,0)] },
    {idx: 3, fullname: "April", shortname: "Apr" , msDomain: [Date.UTC(dY.dt.year,3,1,0,0,0,0),  Date.UTC(dY.dt.year,4,1,0,0,0,0)] },
    {idx: 4, fullname: "May", shortname: "May" , msDomain: [Date.UTC(dY.dt.year,4,1,0,0,0,0),  Date.UTC(dY.dt.year,5,1,0,0,0,0)] },
    {idx: 5, fullname: "June", shortname: "Jun" , msDomain: [Date.UTC(dY.dt.year,5,1,0,0,0,0),  Date.UTC(dY.dt.year,6,1,0,0,0,0)] },
    {idx: 6, fullname: "July", shortname: "Jul" , msDomain: [Date.UTC(dY.dt.year,6,1,0,0,0,0),  Date.UTC(dY.dt.year,7,1,0,0,0,0)] },
    {idx: 7, fullname: "August", shortname: "Aug" , msDomain: [Date.UTC(dY.dt.year,7,1,0,0,0,0),  Date.UTC(dY.dt.year,8,1,0,0,0,0)] },
    {idx: 8, fullname: "September", shortname: "Sep" , msDomain: [Date.UTC(dY.dt.year,8,1,0,0,0,0),  Date.UTC(dY.dt.year,9,1,0,0,0,0)] },
    {idx: 9, fullname: "October", shortname: "Oct" , msDomain: [Date.UTC(dY.dt.year,9,1,0,0,0,0),  Date.UTC(dY.dt.year,10,1,0,0,0,0)] },
    {idx: 10, fullname: "November", shortname: "Nov" , msDomain: [Date.UTC(dY.dt.year,10,1,0,0,0,0),  Date.UTC(dY.dt.year,11,1,0,0,0,0)] },
    {idx: 11, fullname: "December", shortname: "Dec" , msDomain: [Date.UTC(dY.dt.year,11,1,0,0,0,0),  Date.UTC(dY.dt.year+1,0,1,0,0,0,0)] }
]


dY.timeSpan = function(DateTimeStart, DateTimeEnd){
    // can be given Dates or milliseconds 
    // given dates should be in UTC and in year 1970
    // given dates will be rounded either UP or DOWN to the nearest minute
    
    if (Object.prototype.toString.call(DateTimeStart) == "[object Date]") DateTimeStart = +DateTimeStart
    if (Object.prototype.toString.call(DateTimeEnd) == "[object Date]") DateTimeEnd = +DateTimeEnd
    
    var coeff = 1000 * 60; // to round to nearest minute
    var a = Math.ceil( +DateTimeStart / coeff ) * coeff;
    var b = Math.floor( +DateTimeEnd / coeff ) * coeff;
    this._ = dY.dt.niceFormat( new Date(a) ) + " -> " + dY.dt.niceFormat( new Date(b) )
    this.min = a;
    this.max = b;
    this.mid = (b-a)*0.5 + a;
    
    //this.dateStart = function() { return new Date(a); };
    //this.dateMid = function() { return new Date((b-a)*0.5 + a); };
    //this.dateEnd = function() { return new Date(b); };
    //this.date = function() { return this.dateMid() }; // a stand in for relating this time span to a single date for plotting a tick
    //this.dateDomain = function() { return [new Date(a), new Date(b)]; };
    
    this.hourOfYearStart = function() { return Math.round(a / 1000 / 60 / 60); };
    this.hourOfYearMid = function() { return this.mid / 1000 / 60 / 60; }; // NOT ROUNDED
    this.hourOfYearEnd = function() { return Math.round(b / 1000 / 60 / 60); }; 
    this.hourOfYear = function() { return Math.floor(this.hourOfYearMid()) }; // a stand in for relating this time span to a single hour of the year for plotting a tick
    this.hourOfYearDomain = function() { return [ this.hourOfYearStart(), this.hourOfYearEnd() - 1 ]; }; // end index is inclusive for constructing d3 domains. spans of a single hour will report zero-length domains
    
    this.hoursOfYear = function() { return Array.from(new Array(this.durationHrs()), (x,i) => i + this.hourOfYearStart()); };
    
    this.dayOfYear = function() { return Math.floor(this.hourOfYear() /24); }; // a stand in for relating this time span to a single day of the year for plotting a tick
    this.hourOfDay = function() { return this.hourOfYear() % 24;}  // a stand in for relating this time span to a single day of the year for plotting a tick
    
    this.duration = function() { return b - a; };
    this.durationSec = function() { return Math.round( (b - a) / 1000 ); };
    this.durationMin = function() { return Math.round( (b - a) / 1000 / 60); };
    this.durationHrs = function() { return Math.round( (b - a) / 1000 / 60 / 60); };
    
    this.isHour = function() { return this.durationHrs() == 1; };
}

dY.timeSpan.prototype.contains = function(val) { return (val >= this.min && val < this.max); }

dY.timeSpan.prototype.report = function() { 
    console.log(this._);
    //console.log("\t date\t\t"+this.dateStart().toUTCString() +" -> "+ this.dateEnd().toUTCString() );
    console.log("\t hoy domain \t\t"+this.hourOfYearDomain());
    console.log("\t mid hr \t\t"+this.hourOfYearMid());
    console.log("\t dur\t\t"+this.duration());
    console.log("\t durHrs\t\t"+this.durationHrs());
    console.log("\t hour of year\t\t"+this.hourOfYear());
    console.log("\t day of year\t\t"+this.dayOfYear());
    console.log("\t hour of day\t\t"+this.hourOfDay());
    
    //console.log("\t hoursOfYear\t\t"+this.hoursOfYear());
    
 };

dY.timeSpan.hourOfYear = function(hr){ return new dY.timeSpan(hr * (1000*60*60) , (hr+1) * (1000*60*60))}
dY.timeSpan.hoursOfYear = function(a,b){ return new dY.timeSpan(a * (1000*60*60) , (b+1) * (1000*60*60))}

dY.timeSpan.dayOfYear = function(day){ return new dY.timeSpan( (day*24) * (1000*60*60) , ((day+1)*24) * (1000*60*60))}
dY.timeSpan.daysOfYear = function(a,b){ return new dY.timeSpan( (a*24) * (1000*60*60) , ((b+1)*24) * (1000*60*60))}
 
dY.timeSpan.monthOfYear = function(mth) { return new dY.timeSpan( dY.dt.monthTable[mth].msDomain[0], dY.dt.monthTable[mth].msDomain[1] ); };
dY.timeSpan.monthsOfYear = function(a,b) { return new dY.timeSpan( dY.dt.monthTable[a].msDomain[0], dY.dt.monthTable[b].msDomain[1] ); };

dY.timeSpan.fullYear = new dY.timeSpan( 0, 31536000000 );
dY.timeSpan.janurary = dY.timeSpan.monthOfYear(0);
dY.timeSpan.february = dY.timeSpan.monthOfYear(1);
dY.timeSpan.march = dY.timeSpan.monthOfYear(2);
dY.timeSpan.april = dY.timeSpan.monthOfYear(3);
dY.timeSpan.may = dY.timeSpan.monthOfYear(4);
dY.timeSpan.june = dY.timeSpan.monthOfYear(5);
dY.timeSpan.july = dY.timeSpan.monthOfYear(6);
dY.timeSpan.august = dY.timeSpan.monthOfYear(7);
dY.timeSpan.september = dY.timeSpan.monthOfYear(8);
dY.timeSpan.october = dY.timeSpan.monthOfYear(9);
dY.timeSpan.november = dY.timeSpan.monthOfYear(10);
dY.timeSpan.december = dY.timeSpan.monthOfYear(11);


