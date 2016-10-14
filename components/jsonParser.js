var q = require('q');
var fs = require('fs');
var path = require('path');

function readFiles(basePath, files) {
    var promises = [];
    for (var i = 0, n = files.length; i < n; i++) {
        var file = files[i];
        if (file.indexOf(".json") > -1) { //必须是.json的扩展文件
            promises.push(q.Promise(function(resolve, reject, notify) {
                fs.readFile(path.join(basePath, file), function(err, data) {
                    if (err) {
                        reject(err);
                    }
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(e);
                    }
                })
            }));
        }
    }
    return q.all(promises);
}

//获取目录下面所有文件，并解析为json格式的数组
var jsonParser = function(basePath) {
    var deferred = q.defer();
    try {
        fs.readdir(basePath, function(err, files) {
            if (err) {
                deferred.reject(err);
            }
            if (files.length < 1) {
                deferred.resolve([]);
            }
            readFiles(basePath, files).then(function(data) {
                deferred.resolve(data)
            }, function(error) {
                deferred.reject(data)
            })
        });
    } catch (e) {
        deferred.reject(e)
    }
    return deferred.promise;
}
module.exports = jsonParser;
