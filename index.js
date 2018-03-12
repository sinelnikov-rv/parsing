const rp = require('./request');
const fs = require('fs');
const file = require('./file');

const opt = {
  url: 'http://yuzhcable.info/',
  encoding: null,
};
const categories = [];
const art = 100000;
Array.prototype.unique = function () {
  return this.filter((value, index, self) => self.indexOf(value) === index);
};

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
      for (let k = 0; k < cablesTitle.length; k += 1) {
        cables.push({
          title: cablesTitle[k].children[0].children[0].data,
          art: art + ((i + 1) * 1000) + k,
          categorie: categories[j].title,
          description: cablesDescription[k].children[0].data,
          link: cablesTitle[k].children[0].attribs.href,
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
  const items = [];
  cables.forEach((arr1) => { arr = arr.concat(arr1); });
  const action = item =>
    new Promise((resolve) => {
      const newOpt = {
        url: opt.url + item.link,
        encoding: null,
      };
      rp(newOpt.url).then(($) => {
        const table = $('.UK_Table tr');
        const cablesVolteageArray = [];
        const cablesCrossArray = [];
        const variations = [];
        let voltage = '';
        for (let j = 2; j < table.length; j += 1) {
          if (table[j].children[0].children[0].data) {
            voltage = table[j].children[0].children[0].data;
            cablesVolteageArray.push(voltage);
          } else {
            let cross = table[j].children[0].children[0].children[1].children[0].data.match(regexp);
            if (cross !== null) {
              cross = cross[0].replace(/\s/g, '');
              cablesCrossArray.push(cross);
              if (voltage) {
                variations.push({
                  cross,
                  voltage,
                });
              } else {
                variations.push({
                  cross,
                });
              }
            }
          }
        }
        cablesCrossArrayUnique = cablesCrossArray.unique();
        item.cross = cablesCrossArrayUnique.join();
        item.voltage = cablesVolteageArray.join();
        item.variations = variations;
        //for (let i = 0; i < cablesVolteage.length; i += 1) {
        //  const voltageWOKV = cablesVolteage[i].children[0].data.replace(/\sкВ/, '');
          // for (let k = 0; k < cablesCross.length; k += 1) {
            // const testCross = cablesCross[k].children[0].data;
            // let test = testCross.match(regexp);
            
            // test = test[0].replace(/\s/g, '');
            // console.log(test);
            // cablesCrossArray.push(test);
            // if (testCross.includes(`-${voltageWOKV}`)) {
              // variations.push({
                // voltage: cablesVolteage[i].children[0].data,
                // cross: test,
              // });
            // }
          // }
          // cablesCrossArrayUnique = cablesCrossArray.unique();
          // item.cross = cablesCrossArrayUnique.join();
          //cablesVolteageArray.push(cablesVolteage[i].children[0].data);
          // item.voltage = cablesVolteageArray.join();
          // item.variations = variations;
        // }
        resolve(item);
      });
      items.push(item);
    });
  let p = Promise.resolve();
  arr.forEach(item => p = p.then(() => action(item)));
  return p.then(() => items);
})
  .then((value) => {
    value.forEach((t) => {
      if (t.hasOwnProperty('variations') && t.variations.length) {
        if (t.voltage.length) {
          fs.appendFileSync(file, ",variable," + t.art + ",\"" + t.title + "\",1,0,visible,,\"" + t.description + "\",,,taxable,,1,,0,0,,,,,1,,,,\"" + t.categorie + "\",,,,,,,,,,,,0,\"Напряжение\",\"" + t.voltage + "\",1,1,\"Сечение\",\"" + t.cross + "\",1,1\n")
        } else {
          fs.appendFileSync(file, ",variable," + t.art + ",\"" + t.title + "\",1,0,visible,,\"" + t.description + "\",,,taxable,,1,,0,0,,,,,1,,,,\"" + t.categorie + "\",,,,,,,,,,,,0,\"Сечение\",\"" + t.cross + "\",1,1,,,,\n");
        }
        t.variations.forEach((e) => {
          if (e.voltage) {
            fs.appendFileSync(file, ",variation,,\"" + t.title + "\",1,0,visible,,,,,taxable,parent,1,,0,0,,,,,1,,,,,,,,,,"+t.art+",,,,,,0,\"Напряжение\",\"" + e.voltage + "\",1,1,\"Сечение\",\"" + e.cross + "\",1,1\n")
          } else {
            fs.appendFileSync(file, ",variation,,\"" + t.title + "\",1,0,visible,,,,,taxable,parent,1,,0,0,,,,,1,,,,,,,,,,"+t.art+",,,,,,0,\"Сечение\",\"" + e.cross + "\",1,1,,,,\n")
          }
        });
      } else {
        fs.appendFileSync(file, ",variable," + t.art + ",\"" + t.title + "\",1,0,visible,,\"" + t.description + "\",,,taxable,,1,,0,0,,,,,1,,,,\"" + t.categorie + "\",,,,,,,,,,,,0,,,,,,,,\n")
      }
    });
  });
