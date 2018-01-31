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
return new Promise(resolve => {request(opt, function(err,res,body){
    resolve(body);
    var $ = cheerio.load(iconv.decode(body,'win1251'));
    
    var categoriesTitle = $('.UK_Menu4b');
    for(var i=0; i<categoriesTitle.length;i++){
        categories.push({
            title: categoriesTitle[i].attribs.title,
            link: categoriesTitle[i].children[0].attribs.href
        })
    }
    /* for(var i=0;i<categories.length;i++){
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
    })
    }
*/
})
}).then(value =>{console.log(categories)})