var request = require('request');
var URL = 'http://yuzhcable.info/index.php';
request(URL, function(err,res,body){
    var reg = /CAT=[0-9]+.*\/a/
    //var test_index = body.indexOf("CAT");
    var er = body.match(reg);
    var test = reg.test(body);
    console.log(test);
    console.log(er);
    //return body;    
});