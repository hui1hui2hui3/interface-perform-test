var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var multer = require('multer');
var moment = require('moment');
var jmxJsonParser = require('../components/jmxJsonParser');
var jmxReader = require('../components/jmxReader');
var storageCreater = require('../components/diskStorageCreater');
var urlJsonParser = require('../components/urlJsonParser');
var runCurl = require('../components/runCurl');
var xmlParser = require('../components/xmlParser');

var uploadJmx = storageCreater("./jmx", "jmxFile");
var uploadJmxJson = storageCreater("./json", "jmxFile");

//--------page--------
/* GET home page. */
router.get('/', function(req, res, next) {
    jmxJsonParser().then(function(data) {
        res.render('index', {
            title: "Jmx Json Lists",
            urls: data,
            uploadUrl: "jmxjson",
            uploadTitle: "Jmx Json"
        });
    }, function(error) {
        res.end('this is error:' + error);
    });
});

// show detail page.
router.get('/detail/:id', function(req, res, next) {
    var detailId = req.params.id;
    jmxJsonParser().then(function(data) {
        var reqData = data;
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
    }, function(error) {
        res.end('this is error:' + error);
    });
});

// show jmx lists page.
router.get('/jmxlists', function(req, res, next) {
    jmxReader().then(function(data) {
        res.render('jmxlists', {
            title: "Jmx Lists",
            jmxlists: data,
            uploadUrl: "jmx",
            uploadTitle: "Jmx"
        });
    }, function(error) {
        res.end('no jms error:' + error);
    });
});

// show jmx lists page.
router.get('/urllists', function(req, res, next) {
    urlJsonParser().then(function(data) {
        res.render('urllists', {
            title: "Url Lists",
            urllists: data[0],
            classifyurllists: urlJsonParser.parseUrlTree(data[0]),
            uploadUrl: "url",
            uploadTitle: "url(暂时不可用)"
        });
    }, function(error) {
        res.end('no jms error:' + error);
    });
});

router.get('/curltest', function(req, res, next) {
    var testurl = req.query.url;
    if (testurl) {
        runCurl(testurl).then(function(data) {
            var results = data.split(':');
            res.render('curltest', {
                title: "Curl Test Page",
                testUrl: testurl,
                testResults: results,
                uploadUrl: "curl",
                uploadTitle: "curl(暂时不可用)"
            });
        }, function(error) {
            res.end('error:' + error);
        })
    } else {
        res.render('curltest', {
            title: "Curl Test Page",
            testUrl: "",
            testResults: [],
            uploadUrl: "curl",
            uploadTitle: "curl(暂时不可用)"
        });
    }
});

router.get('/backend_depend', function(req, res, next) {
    var queryFile = req.query.searchFile;

    xmlParser().then(function(data) {
        xmlParser.smartParser(data);
        var dependResults = queryFile ? dependResults = xmlParser.searchFile(queryFile) : "";
        res.render('backend_depend', {
            title: "Backend Dependencies",
            dataResult: data,
            searchResult: JSON.stringify(dependResults),
            uploadUrl: "url",
            uploadTitle: "url(暂时不可用)"
        });
    }, function(error) {
        res.end('error:' + error);
    })
});

//---------ajax api--------
router.get('/runJmeter/:filename', function(req, res, next) {
    var filename = req.params.filename;
    var timestamp = moment().format("YYYY-MM-DD_h-mm-ss"),
        logfilename = filename + "_" + timestamp;
    var cmdStr = 'jmeter -n -t ./jmx/' + filename + '.jmx -l ./log/' + logfilename + '.jtl';
    exec(cmdStr, function(err, stdout, stderr) {
        if (err) {
            res.send({
                "testResult": stderr,
                "logName": logfilename
            })
        } else {
            res.send({
                "testResult": stdout,
                "logName": logfilename
            })
        }
    });
});

router.get('/download/:file', function(req, res, next) {
    var file = req.params.file,
        path = "./log/" + file + ".jtl";
    res.download(path);
});

router.post('/upload/jmx', function(req, res, next) {
    uploadJmx(req, res, function(err) {
        if (err) {
            return res.end("Error uploading jmx file.");
        }
        jmxReader.reload();
        res.redirect('/jmxlists');
    });
});

router.post('/upload/jmxjson', function(req, res, next) {
    uploadJmxJson(req, res, function(err) {
        if (err) {
            return res.end("Error uploading jmx json file.");
        }
        jmxJsonParser.reload();
        res.redirect('/');
    });
});

module.exports = router;
