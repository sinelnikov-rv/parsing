var request = require('request');
var iconv = require('iconv-lite')
var cheerio = require('cheerio');
var fs = require('fs');
var file = 'test.txt';
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
}).then(value =>{return new Promise(resolve =>{ 
    async function loop() {for(var i=0; i<categories.length;i++){
        let j=i;
        var newOpt = {
             url: opt.url + categories[i].link,
             encoding: null
         }
          request(newOpt,function(err,res,body){
            resolve(body);
             var $ = cheerio.load(iconv.decode(body,'win1251'));
             var cablesTitle = $('.UK_Tblb');
             var cablesDescription = $('.UK_Tbll');
             for(var i = 0; i<cablesTitle.length;i++){
                 //console.log(cablesTitle[i].children[0].attribs.href)
                  //fs.appendFile(file, "\"" + cablesTitle[i].children[0].children[0].data + "\",\"" + categories[j].title + "\",\"" + cablesDescription[i].children[0].data +"\"\n");
            cables.push({
                title: cablesTitle[i].children[0].children[0].data,
                categorie: categories[j].title,
                description: cablesDescription[i].children[0].data,
                link: cablesTitle[i].children[0].attribs.href
             })
             
            }
            //console.log(cables.length)
         })
         
    }
}
})
})().then(value => { return new Promise(resolve => {
    console.log(cables.length)
    for(var i=0; i<cables.length;i++){
        let j=i;
        var newOpt = {
             url: opt.url + cables[i].link,
             encoding: null
         }
         //console.log(newOpt.url)
         request(newOpt, function(err,res,body){
            var $ = cheerio.load(iconv.decode(body,'win1251'));
            var cablesVoltage = $('.UK_Tblb');
            //console.log(cablesVoltage[0].children[0].data)
            //for(var i =0; i<cablesVoltage; i++){
           //     console.log($);
            //}
         })

        }
})
})