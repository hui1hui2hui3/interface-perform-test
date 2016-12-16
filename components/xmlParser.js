var fs = require('fs'),
    xml2js = require('xml2js'),
    q = require('q');

var parser = new xml2js.Parser();
var depend_data = "";
var xmlParser = function() {
    var deferred = q.defer();
    if (depend_data) {
        deferred.resolve(depend_data);
    } else {
        fs.readFile(__dirname + '/../depend_data/depend.xml', function(err, data) {
            if (err) {
                deferred.reject(err);
            }
            parser.parseString(data, function(err, result) {
                if (err) {
                    deferred.reject(err);
                }
                depend_data = result;
                deferred.resolve(depend_data);
            });
        });
    }
    return deferred.promise;
}

// Demo Apart
// {
//     "root": {
//         "$": {},
//         "file": [{
//                     "$": {
//                         "path": "src/main/java/com/kyee/edu/admin/rlsNote/controller/ReleaseNoteController.java"
//                     },
//                     "dependency": []
//                 }, {
//                     "$": {
//                         "path": "src/main/java/com/kyee/edu/admin/rlsNote/domain/ReleaseNote.java"
//                     }
//                 }, {
//                     "$": {
//                         "path": "src/main/java/com/kyee/edu/admin/rlsNote/domain/service/IReleaseNoteDomainService.java"
//                     },
//                     "dependency": [{
//                         "$": {
//                             "path": "src/main/java/com/kyee/edu/admin/rlsNote/domain/ReleaseNote.java"
//                         }
//                     }]
//                 },
xmlParser.smartParser = function(jsonData) {
    try {
        if (jsonData.root) {
            var files = jsonData.root.file;
            var self = this;
            for (var i in files) {
                var file = files[i];
                self.resetFile(file);
                self.resetFiles(file.dependency);
                var name = file.name;
                delete file.name;
                jsonData[name] = file;
            }
            // jsonData.files = files;
            delete jsonData.root;
            delete jsonData.files;
        }
    } catch (e) {
        console.log(e);
    }
}

// {
//     "ReleaseNoteController.java": {},
//     "ReleaseNote.java": {},
//     "IReleaseNoteDomainService.java": {
//         "dependency": [{
//             "path": "src/main/java/com/kyee/edu/admin/rlsNote/domain/ReleaseNote.java",
//             "name": "ReleaseNote.java"
//         }],
//         "path": "src/main/java/com/kyee/edu/admin/rlsNote/domain/service/IReleaseNoteDomainService.java"
//     },
xmlParser.searchFile = function(fileName) {
    if (depend_data) {
        var fileJson = depend_data[fileName];
        var depend_files = [];
        if (this.checkIsHaveDepend(fileJson)) {
            this.getDependFile(fileJson, depend_files);
        }
        return depend_files;
    } else {
        return [];
    }
}

xmlParser.getDependFile = function(fileJson, depend_files) {
    var dependency = fileJson.dependency;
    for (var i in dependency) {
        var depend_file = dependency[i];
        depend_files[depend_files.length] = depend_file.name;
        var depend_real_file = depend_data[depend_file.name];
        if (this.checkIsHaveDepend(depend_real_file)) {
            this.getDependFile(depend_real_file, depend_files);
        }
    }
}
xmlParser.checkIsHaveDepend = function(fileJson) {
    return fileJson && fileJson.dependency && fileJson.dependency.length > 0;
}
xmlParser.resetFile = function(fileJson) {
    fileJson.path = fileJson.$.path;
    fileJson.name = this.getFileName(fileJson.path);
    delete fileJson.$;
}
xmlParser.resetFiles = function(fileJsons) {
    var self = this;
    for (var i in fileJsons) {
        self.resetFile(fileJsons[i]);
    }
}
xmlParser.getFileName = function(pathName) {
    var paths = pathName.split('/');
    return paths[paths.length - 1];
}

module.exports = xmlParser;
