var multer = require('multer');

var createDiskStorage = function(folder, fieldName) {
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, folder);
        },
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });
    var upload = multer({
        storage: storage
    }).single(fieldName);
    return upload;
}
module.exports = createDiskStorage;
