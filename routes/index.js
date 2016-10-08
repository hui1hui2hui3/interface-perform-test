var express = require('express');
var jmxJsonParser = require('../components/jmxJsonParser')
var router = express.Router();
var exec = require('child_process').exec;
var multer = require('multer');
var jmxReader = require('../components/jmxReader')

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './jmx');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
}).single('jmxFile');

router.use('/', jmxJsonParser)

/* GET home page. */
router.get('/', function(req, res, next) {
    // jmxReader().then(function(data) {
    //     console.log(data)
    // }, function(error) {
    //     console.log(error)
    // })
    res.render('index', {
        title: "Performance Interfaces",
        urls: req.jsonFileData
    });
});

router.get('/detail/:id', function(req, res, next) {
    var detailId = req.params.id;
    var reqData = req.jsonFileData;
    var detailData = [];
    for (var i = 0, n = reqData.length; i < n; i++) {
        urlData = reqData[i]
        if (urlData.name == detailId) {
            detailData = urlData.traffic
            break;
        }
    }
    res.render('detail', {
        title: "Detail List: " + detailId,
        details: detailData
    });
});

router.get('/runJmeter/:filename', function(req, res, next) {
    var filename = req.params.filename;
    var cmdStr = 'jmeter -n -t ./jmx/' + filename + '.jmx -l ./jmx/' + filename + '.jtl';
    exec(cmdStr, function(err, stdout, stderr) {
        if (err) {
            res.send("test error:" + stderr)
        } else {
            res.send("test result:" + stdout)
        }
    });
});

router.get('/download/:file', function(req, res, next) {
    var file = req.params.file,
        path = "./jmx/" + file + ".jtl";
    res.download(path);
});

router.post('/upload', function(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.redirect('/')
    });
});

module.exports = router;
