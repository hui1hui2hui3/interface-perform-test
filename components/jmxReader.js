var fs = require('fs');
var path = require('path');
var q = require('q');

var jmxPath = './jmx/';
var jmxFiles = [];

var jmxReader = function() {
    var deferred = q.defer();
    if (jmxFiles.length == 0) {
        fs.readdir(jmxPath, function(err, files) {
            if (err) {
                console.error(err);
                deferred.reject(err);
            }
            for (var i = 0, n = files.length; i < n; i++) {
                var file = files[i];
                if (file.indexOf('.jmx') > -1) {
                    jmxFiles[jmxFiles.length] = file;
                }
            }
            deferred.resolve(jmxFiles);
        });
    } else {
        deferred.resolve(jmxFiles);
    }
    return deferred.promise;
}
module.exports = jmxReader;
