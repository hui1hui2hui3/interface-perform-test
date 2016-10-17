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

function _getParentObj(allNameObj,partNames,parentName){
    var parentObj = {
        obj: null,
        childs: allNameObj
    };
    for(var i=0,n=partNames.length;i<n;i++) {
        var partName = partNames[i];
        parentObj = parentObj.childs[partName];
        if(partName == parentName) {
            break;
        }
    }
    return parentObj;
}

function parseUrlTree(data) {
    var nameObj = {};
    for (var i = 0, n = data.length; i < n; i++) {
        var tmpUrlObj = data[i];
        var statePartNames = tmpUrlObj.name.split(".");
        if (statePartNames.length < 2) {
            nameObj[tmpUrlObj.name] = {
                obj: tmpUrlObj,
                childs: {}
            }
        } else {
            var j = statePartNames.length - 1;
            var statePartName = statePartNames[j]; //printdetail
            var parentName = statePartNames[j-1]; //printinfo
            var parentObj = _getParentObj(nameObj, statePartNames,parentName)
            if(parentObj) {
                parentObj.childs[statePartName] = {
                    obj: tmpUrlObj,
                    childs: {}
                }
            } else {
                console.log('no parent',parentName)
            }
        }
    }
    return nameObj;
}

urlJsonParser.parseUrlTree = parseUrlTree;

module.exports = urlJsonParser;
