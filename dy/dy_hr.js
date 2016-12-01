// global namespace
var dY = dY || {};






dY.Hr = function(hourOfYear, data){
    this.hourOfYear = hourOfYear;
    this.data = data;
}

dY.Hr.prototype.hourOfDay = function() {
  return this.hourOfYear % 24;
};

dY.Hr.prototype.dayOfYear = function() {
  return Math.floor(this.hourOfYear /24);
};

dY.Hr.prototype.valueOf = function(zonekey) {
    return this.data[zonekey[0]][zonekey[1]];
};