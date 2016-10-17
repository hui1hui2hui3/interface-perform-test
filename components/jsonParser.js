var q = require('q');
var fs = require('fs');
var readFiles = require('./readFiles');

//获取目录下面所有文件，并解析为json格式的数组
var jsonParser = function(basePath) {
    return readFiles(basePath, ".json", function(data) {
        return JSON.parse(data);
    });
}
module.exports = jsonParser;
