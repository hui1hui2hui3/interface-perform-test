var q = require('q');

var runCurl = function(url) {
    var defer = q.defer();
    var exec = require('child_process').exec;
    var cmdStr = 'curl '
    var endStr = ' -o /dev/null -s -w %{time_appconnect}:%{time_connect}:%{time_namelookup}:%{time_pretransfer}:%{time_redirect}:%{time_starttransfer}:%{time_total}:%{size_download}:%{speed_download}';
    exec(cmdStr+url+endStr, function(err, stdout, stderr) {
        if (err) {
            defer.reject(stderr);
        } else {
            defer.resolve(stdout);
        }
    });
    return defer.promise;
}

module.exports = runCurl;
