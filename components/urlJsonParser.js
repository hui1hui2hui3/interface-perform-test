var jsonParser = require('./jsonParser');
var q = require('q');

var urlJsonPath = './urljson/';
var urlListsData = [];

var urlJsonParser = function() {
    if (urlListsData.length > 0) {
        return q(urlListsData);
    } else {
        return jsonParser(urlJsonPath).then(function(data) {
            urlListsData = data;
            return urlListsData;
        });
    }
};

module.exports = urlJsonParser;
