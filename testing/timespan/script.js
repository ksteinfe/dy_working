

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    var hr = dY.timeSpan.hourOfYear(36);
    console.log(hr);
    hr.report();
    
    var hrs = dY.timeSpan.hoursOfYear(24,47);
    console.log(hrs);
    console.log(hrs.hoursOfYear());
    hrs.report();    
    
    var dy = dY.timeSpan.dayOfYear(1);
    console.log(dy);
    console.log(dy.hoursOfYear());
    dy.report();
    
    var dys = dY.timeSpan.daysOfYear(0,1);
    console.log(dys);
    console.log(dys.hoursOfYear());
    dys.report();    
    
    /*
    var fy = dY.timeSpan.fullYear;
    console.log(fy);
    fy.report();
    */
    
    var tck = new dY.Tick( dY.timeSpan.hourOfYear(12), {});
    console.log(tck);
    console.log(tck.isIn(dys));
    
    
}

