# mulig
A promise thing [![npm version](https://badge.fury.io/js/mulig.svg)](https://badge.fury.io/js/mulig)

`npm install mulig --save`

## Methods
- mulig
- inOrder


## Mulig by examples

`mulig()`
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
mulig(promises,
  // called on each promise success
  // value: value of resolved promise
  // index: index of given array promise is in
  (value, index) => { 
    console.log('promise resolve in order of completion') 
  },
  // called on error
  (error) => { 
    console.log('on promise error', error) 
  })
  
Promise.all(promises)
  .then() // when all promises are done
  .catch() 

```

**inOrder**

`mulig.inOrder()`
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
mulig.inOrder(promises,
  // called on each promise success
  // value: value of resolved promise
  // index: index of given array promise is in. Unnecessary when using inOrder
  (value, index) => { 
    console.log('promise resolve in order of completion') 
  },
  // called on error
  (error) => { 
    console.log('on promise error', error) 
  })
  
Promise.all(promises)
  .then() // when all promises are done
  .catch() 

```

## TODO
- Tests