// global namespace
var dY = dY || {};


dY.Year = function(schema, ticks){
    this.schema  = schema;
    this.ticks = ticks;
}

dY.Year.prototype.metaOf = function(zonekey) {
    return this.schema[zonekey[0]][zonekey[1]];
};



dY.Year.prototype.calcDailySummary = function() {
    ret = [];
    
    
};