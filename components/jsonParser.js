var q = require('q');
var fs = require('fs');
var path = require('path');

//获取目录下面所有文件，并解析为json格式的数组
var jsonParser = function(basePath) {
    var deferred = q.defer();
    var resultData = [];
    try {
        fs.readdir(basePath, function(err, files) {
            if (err) {
                console.error(err);
                deferred.reject(err);
            }
            if (files.length < 1) {
                deferred.resolve(resultData);
            }
            for (var i = 0, n = files.length; i < n; i++) {
                var file = files[i];
                var fileExtIndex = file.indexOf(".json");
                if (fileExtIndex > -1) {
                    fs.readFile(path.join(basePath, file), function(err, data) {
                        if (err) {
                            console.error(err);
                            deferred.reject(err);
                        }
                        try {
                            var jsonData = JSON.parse(data);
                            resultData[resultData.length] = jsonData;
                            if (i >= n - 1) {
                                deferred.resolve(resultData);
                            }
                        } catch (e) {
                            console.log(e);
                            deferred.reject(e);
                        }
                    })
                } 
            }
        });
    } catch (e) {
        deferred.reject(e)
    }
    return deferred.promise;
}
module.exports = jsonParser;
