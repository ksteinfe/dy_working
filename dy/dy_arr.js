// global namespace
var dY = dY || {};


dY.Arr = function(meta, ticks){
    this.meta = meta;
    this.ticks = ticks;
}

dY.Arr.prototype.type = function() {
  return -1;
};

dY.Arr.prototype.metaOf = function(zonekey) {
    return this.meta[zonekey[0]][zonekey[1]];
};