var q = require('q');
var jsonParser = require('./jsonParser');

var jsonDataPath = "./json/"
var jsonFileData = []

var jmxJsonParser = function() {
    if (jsonFileData.length == 0) {
        return jsonParser(jsonDataPath).then(function(data) {
            jsonFileData = data;
            return jsonFileData;
        });
    } else {
        return q(jsonFileData);
    }
}
jmxJsonParser.reload = function() {
    jsonFileData = []
}
module.exports = jmxJsonParser;
