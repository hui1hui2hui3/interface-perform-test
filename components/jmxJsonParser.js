//路由中间件

var fs = require('fs');
var path = require('path');

var jsonDataPath = "./json/"
var jsonFileData = []

var jmxJsonParser = function(req, res, next) {
    if (jsonFileData.length == 0) {
        fs.readdir(jsonDataPath, function(err, files) {
            if (err) {
                return console.error(err);
            }
            for (var i = 0, n = files.length; i < n; i++) {
                var file = files[i];
                fs.readFile(path.join(jsonDataPath, file), function(err, data) {
                    if (err) {
                        throw err;
                    }
                    var jsonData = JSON.parse(data);
                    jsonFileData[jsonFileData.length] = jsonData;
                    if (i == n - 1) {
                        req.jsonFileData = jsonFileData;
                        next();
                    }
                })
            }
        });
    } else {
        req.jsonFileData = jsonFileData;
        next();
    }
}

module.exports = jmxJsonParser;
