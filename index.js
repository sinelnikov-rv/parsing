var request = require('request');
var iconv = require('iconv-lite')
var cheerio = require('cheerio');
var opt = {
    url: 'http://yuzhcable.info/index.php',
    encoding: null
}
request(opt, function(err,res,body){
    var $ = cheerio.load(iconv.decode(body,'win1251'));
    var categories = $('.UK_Menu4b >a');
    console.log(categories[0].attribs.href);
    //for(i=0;i<categories.length;i++){
    //    console.log(categories[i].attribs.title);
    //}
});