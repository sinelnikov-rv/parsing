Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}
var arr = ['1x500','1x630','1x800','1x1000','1x1200','1x1400','1x1600','1x2000','1x400','1x500','1x630','1x800','1x1000','1x1200','1x1400','1x1600','1x2000']
console.log(arr.unique());