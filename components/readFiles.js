var q = require('q');
var fs = require('fs');
var path = require('path');

/**
 * 读取文件内容
 * @param  {[type]} basePath  读取文件的基本路径
 * @param  {[type]} ext       读取文件的扩展名，默认全部
 * @param  {[type]} parseData 解析数据处理回调，读取文件后如何处理文件数据，默认不变
 * @return [fileData,fileData]           返回文件内容的数组
 */
function readFiles(basePath, ext, parseData) {
    var deferred = q.defer();
    try {
        fs.readdir(basePath, function(err, files) {
            if (err) {
                deferred.reject(err);
            }
            if (files.length < 1) {
                deferred.resolve([]);
            }
            __read_files(basePath, files, ext, parseData).then(function(data) {
                deferred.resolve(data);
            }, function(error) {
                deferred.reject(data);
            })
        });
    } catch (e) {
        deferred.reject(e);
    }
    return deferred.promise;
}

function __read_files(basePath, files, ext, parseData) {
    var promises = [],
        files = files || [],
        ext = ext || "",
        parseData = parseData || function(data) {
            return data;
        };
    for (var i = 0, n = files.length; i < n; i++) {
        var file = files[i];
        if (file.indexOf(ext) > -1) {
            promises.push(q.Promise(function(resolve, reject, notify) {
                fs.readFile(path.join(basePath, file), function(err, data) {
                    if (err) {
                        reject(err);
                    }
                    try {
                        resolve(parseData(data));
                    } catch (e) {
                        reject(e);
                    }
                })
            }));
        }
    }
    return q.all(promises);
}

module.exports = readFiles;
