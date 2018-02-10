const rp = require('./request');
// let fs = require('fs');

// let file = 'test.txt';
const opt = {
  url: 'http://yuzhcable.info/',
  encoding: null,
};
// fs.writeFile(file,"");

const categories = [];

rp(opt.url).then(($) => {
  const categoriesTitle = $('.UK_Menu4b');
  for (let i = 0; i < categoriesTitle.length; i += 1) {
    categories.push({
      title: categoriesTitle[i].attribs.title,
      link: categoriesTitle[i].children[0].attribs.href,
    });
  }
}).then(() => {
  const promises = [];

  for (let i = 0; i < categories.length; i += 1) {
    const j = i;
    const newOpt = {
      url: opt.url + categories[i].link,
      encoding: null,
    };
    promises.push(rp(newOpt.url).then(($) => {
      const cablesTitle = $('.UK_Tblb');
      const cablesDescription = $('.UK_Tbll');
      const cables = [];
      for (let i = 0; i < cablesTitle.length; i += 1) {
        // console.log(cablesTitle[i].children[0].attribs.href)
        // fs.appendFile(file, "\"" + cablesTitle[i].children[0].children[0].data + "\",\"" + categories[j].title + "\",\"" + cablesDescription[i].children[0].data +"\"\n");
        cables.push({
          title: cablesTitle[i].children[0].children[0].data,
          categorie: categories[j].title,
          description: cablesDescription[i].children[0].data,
          link: cablesTitle[i].children[0].attribs.href,
        });
      }
      return cables;
    }));
  }
  return Promise.all(promises);
}).then((cables) => {
  let arr = [];
  cables.forEach((arr1) => { arr = arr.concat(arr1); });
  const promises = [];
  for (let i = 0; i < arr.length; i += 1) {
    const j = i;
    const newOpt = {
      url: opt.url + arr[i].link,
      encoding: null,
    };
    promises.push(rp(newOpt.url).then(($) => {
      const cablesVolteage = $('.UK_Tblb');
      const cablesVolteageArray = [];
      for (let i = 0; i < cablesVolteage.length; i += 1) {
        cablesVolteageArray.push(cablesVolteage[i].children[0].data);
      }
      arr[j].voltage = cablesVolteageArray.join();
      return arr[j];
    }));
  }
  return Promise.all(promises);
}).then((value) => {
  console.log(value.length);
});