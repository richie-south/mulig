'use strict'

const chai = require('chai')
const expect = require('chai').expect
const checkChai = require('check-chai')
chai.use(checkChai)
const check = chai.check

const mulig = require('./app')

/**
 * Makes promises for tests
 */
const getPromise = (value, time, doFail = false) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if(doFail){
        return reject(new Error('failing'))
      }
      return resolve(value)
    }, time)
    
  })

describe('mulig: mulig', () => {

  it('result function is called 4 times', (done) => {
    let result = 0
    const promises = [
      getPromise(1, 5), 
      getPromise(1, 20), 
      getPromise(1, 10), 
      getPromise(1, 30),
    ]

    mulig(promises, 
      (value) => {
        result += value

        if(result === 4){
          check(done, () => 
            expect(result).to.equal(4))
        }
      },
      () => {}
    )
  })

  it('error function is called once', (done) => {
    const promises = [
      getPromise(1, 10), 
      getPromise(1, 20, true),
    ]

    mulig(promises, 
      () => {},
      (error) => {
        check(done, () =>
          expect(true).to.equal((error instanceof Error)))
      })
  })


  it('error function returns index', (done) => {
    const promises = [
      getPromise(1, 20), 
      getPromise(1, 10, true),
    ]

    const expects = 1

    mulig(promises, 
      () => {},
      (error, index) => {
        check(done, () =>
          expect(index).to.equal(expects))
      })
  })

  it('isDone is called when all promises have resolved', (done) => {
    const promises = [
      getPromise(1, 20), 
      getPromise(1, 10),
      getPromise(1, 5),
    ]

    const expects = []

    mulig(promises, 
      (value, index, isDone) => {
        expects.push(value)
        if(isDone){
          check(done, () =>
            expect([1, 1, 1]).to.deep.equal(expects))
        }
      },
      () => {})
  })

  it('success fn should be able to pass value to next success fn', (done) => {
    const promises = [
      getPromise(1, 20), 
      getPromise(1, 10),
      getPromise(1, 5),
    ]

    const expects = 3

    mulig(promises, 
      (value, index, isDone, prev = 0) => {
        if(isDone){
          check(done, () =>
            expect(value + prev).to.equal(expects))
        }

        return value + prev
      },
      () => {})
  })
})


describe('mulig: queue', () => {

  it('promises should resolve in order', (done) => {
    const promises = [
      getPromise(1, 10), 
      getPromise(2, 20),
      getPromise(3, 5),
    ]
    const order = []
    const values = []
    const orderExpect = [0, 1, 2]
    const valuesExpect = [1, 2, 3]

    Promise.all(
      mulig.queue(promises, 
        (value, index) => {
          order.push(index)
          values.push(value)
        },
        () => {}
      )
    )
    .then(() => 
      check(done, () => {
        expect(order).to.deep.equal(orderExpect)
        expect(values).to.deep.equal(valuesExpect)
      }
        
    ))
    .catch(() => {})
  }) 
})

describe('mulig: stack', () => {

  it('promises should resolve in reverse order', (done) => {
    const promises = [
      getPromise(0, 25),
      getPromise(1, 10),
      getPromise(2, 20),
      getPromise(3, 5),
    ]
    const order = []
    const orderExpect = [3, 2, 1, 0]

    Promise.all(
      mulig.stack(promises, 
        (value, index) => {
          order.push(value)
        },
        () => {}
      )
    )
    .then(() => 
      check(done, () =>
      expect(order).to.deep.equal(orderExpect)
    ))
    .catch(() => {})
  })
})