var fs = require('fs');
var path = require('path');
var q = require('q');

var jsonDataPath = "./json/"
var jsonFileData = []

var jmxJsonParser = function() {
    var deferred = q.defer();
    if (jsonFileData.length == 0) {
        try {
            fs.readdir(jsonDataPath, function(err, files) {
                if (err) {
                    console.error(err);
                    deferred.reject(err);
                }
                for (var i = 0, n = files.length; i < n; i++) {
                    var file = files[i];
                    fs.readFile(path.join(jsonDataPath, file), function(err, data) {
                        if (err) {
                            console.error(err);
                            deferred.reject(err);
                        }
                        try {
                            var jsonData = JSON.parse(data);
                            jsonFileData[jsonFileData.length] = jsonData;
                            if (i == n - 1) {
                                deferred.resolve(jsonFileData);
                            }
                        } catch (e) {
                            deferred.reject(e);
                        }
                    })
                }
            });
        } catch (e) {
            deferred.reject(e)
        }
    } else {
        deferred.resolve(jsonFileData)
    }
    return deferred.promise;
}
jmxJsonParser.reload = function(){
    jsonFileData = []
}

// var jmxJsonParser = function(req, res, next) {
//     if (jsonFileData.length == 0) {
//         fs.readdir(jsonDataPath, function(err, files) {
//             if (err) {
//                 return console.error(err);
//             }
//             for (var i = 0, n = files.length; i < n; i++) {
//                 var file = files[i];
//                 fs.readFile(path.join(jsonDataPath, file), function(err, data) {
//                     if (err) {
//                         throw err;
//                     }
//                     var jsonData = JSON.parse(data);
//                     jsonFileData[jsonFileData.length] = jsonData;
//                     if (i == n - 1) {
//                         req.jsonFileData = jsonFileData;
//                         next();
//                     }
//                 })
//             }
//         });
//     } else {
//         req.jsonFileData = jsonFileData;
//         next();
//     }
// }

module.exports = jmxJsonParser;
