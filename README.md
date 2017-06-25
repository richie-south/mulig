
# Mulig

[![npm version](https://badge.fury.io/js/mulig.svg)](https://badge.fury.io/js/mulig)    

Resolves multible promises with order (sequence): fastest, queue or stack.

# Installation

```
npm install mulig --save
```

# Usage

## Summary

* [mulig](#mulig)
* [queue](#queue)
* [stack](#stack)


## mulig

`mulig()`  

mulig runs callback function as soon as promises resolve. You can return values from callback functions (success or error) and they will be passed with the prev param the next time callback is invoked.

**simple example**
```javascript
const mulig = requre('mulig')

/**
 * resolves promises in order of completion
 * @param  {Array}    [array of promise]
 * @param  {Function} [resolve function: runs every time a promise resolves]
 * @param  {Function} [error function: runs every time a promise throws an error]
 * @return {Array}    [returns given array]
 */
mulig(
  [],  /* array of Promises */
  (
    value,  /* any: value of resolved promise */
    index,  /* Number: index of resolved promise */
    isDone, /* Boolean: is last promise to resolve */
    prev    /* any: returned value from last time this or error function run */
  ) => {},  /* success function */
  (
    error,  /* Error message */
    index, 
    isDone, 
    prev
    ) => {} /* fail function: called on each error (optional to ignore errors)*/
)
```

**complex example**
```javascript

const mulig = requre('mulig')

// Only for explaining purpose
// takes value and resolves that value in a given time
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


mulig(
  promises,
  (value, index, isDone, prev = 0) => { 
    console.log(`order of completion: &{value}`) 
    
    if(isDone){
      console.log(`done: &{value + prev}`) // >>> 'done: 10'
    }

    return value + prev
  },
  (error) => { 
    console.log('on promise error', error) 
  }
)
```


## queue

`mulig.queue()`  

mulig.queue resolves all promises in order (sequence) of given array.
If a promise at index 2 (in array) resolves before promise at index 0 it wont call the success or error callback before promise at index 0 and 1 resolves.

**simple example**
```javascript
const mulig = requre('mulig')

/**
 * resolves promises in order of given array
 * returns given promises 
 * @param  {Array}    [array of promise]
 * @param  {Function} [resolve function, this runs when a promise resolves]
 * @param  {Function} [error function, this runs when a promise throws an error]
 * @return {Array}    [returns given array]
 */
mulig.queue(
  [], /* array of Promises */
  (
    value,  /* any: value of resolved promise */
    index,  /* Number: index of resolved promise */
    isDone, /* Boolean: is last promise to resolve */
    prev    /* any: returned value from last time this or error function run */
  ) => {},  /* success function */
  (
    error,  /* Error message */
    index, 
    isDone, 
    prev
    ) => {} /* fail function: called on each error (optional to ignore errors)*/
)
```

**complex example**
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

mulig.queue(
  promises,
  (value, index, isDone, prev = 0) => { 
    console.log(`order of promise array: &{value}`) 
    if(isDone){
      console.log(`done: &{prev}`) // >>> 'done: 10'
    }

    return value + prev
  },
  (error) => { 
    console.log('on promise error', error) 
  }
)
```

## stack

`mulig.stack()`

same as mulig.queue() but resolve in order of reversed promise array

**simple example**
```javascript
const mulig = requre('mulig')

mulig.stack(
  [], /* array of Promises */
  (
    value,  /* any: value of resolved promise */
    index,  /* Number: index of resolved promise */
    isDone, /* Boolean: is last promise to resolve */
    prev    /* any: returned value from last time this or error function run */
  ) => {},  /* success function */
  (
    error,  /* Error message */
    index, 
    isDone, 
    prev
    ) => {} /* fail function: called on each error (optional to ignore errors)*/
)
```