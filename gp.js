// const request = (num) => Promise.resolve(console.log(num));
const request = (num) => new Promise(
  resolve => setTimeout(
    () => resolve(console.log(num)), Math.random() * 2000
  )
);

const args = [1,2,3,4,5,6,7,8];

let gp = Promise.resolve();

args.forEach((number, index) => gp = gp.then(() => request(number)));

/**
 * gp = gp.then(() => Promise)
 * gp.then(() => Promise) = gp.then(() => Promise).then(() => Promise)
 * gp.then(() => Promise).then(() => Promise) = gp.then(() => Promise).then(() => Promise).then(() => Promise)
 */

gp.then(() => console.log('end'));
