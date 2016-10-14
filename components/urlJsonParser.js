var jsonParser = require('./jsonParser');
var q = require('q');

var urlJsonPath = './urljson/';
var urlListsData = [];

var urlJsonParser = function(){
    var deferred = q.defer();
    if(urlListsData.length > 0) {
        deferred.resolve(urlListsData);
    } else {
        jsonParser(urlJsonPath).then(function(data){
            urlListsData = data;
            deferred.resolve(urlListsData);
        },function(err){
            deferred.reject(err);
        })
    }
    return deferred.promise;
};

module.exports = urlJsonParser;
