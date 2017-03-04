// global namespace
var dY = dY || {};



dY.Tick = function(timespan, data){
    this.timespan = timespan;
    this.hourOfYear = timespan.hourOfYear();
    this.data = data;
}

dY.Tick.prototype.hourOfDay = function() { return this.timespan.hourOfDay(); };
dY.Tick.prototype.dayOfYear = function() { return this.timespan.dayOfYear(); };

dY.Tick.prototype.valueOf = function(zonekey) {
    if (zonekey.constructor === Array)  return this.data[zonekey[0]][zonekey[1]];
    return this.data[Object.keys(this.data)[0]][zonekey];    
};

dY.Tick.prototype.isIn = function(ts) { return ts.contains(this.timespan.mid); };





dY.STick = function(data){
    this.data = data;
}

dY.STick.prototype.metaOf = function(zonekey) {
    if (zonekey.constructor === Array)  return this.data[zonekey[0]][zonekey[1]];
    return this.data[Object.keys(this.data)[0]][zonekey];
};

dY.STick.prototype.setTickDomain = function(domain) {
    this.startTick = domain[0];
    this.endTick = domain[1];
    this.midTick = Math.ceil( (domain[1] - domain[0])/2 + domain[0] );
    this.tickDomain = domain;
};

dY.STick.prototype.averageOf = function(zonekey) { return this.metaOf(zonekey).average };
dY.STick.prototype.domainOf = function(zonekey) { return this.metaOf(zonekey).domain };
dY.STick.prototype.maxOf = function(zonekey) { return this.metaOf(zonekey).max };
dY.STick.prototype.medianOf = function(zonekey) { return this.metaOf(zonekey).median };
dY.STick.prototype.minOf = function(zonekey) { return this.metaOf(zonekey).min };
dY.STick.prototype.q1Of = function(zonekey) { return this.metaOf(zonekey).q1 };
dY.STick.prototype.q2Of = function(zonekey) { return this.metaOf(zonekey).q2 };
dY.STick.prototype.q3Of = function(zonekey) { return this.metaOf(zonekey).q3 };

