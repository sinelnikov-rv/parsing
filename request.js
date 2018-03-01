const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

const rp = url => new Promise((resolve) => {
  //  console.log(url);
  request({
    url,
    encoding: null,
  }, (err, res, body) => {
    if (res.statusCode >= 200 || res.statusCode < 300) {
      const $ = cheerio.load(iconv.decode(body, 'win1251'));
      resolve($);
    }
  });
});

module.exports = rp;
