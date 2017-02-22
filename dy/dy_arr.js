// global namespace
var dY = dY || {};


dY.Year = function(schema, ticks){
    this.schema  = schema;
    this.ticks = ticks;
}

dY.Year.prototype.metaOf = function(zonekey) {
    if (zonekey.constructor === Array)  return this.schema[zonekey[0]][zonekey[1]];
    return this.schema[Object.keys(this.schema)[0]][zonekey];    
};

dY.Year.prototype.valuesOf = function(zonekey) {
    return this.ticks.map(function(d) {return d.valueOf(zonekey);});
};


dY.Year.prototype.dailySummary = function(dayCount = 1) {
    var slcs = [];
    var t = 0;
    while (t < this.ticks.length){
        stick = new dY.STick( dY.util.summarizeTicks(this.schema, ticks.slice(t,t+24*dayCount)  ) );
        
        stick.setTickDomain([t,t+24*dayCount-1])
        if (dayCount==1) stick.dayOfYear = t/24;
        
        slcs.push( stick ) ;
        t += 24*dayCount;
    }
    return slcs;
};