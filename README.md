# Resolve multible promises with order: fastest, queue, stack
A promise thing [![npm version](https://badge.fury.io/js/mulig.svg)](https://badge.fury.io/js/mulig)

`npm install mulig --save`

## Methods
- mulig
- queue
- stack


## Mulig by examples

`mulig()`

mulig runs callback function as soon as promises resolve. You can return values from callback functions (success or error) and they will be passed with the prev param the next time callback is invoked.

simple example
```javascript
const mulig = requre('mulig')

mulig(
  [], // array of Promises
  (
    value,  // any: value of resolved promise
    index,  // Number: index of resolved promise
    isDone, // Boolean: is last promise to resolve
    prev    // any: returned value from last time this or error function run
  ) => {}, // success function
  (error, index, isDone, prev) => {} // fail function
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
  getPromise(1, 400), 
  getPromise(2, 1600), 
  getPromise(3, 1000), 
  getPromise(4, 2200),
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
  (value, index, isDone, prev = 0) => { 
    console.log(`order of completion: &{value}`) 
    if(isDone){
      console.log(`done: &{prev}`)
    }

    return value + prev
  },
  // called on each error
  // error: error from promise
  (error) => { 
    console.log('on promise error', error) 
  }
)
  
Promise.all(promises)
  .then() // when all promises are done
  .catch() 

```

**queue**

`mulig.queue()`  

Mulig.queue resolves all promises in order of given array. Even if a promise at index 2 (in array) resolves before promise at index 0 it wont call the success or error callback before promise at index 0 and 1 resolves.

simple example  
```javascript
const mulig = requre('mulig')

mulig.queue(
  [], // array of Promises
  (
    value,  // any: value of resolved promise
    index,  // Number: index of resolved promise
    isDone, // Boolean: is last promise to resolve
    prev    // any: returned value from last time this or error function run
  ) => {}, // success function
  (error, index, isDone, prev) => {} // error function
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
  getPromise(1, 400), 
  getPromise(2, 1600), 
  getPromise(3, 1000), 
  getPromise(4, 2200),
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
  (value, index, isDone, prev = 0) => { 
    console.log(`order of promise array: &{value}`) 
    if(isDone){
      console.log(`done: &{prev}`)
    }

    return value + prev
  },
  // called on each error
  // error: error from promise
  (error) => { 
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