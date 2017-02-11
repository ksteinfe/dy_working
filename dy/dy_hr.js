// global namespace
var dY = dY || {};






dY.Tick = function(hourOfYear, data){
    this.hourOfYear = hourOfYear;
    this.data = data;
}

dY.Tick.prototype.hourOfDay = function() {
  return this.hourOfYear % 24;
};

dY.Tick.prototype.dayOfYear = function() {
  return Math.floor(this.hourOfYear /24);
};

dY.Tick.prototype.valueOf = function(zonekey) {
    return this.data[zonekey[0]][zonekey[1]];
};