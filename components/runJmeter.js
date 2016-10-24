var exec = require('child_process').exec;
var cmdStr = 'jmeter -n -t ./jmx/rls_login.jmx -l ./jmx/rls_login.jtl';
exec(cmdStr, function(err,stdout,stderr){
    if(err) {
        console.log('get weather api error:'+stderr);
    } else {
        console.log(stdout);
    }
});
