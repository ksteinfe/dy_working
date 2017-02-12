// global namespace
var dY = dY || {};


dY.Arr = function(schema, ticks){
    this.schema  = schema;
    this.ticks = ticks;
}

dY.Arr.prototype.type = function() {
  return -1;
};

dY.Arr.prototype.metaOf = function(zonekey) {
    return this.schema[zonekey[0]][zonekey[1]];
};