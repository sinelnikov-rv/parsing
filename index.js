var request = require('request');
var iconv = require('iconv-lite')
var cheerio = require('cheerio');
var fs = require('fs');
var file = 'tet.txt';
var opt = {
    url: 'http://yuzhcable.info/',
    encoding: null
}
fs.writeFile(file,"");

var categories =[];
var cables =[];
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
})
}).then(value =>{
    for(var i=0; i<categories.length;i++){
        let j=i;
        var newOpt = {
             url: opt.url + categories[i].link,
             encoding: null
         }
         request(newOpt,function(err,res,body){
             var $ = cheerio.load(iconv.decode(body,'win1251'));
             var cablesTitle = $('.UK_Tblb');
             var cablesDescription = $('.UK_Tbll');
             for(var i = 0; i<cablesTitle.length;i++){
                 fs.appendFile(file, "\"" + cablesTitle[i].children[0].children[0].data + "\",\"" + categories[j].title + "\",\"" + cablesDescription[i].children[0].data +"\"\n");
            cables.push({
                title: cablesTitle[i].children[0].children[0].data,
                categorie: categories[j].title,
                description: cablesDescription[i].children[0].data,
             })
            }
         })
    }
})

console.log(cables)
