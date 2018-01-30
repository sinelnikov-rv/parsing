var request = require('request');
var iconv = require('iconv-lite')
var cheerio = require('cheerio');
var file = 'tet.txt';
var opt = {
    url: 'http://yuzhcable.info/',
    encoding: null
}

var categories =[];
var array =[];

request(opt, function(err,res,body){
    var $ = cheerio.load(iconv.decode(body,'win1251'));
    var categories = $('.UK_Menu4b');
    //console.log(categories[0]);
    for(var i=0;i<categories.length;i++){
        const j = i;
        var newOpt = {
            url: opt.url + categories[i].attribs.href,
            encoding: null
        }
        request(newOpt,function(err,res,body){
            var $ = cheerio.load(iconv.decode(body,'win1251'));
            var cable = $('.UK_Tblb > a');
            array.push({
                name: cable[0].children[0].data,
                categorie: categories[j].children[0].data
            })
            console.log(array[0]);
            //console.log(cable[0].children[0].data + ', ' + categories[j].children[0].data);
        })
        
    }
    
    //console.log(categories[0].attribs.href);
    //for(i=0;i<categories.length;i++){
    //    console.log(categories[i].attribs.title);
    //}
});