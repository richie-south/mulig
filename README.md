# Resolve multible promises with some order: fastest, queue, stack
A promise thing [![npm version](https://badge.fury.io/js/mulig.svg)](https://badge.fury.io/js/mulig)

`npm install mulig --save`

## Methods
- mulig
- queue
- stack


## Mulig by examples

`mulig()`

simple example
```javascript
const mulig = requre('mulig')

mulig(
  /*Promise array*/, 
  (value, index) => {}, // success function
  (error, index) => {} // fail function
)
```
complex example
```javascript

const mulig = requre('mulig')

// Only for explaining purpose
// takes value and resolves that value of given time
const getPromise = (value, time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, time)
  })

// Array of promises
const promises = [
  getPromise('1', 400), 
  getPromise('2', 1600), 
  getPromise('3', 1000), 
  getPromise('4', 2200),
]

/**
 * resolves promises in order of completion
 * returns given promises 
 * @param  {Array}    [array of promise]
 * @param  {Function} [resolve function, this runs when a promise resolves]
 * @param  {Function} [error function, this runs when a promise throws an error]
 * @return {Array}    [returns given array]
 */
mulig(
  // array of promises
  promises,
  // called on each promise success
  // value: value of resolved promise
  // index: index of given array promise is in
  (value, index) => { 
    console.log('promise resolve in order of completion', value) 
  },
  // called on each error
  // error: -
  // index: index of promise in array
  (error, index) => { 
    console.log('on promise error', error) 
  }
)
  
Promise.all(promises)
  .then() // when all promises are done
  .catch() 

```

**queue**

`mulig.queue()`

simple example
```javascript
const mulig = requre('mulig')

mulig.queue(
  /*Promise array*/
  (value, index) => {}, // success function
  (error) => {} // error function
)
```

complex example
```javascript

const mulig = requre('mulig')

// Only for explaining purpose
// takes value and resolves that value of given time
const getPromise = (value, time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, time)
  })

// Array of promises
const promises = [
  getPromise('1', 400), 
  getPromise('2', 1600), 
  getPromise('3', 1000), 
  getPromise('4', 2200),
]

/**
 * resolves promises in order of given array
 * returns given promises 
 * @param  {Array}    [array of promise]
 * @param  {Function} [resolve function, this runs when a promise resolves]
 * @param  {Function} [error function, this runs when a promise throws an error]
 * @return {Array}    [returns given array]
 */
mulig.queue(
  // array of promises
  promises,
  // called on each promise success
  // value: value of resolved promise
  // index: index of given array promise is in. Unnecessary when using queue
  (value, index) => { 
    console.log('promise resolve in order of promise array', value) 
  },
  // called on each error
  // error: -
  // index: index of promise in array
  (error, index) => { 
    console.log('on promise error', error) 
  }
)
  
Promise.all(promises)
  .then() // when all promises are done
  .catch() 

```

**stack**  
same as mulig.queue() but resolve in order of reversed promise array

`mulig.stack()`

example
```javascript
const mulig = requre('mulig')

mulig.stack(
  /*Promise array*/
  (value, index) => {}, // success function
  (error, index) => {} // error function
)
```