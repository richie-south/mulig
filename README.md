# mulig
A promise thing [![npm version](https://badge.fury.io/js/mulig.svg)](https://badge.fury.io/js/mulig)````

`npm install mulig --save`


```javascript
const files = ['a.txt', 'b.txt', 'c.txt']

const promises = files.map(file =>
  fs.readFile(file, {encoding: 'utf-8'})
   
/**
 * resolves promises in order of completion
 * returns all promises 
 * @param  {Array} [array of promise]
 * @param  {Function} [resolve function, this runs when a promise resolves]
 * @param  {Function} [error function, this runs when a promise throws an error]
 * @return {Array} [returns given array]
 */
mulig(promises),
  (value, i) => { console.log('promise resolve in order of completion') },
  (error) => { console.log('on promise error') })
  
Promise.all(promises)
  .then() // when all promises are done
  .catch() 

```
