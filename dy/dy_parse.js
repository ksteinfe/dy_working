// requires PapaParse: <script src="js/papaparse.min.js"></script>
// global namespace
var dY = dY || {};
dY.parser = {};

function OnDYDataLoaded(data,fields) {
    dY.report("dhr: THIS IS A PLACEHOLDER FUNCTION - REPLACE WITH YOUR OWN");
}

dY.report = function (msg){
    //console.log(msg);
    if ($("#dy-console").length){
        var text = $("#dy-console").val() +"\n" + msg;
        $("#dy-console").text(text);
        $('#dy-console').scrollTop($('#dy-console')[0].scrollHeight);
    }
}

dY.parser.zoneKeyToString = function (zoneString,keyString){ return zoneString.trim() + ":" + keyString.trim() }
dY.parser.stringToZoneKey = function (str){
    str = str.trim();
    if (str.indexOf(":") == -1){
        // fail silently if given date/time as field
        if (str == "Date/Time") return false;
        dY.report("dy: Improperly formatted string for zoneKey. No separator found for '"+str+"'");
        return false;
    }
    return [ str.split(":")[0].trim(), str.substring(str.indexOf(":")+1) ]
}

dY.parser.handleParseResults = function (results) {
    dY.report("dy: Handling parse results.");
    
    // Handle Parse Errors
    //
    if (results.errors.length > 0){
        dY.report("dy: Parser encountered "+results.errors.length+" error(s).")
        results.errors.forEach(function(error,n) {
            if (error.code == "TooFewFields" && error.row == results.data.length-1) {
                dY.report("\tThe last row contained improperly formatted data. This happens all the time.");
                results.data.splice(results.data.length-1,1);
            } else {
                dY.report("\t"+n+"\t"+error.code+"; "+error.message+"; row: "+error.row);
            }        
        });
    }
    
    // Handle Parsed Fields
    //
    meta = {};
    if (results.meta.fields.length > 0){
        dY.report("dy: Parser found "+results.meta.fields.length+" columns. Not including Date/Time, these are:")
        
        // find zone strings
        zoneStrings = new Set();
        results.meta.fields.forEach(function(field,n) {
            if (!dY.parser.stringToZoneKey(field)) return;
            zoneStrings.add(dY.parser.stringToZoneKey(field)[0]);
        });
        zoneStrings = Array.from(zoneStrings);
        
        // construct zoneKeys
        zoneStrings.forEach(function(zoneStr,n) {
            meta[zoneStr] = [];
            results.meta.fields.forEach(function(field,n) {
                key = dY.parser.stringToZoneKey(field);
                //if (key && key[0] == zoneStr) meta[zoneStr].push(key[1]);
                if (key && key[0] == zoneStr) meta[zoneStr][key[1]] = [];
            });
        });
        
        // report
        for (var zon in meta) {
            dY.report("\t"+zon);
            for (var key in meta[zon]) {
                dY.report("\t\t"+key);
            }
        }
    }
    
    // Handle Hourly Data
    //
    dY.report("dy: Parser found "+results.data.length+" rows. Parser doesn't care about the number or order.")
    
    // summary data by zonekey for calculating ranges for meta
    alls = [];
    for (var zon in meta) {
        for (var key in meta[zon]) {
            alls[[zon,key]] = [];
        }
    }
    
    // create hours
    hrs = [];
    results.data.forEach(function(row,n) {
        hourOfYear = dY.datetime.dateToHourOfYear( dY.datetime.dateStringToDate(row["Date/Time"]) );
        data = {};
        for (var zon in meta) {
            data[zon] = {};
            for (var key in meta[zon]) {
                value = row[dY.parser.zoneKeyToString(zon,key)];
                data[zon][key] = value;
                alls[[zon,key]].push(value);
            }
        }
        hrs.push( new dY.Hr(hourOfYear, data)  );
        
    });
    
    
    // fill out meta information
    //console.log(alls);
    for (var zon in meta) {
        for (var key in meta[zon]) {
            allsorted = alls[[zon,key]].sort(function(a,b){return a-b});
            len = allsorted.length;
            meta[zon][key].min = allsorted[0];
            meta[zon][key].q1 = allsorted[Math.floor(len*.25) - 1];
            meta[zon][key].q2 = allsorted[Math.floor(len*.50) - 1];
            meta[zon][key].q3 = allsorted[Math.floor(len*.75) - 1];
            meta[zon][key].max = allsorted[len-1];
                        
            meta[zon][key].domain = [meta[zon][key].min, meta[zon][key].max];
            meta[zon][key].median = meta[zon][key].q2;
            
            sum = 0;
            for( var i = 0; i < allsorted.length; i++ ){  sum += allsorted[i]; }
            meta[zon][key].average = sum/len;
        }
    }
    
    
    
    //results.data, results.meta.fields
    arr = new dY.Arr(meta,hrs)
    OnDYDataLoaded(arr);
}



dY.parser.HandleSingleFileUpload = function (evt) {
    var file = evt.target.files[0];

    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            dY.parser.handleParseResults(results);
        }
    });
}






















