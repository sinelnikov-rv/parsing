const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

const rp = url => new Promise((resolve) => {
  request({
    url,
    encoding: null,
  }, (err, res, body) => {
    const $ = cheerio.load(iconv.decode(body, 'win1251'));
    resolve($);
  });
});

module.exports = rp;
