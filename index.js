const rp = require('./request');
// let fs = require('fs');

// let file = 'test.txt';
const opt = {
  url: 'http://yuzhcable.info/',
  encoding: null,
};
// fs.writeFile(file,"");

const categories = [];
Array.prototype.unique = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

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

  for (let i = 0; i < 1/* categories.length */; i += 1) {
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
  const regexp = /\s\d*\.?\s?\d*x\d*\.?\s?\d*\+?\d*x?\d*\.?\d*\+?\d*\.?x?\d*/;
  let arr = [];
  let cablesCrossArrayUnique = [];
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
      const cablesCross = $('.UK_Tbb');
      const cablesCrossArray = [];
      for (let k = 0; k < cablesCross.length; k += 1) {
        const testCross = cablesCross[k].children[0].data;
        let test = testCross.match(regexp);
        test = test[0].replace(/\s/g, '');
        cablesCrossArray.push(test);
        
      }
      cablesCrossArray.sort();
      cablesCrossArrayUnique = cablesCrossArray.unique();
      arr[j].cross = cablesCrossArrayUnique.join();
      for (let i = 0; i < cablesVolteage.length; i += 1) {
        cablesVolteageArray.push(cablesVolteage[i].children[0].data);
        arr[j].voltage = cablesVolteageArray.join();
      }
      
      return arr[j];
    }));
  }
  return Promise.all(promises);
})
  .then((value) => {
    console.log(value);
  });
